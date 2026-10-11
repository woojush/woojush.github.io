// 노션 Categories·Notes DB → src/content/knowledge/*.md, src/data/topics.yaml, public/images|labs.
// 실행: NOTION_TOKEN=... node scripts/notion-sync.mjs   (GitHub Actions의 "Sync Notion" 워크플로가 호출한다)
// 노션 쪽을 못 읽으면 아무 파일도 건드리지 않고 실패한다. Knowledge는 전부 이 스크립트가 만든다(손으로 쓴 노트는 지워진다).
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createApi } from './notion/api.mjs';
import { renderNote } from './notion/render.mjs';

const CATEGORIES_DB = '166b9336-ea3d-4110-8a58-9275fae88f35';
const NOTES_DB = 'be04da52-a2f1-4422-bf11-b350b6ee880a';
const HUES = new Set(['walnut', 'moss', 'slate', 'clay', 'sand', 'plum', 'stone']);
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_DEPTH = 3;

const token = process.env.NOTION_TOKEN;
if (!token) {
  console.error('NOTION_TOKEN이 없습니다.');
  process.exit(1);
}
const api = createApi(token);
const warnings = [];
const warn = (msg) => {
  warnings.push(msg);
  console.warn(`::warning::${msg}`);
};

// ── 속성 읽기 ──
const text = (p) => (p?.rich_text ?? p?.title ?? []).map((t) => t.plain_text).join('').trim();
const rel = (p) => (p?.relation ?? []).map((r) => r.id.replaceAll('-', ''));
const kstDate = (iso) => new Date(new Date(iso).getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const yamlStr = (s) => JSON.stringify(s);

// ── 카테고리 트리 ──
const catRows = await api.queryAll(CATEGORIES_DB);
const cats = new Map();
for (const r of catRows) {
  const p = r.properties;
  const id = r.id.replaceAll('-', '');
  const slug = text(p.Slug);
  const name = text(p.Name);
  if (!name) continue;
  if (!KEBAB.test(slug)) {
    warn(`카테고리 "${name}"의 Slug가 비었거나 형식이 틀려 건너뜁니다 (영문 소문자-하이픈).`);
    continue;
  }
  const color = p.Color?.select?.name;
  cats.set(id, { id, name, slug, order: p.Order?.number ?? 1e9, color: HUES.has(color) ? color : undefined, parent: rel(p.Parent)[0] });
}
const pathOf = (c, seen = new Set()) => {
  if (seen.has(c.id)) throw new Error(`카테고리 "${c.name}"의 Parent가 순환합니다.`);
  seen.add(c.id);
  const parent = c.parent && cats.get(c.parent);
  return parent ? `${pathOf(parent, seen)}/${c.slug}` : c.slug;
};
for (const c of cats.values()) c.path = pathOf(c);
for (const c of cats.values()) if (c.path.split('/').length > MAX_DEPTH) warn(`카테고리 "${c.name}"는 ${MAX_DEPTH}단계를 넘습니다. 글은 ${MAX_DEPTH}단계로 모입니다.`);

// ── 글 ──
const noteRows = await api.queryAll(NOTES_DB);
const notes = [];
const slugs = new Set();
for (const r of noteRows) {
  const p = r.properties;
  if (!p.Publish?.checkbox) continue;
  const title = text(p.Name);
  const slug = text(p.Slug);
  if (!KEBAB.test(slug)) {
    warn(`글 "${title}"의 Slug가 비었거나 형식이 틀려 올리지 않습니다 (영문 소문자-하이픈).`);
    continue;
  }
  if (slugs.has(slug)) {
    warn(`Slug "${slug}"가 중복되어 두 번째 글은 올리지 않습니다 ("${title}").`);
    continue;
  }
  const cat = cats.get(rel(p.Category)[0]);
  if (!cat) {
    warn(`글 "${title}"에 Category가 없어 올리지 않습니다.`);
    continue;
  }
  slugs.add(slug);
  notes.push({ row: r, id: r.id.replaceAll('-', ''), title, slug, cat, p });
}
const idToSlug = new Map(notes.map((n) => [n.id, n.slug]));

// ── 본문 변환 ──
const downloads = [];
const outputs = [];
for (const n of notes) {
  const ctx = { slug: n.slug, idToSlug, downloads, warn: (m) => warn(`[${n.slug}] ${m}`) };
  const body = renderNote(await api.blockTree(n.row.id), ctx);
  const p = n.p;
  const tags = (p.Tags?.multi_select ?? []).map((t) => t.name).filter((t) => KEBAB.test(t) || (warn(`[${n.slug}] 태그 "${t}"는 형식(영문 소문자-하이픈)이 틀려 뺍니다.`), false));
  const prereq = rel(p.Prerequisites).map((id) => idToSlug.get(id)).filter(Boolean);
  const created = kstDate(n.row.created_time);
  const edited = kstDate(n.row.last_edited_time);
  const fm = ['---', `title: ${yamlStr(n.title)}`, `date: ${created}`];
  if (edited > created) fm.push(`updated: ${edited}`);
  const desc = text(p.Description);
  if (desc) fm.push(`description: ${yamlStr(desc)}`);
  fm.push(`topic: ${n.cat.path.split('/').slice(0, MAX_DEPTH).join('/')}`, `status: ${p.Status?.select?.name ?? 'seed'}`);
  if (typeof p.Order?.number === 'number') fm.push(`order: ${p.Order.number}`);
  if (tags.length) fm.push(`tags: [${tags.join(', ')}]`);
  if (prereq.length) fm.push('links:', ...prereq.map((s) => `  - { type: knowledge, slug: ${s}, rel: prerequisite }`));
  fm.push('---', '');
  outputs.push({ file: `src/content/knowledge/${n.slug}.md`, content: fm.join('\n') + '\n' + body });
}

// ── topics.yaml (lead는 기존 값을 유지) ──
const oldYaml = await readFile('src/data/topics.yaml', 'utf8').catch(() => '');
const lead = oldYaml.match(/^lead:.*$/m)?.[0] ?? 'lead: ""';
const kids = new Map();
for (const c of cats.values()) kids.set(c.parent ?? '', [...(kids.get(c.parent ?? '') ?? []), c]);
const walk = (parent) =>
  (kids.get(parent) ?? [])
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .flatMap((c) => [c, ...walk(c.id)]);
const topicLines = walk('').map((c) => {
  const f = [`path: ${c.path}`, `name: ${yamlStr(c.name)}`];
  if (c.color) f.push(`color: ${c.color}`);
  return `  - { ${f.join(', ')} }`;
});
const topicsYaml = [
  '# 이 파일은 노션 Categories DB에서 scripts/notion-sync.mjs가 만든다. 직접 고치지 말고 노션에서 고친다.',
  '# lead만 손으로 쓴다(동기화가 유지한다).',
  lead,
  'topics:',
  ...topicLines,
  '',
].join('\n');

// ── 여기까지 노션을 다 읽었다. 이제 파일을 바꾼다 ──
const wipe = async (dir) => {
  for (const f of await readdir(dir).catch(() => [])) if (f !== '.gitkeep') await rm(`${dir}/${f}`, { recursive: true, force: true });
};
await wipe('src/content/knowledge');
await wipe('public/images/knowledge');
for (const n of notes) await rm(`public/labs/${n.slug}`, { recursive: true, force: true });

const write = async (file, content) => {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
};
for (const o of outputs) await write(o.file, o.content);
await write('src/data/topics.yaml', topicsYaml);

// 노션의 파일 주소는 한 시간쯤 뒤 만료되므로 지금 저장소로 내려받는다
for (const d of downloads) {
  const res = await fetch(d.url);
  if (!res.ok) {
    warn(`파일을 내려받지 못했습니다 (${res.status}): ${d.dest}`);
    continue;
  }
  await write(d.dest, Buffer.from(await res.arrayBuffer()));
}

console.log(`카테고리 ${cats.size}개, 글 ${notes.length}편, 파일 ${downloads.length}개, 경고 ${warnings.length}건`);
