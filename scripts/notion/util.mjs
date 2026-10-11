// 노션 속성 읽기 도우미. notion-sync.mjs(Knowledge)와 writing.mjs가 함께 쓴다.
export const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const text = (p) => (p?.rich_text ?? p?.title ?? []).map((t) => t.plain_text).join('').trim();
export const rel = (p) => (p?.relation ?? []).map((r) => r.id.replaceAll('-', ''));
export const kstDate = (iso) => new Date(new Date(iso).getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
export const yamlStr = (s) => JSON.stringify(s);
