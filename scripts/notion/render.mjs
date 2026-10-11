// Notion 블록 → 사이트의 Markdown/MDX. 사이트 디자인으로 다시 그리기 위한 변환기다.
// ctx: { slug, idToSlug: Map<pageId, slug>, warn(msg), downloads: {url, dest}[] }

const stripId = (id) => id.replaceAll('-', '');

// 일반 글자에서 Markdown/MDX가 오해할 문자를 막는다
const esc = (s) => s.replace(/[\\*_~`[\]<>{}$|]/g, (c) => (c === '<' ? '&lt;' : c === '>' ? '&gt;' : `\\${c}`));

export function richText(items, ctx, { plain = false } = {}) {
  return items
    .map((t) => {
      if (t.type === 'equation') return plain ? t.equation.expression : `$${t.equation.expression.trim()}$`;
      let text = t.plain_text;
      if (plain) return text;
      const a = t.annotations ?? {};
      const mentioned = t.type === 'mention' && t.mention?.type === 'page' ? ctx.idToSlug.get(stripId(t.mention.page.id)) : null;
      const href = mentioned ? `/knowledge/${mentioned}/` : t.href;
      if (a.code) text = `\`${text.replaceAll('`', "'")}\``;
      else text = esc(text);
      if (a.bold) text = `<strong>${text}</strong>`;
      if (a.italic) text = `<em>${text}</em>`;
      if (a.strikethrough) text = `<del>${text}</del>`;
      if (a.underline) text = `<u>${text}</u>`;
      return href ? `[${text}](${href})` : text;
    })
    .join('');
}

const indent = (lines, pad) => lines.map((l) => (l ? pad + l : l));

function hashName(block) {
  return stripId(block.id).slice(0, 8);
}

function extOf(url, fallback) {
  const m = new URL(url).pathname.match(/\.([a-z0-9]{2,5})$/i);
  return (m ? m[1] : fallback).toLowerCase();
}

function fileUrl(f) {
  return f.type === 'file' ? f.file.url : f.external.url;
}

function renderChildren(blocks, ctx) {
  const out = [];
  let prevList = false;
  for (const b of blocks ?? []) {
    const lines = renderBlock(b, ctx);
    if (!lines.length) continue;
    const isList = b.type === 'bulleted_list_item' || b.type === 'numbered_list_item' || b.type === 'to_do';
    if (out.length && !(isList && prevList)) out.push('');
    out.push(...lines);
    prevList = isList;
  }
  return out;
}

