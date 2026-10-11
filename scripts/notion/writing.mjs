// 노션 Writing DB → src/content/writing/*.md. 책장의 네 층(시·산문·에세이·책갈피)이 Form 값이다.
// notion-sync.mjs가 호출한다. 읽기만 하고 파일은 쓰지 않는다(쓰는 일은 호출한 쪽이 한다).
import { renderNote, richText } from './render.mjs';
import { KEBAB, kstDate, text, yamlStr } from './util.mjs';

export const WRITING_DB = 'd4e55522-0283-4091-9260-68fc574a9d24';

// 노션 Form 값 → 사이트 kind (content.config.ts의 enum과 같아야 한다)
const KINDS = { 시: 'poem', 산문: 'prose', 에세이: 'essay', 책갈피: 'bookmark' };

/** 한 문단의 글자를 줄 단위로: 줄바꿈은 <br>(\), 줄머리 공백은 보존, 줄머리의 Markdown 기호는 글자로 */
function fixLines(lines) {
  return lines
    .map((l) => {
      if (l.trim() === '') return '&nbsp;';
      const kept = l.replace(/^ +/, (m) => '&nbsp;'.repeat(m.length));
      return kept.replace(/^([#+-])/, '\\$1').replace(/^(\d+)([.)])/, '$1\\$2');
    })
    .join('\\\n');
}

const emptyParagraph = (b) => b.type === 'paragraph' && !b.children && b.paragraph.rich_text.length === 0;
const plainParagraph = (b) => b.type === 'paragraph' && !b.children && b.paragraph.rich_text.length > 0;

/**
 * 본문 변환. 시는 Enter로 나눈 줄을 한 연으로 묶고(빈 줄 = 연 구분), 나머지는 문단 하나씩이다.
 * 문단 안의 줄바꿈(Shift+Enter)은 모든 Form에서 그대로 살린다. 문단이 아닌 블록은 renderNote에 맡긴다.
 */
export function renderWriting(blocks, kind, ctx) {
  const out = [];
  let run = []; // 문단이 아닌 블록이 이어지는 구간 (목록이 끊기지 않게 한 번에 변환)
  let stanza = []; // 시: 이어진 문단들의 줄
  const flushRun = () => {
    if (run.length) out.push(renderNote(run, ctx).trimEnd());
    run = [];
  };
  const flushStanza = () => {
    if (stanza.length) out.push(fixLines(stanza));
    stanza = [];
  };
  const linesOf = (b) => richText(b.paragraph.rich_text, ctx).split('\n');

  for (const b of blocks) {
    if (plainParagraph(b)) {
      flushRun();
      if (kind === 'poem') stanza.push(...linesOf(b));
      else out.push(fixLines(linesOf(b)));
    } else if (emptyParagraph(b)) {
      flushRun();
      flushStanza();
    } else {
      flushStanza();
      run.push(b);
    }
  }
  flushStanza();
  flushRun();
  return out.join('\n\n') + '\n';
}

/** 공개 체크된 글만 { outputs: [{file, content}], downloads } 로 돌려준다 */
export async function readWriting({ api, warn }) {
  const rows = await api.queryAll(WRITING_DB);
  const outputs = [];
  const downloads = [];
  const slugs = new Set();

  for (const r of rows) {
    const p = r.properties;
    if (!p.Publish?.checkbox) continue;
    const title = text(p.Name);
    const slug = text(p.Slug);
    const kind = KINDS[p.Form?.select?.name];
    if (!kind) {
      warn(`[Writing] "${title}"의 Form이 비었거나 시/산문/에세이/책갈피가 아니라서 올리지 않습니다.`);
      continue;
    }
    if (!KEBAB.test(slug)) {
      warn(`[Writing] "${title}"의 Slug가 비었거나 형식이 틀려 올리지 않습니다 (영문 소문자-하이픈).`);
      continue;
    }
    if (slugs.has(slug)) {
      warn(`[Writing] Slug "${slug}"가 중복되어 두 번째 글은 올리지 않습니다 ("${title}").`);
      continue;
    }
    slugs.add(slug);

    // 이미지는 public/images/writing/<slug>/ 로 내려받고, HTML 파일 임베드는 Writing에서 쓰지 않는다
    const ctx = { slug, area: 'writing', labs: false, idToSlug: new Map(), downloads, warn: (m) => warn(`[Writing/${slug}] ${m}`) };
    const body = renderWriting(await api.blockTree(r.id), kind, ctx);

    const date = p.Written?.date?.start?.slice(0, 10) ?? kstDate(r.created_time);
    const tags = (p.Tags?.multi_select ?? []).map((t) => t.name).filter((t) => KEBAB.test(t) || (warn(`[Writing/${slug}] 태그 "${t}"는 형식(영문 소문자-하이픈)이 틀려 뺍니다.`), false));
    const desc = text(p.Description);
    const source = text(p.Source);
    const fm = ['---', `title: ${yamlStr(title)}`, `date: ${date}`, `kind: ${kind}`];
    if (desc) fm.push(`description: ${yamlStr(desc)}`);
    if (source) fm.push(`source: ${yamlStr(source)}`);
    if (tags.length) fm.push(`tags: [${tags.join(', ')}]`);
    fm.push('---', '');
    outputs.push({ file: `src/content/writing/${slug}.md`, content: fm.join('\n') + '\n' + body });
  }
  return { outputs, downloads };
}