function renderBlock(b, ctx) {
  const d = b[b.type];
  switch (b.type) {
    case 'paragraph':
      return d.rich_text.length ? [richText(d.rich_text, ctx), ...(b.children ? ['', ...renderChildren(b.children, ctx)] : [])] : [];
    case 'heading_1':
    case 'heading_2':
    case 'heading_3': {
      // 사이트의 H1은 글 제목이므로 한 단계씩 내린다. 제목에는 수식을 넣지 않는다(CLAUDE.md §9)
      const level = Number(b.type.slice(-1)) + 1;
      if (d.rich_text.some((t) => t.type === 'equation')) ctx.warn(`제목 안의 수식은 글자로만 표시됩니다: "${richText(d.rich_text, ctx, { plain: true })}"`);
      const head = `${'#'.repeat(level)} ${richText(d.rich_text, ctx, { plain: true }).replace(/\n/g, ' ')}`;
      return [head, ...(b.children ? ['', ...renderChildren(b.children, ctx)] : [])];
    }
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'to_do': {
      const mark = b.type === 'numbered_list_item' ? '1. ' : b.type === 'to_do' ? `- [${d.checked ? 'x' : ' '}] ` : '- ';
      const kids = renderChildren(b.children, ctx);
      return [mark + richText(d.rich_text, ctx), ...indent(kids, ' '.repeat(mark.length))];
    }
    case 'toggle': {
      return ['<details>', '', `<summary>${richText(d.rich_text, ctx)}</summary>`, '', ...renderChildren(b.children, ctx), '', '</details>'];
    }
    case 'quote':
      return [richText(d.rich_text, ctx), ...(b.children ? ['', ...renderChildren(b.children, ctx)] : [])].flatMap((l) => (l === '' ? ['>'] : [`> ${l}`]));
    case 'callout': {
      const icon = d.icon?.emoji ?? '';
      const kind = ['⚠️', '🚧', '❗', '🛑'].includes(icon) ? 'stuck' : ['💡', '🧠', '✨'].includes(icon) ? 'intuition' : 'note';
      const body = [richText(d.rich_text, ctx), ...(b.children ? ['', ...renderChildren(b.children, ctx)] : [])];
      // .md에서 쓰는 원시 HTML. 모양은 prose.css의 .callout이 정한다 (MDX는 수식의 중괄호와 충돌할 수 있어 쓰지 않는다)
      return [`<div class="callout" role="note" data-kind="${kind}">`, '', ...body, '', '</div>'];
    }
    case 'code': {
      const lang = d.language === 'plain text' ? 'text' : d.language.replace(/\s+/g, '-');
      const code = d.rich_text.map((t) => t.plain_text).join('');
      const fence = code.includes('```') ? '````' : '```';
      return [`${fence}${lang}`, ...code.split('\n'), fence];
    }
    case 'equation':
      return ['$$', d.expression.trim(), '$$'];
    case 'divider':
      return ['---'];
    case 'table': {
      const rows = (b.children ?? []).map((r) => r.table_row.cells.map((c) => richText(c, ctx).replaceAll('|', '\\|').replace(/\n/g, ' ')));
      if (!rows.length) return [];
      const [head, ...rest] = rows;
      const line = (cells) => `| ${cells.join(' | ')} |`;
      return [line(head), line(head.map(() => '---')), ...rest.map(line)];
    }
    case 'image': {
      const url = fileUrl(d);
      const name = `${hashName(b)}.${extOf(url, 'png')}`;
      ctx.downloads.push({ url, dest: `public/images/knowledge/${ctx.slug}/${name}` });
      const alt = richText(d.caption, ctx, { plain: true }).replace(/[\[\]]/g, '');
      return [`![${alt}](/images/knowledge/${ctx.slug}/${name})`];
    }
    case 'file':
    case 'embed':
    case 'pdf': {
      const url = b.type === 'embed' ? d.url : fileUrl(d);
      const name = d.name ?? '';
      if (b.type === 'file' && /\.html?$/i.test(name || new URL(url).pathname)) {
        const file = `${hashName(b)}.html`;
        ctx.downloads.push({ url, dest: `public/labs/${ctx.slug}/${file}` });
        const title = richText(d.caption, ctx, { plain: true }) || name.replace(/\.html?$/i, '') || ctx.slug;
        const attr = title.replace(/"/g, '&quot;');
        return [`<div class="embed"><iframe src="/labs/${ctx.slug}/${file}" title="${attr}" loading="lazy" sandbox="allow-scripts" style="height:420px"></iframe></div>`];
      }
      ctx.warn(`지원하지 않는 ${b.type} 블록은 건너뜁니다 (HTML 파일만 지원): ${name || url.slice(0, 60)}`);
      return [];
    }
    case 'bookmark':
    case 'link_preview':
      return [`[${esc(d.url)}](${d.url})`];
    case 'table_of_contents':
    case 'breadcrumb':
      return [];
    case 'column_list':
      return (b.children ?? []).flatMap((c) => [...renderChildren(c.children, ctx), '']);
    default:
      ctx.warn(`지원하지 않는 블록 "${b.type}"은 건너뜁니다`);
      return [];
  }
}

export function renderNote(blocks, ctx) {
  return renderChildren(blocks, ctx).join('\n') + '\n';
}
