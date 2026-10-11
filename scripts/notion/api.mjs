// Notion REST API 호출 (의존성 없이 fetch만 쓴다). 토큰은 환경변수 NOTION_TOKEN에서만 읽는다.
const BASE = 'https://api.notion.com/v1';
const VERSION = '2022-06-28';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function createApi(token) {
  async function call(path, init = {}, attempt = 0) {
    const res = await fetch(BASE + path, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': VERSION,
        'Content-Type': 'application/json',
      },
    });
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await sleep(Number(res.headers.get('retry-after') ?? 1) * 1000 + attempt * 500);
      return call(path, init, attempt + 1);
    }
    if (!res.ok) throw new Error(`Notion API ${res.status} ${path}: ${(await res.text()).slice(0, 300)}`);
    return res.json();
  }

  /** DB의 모든 행 (페이지네이션 처리) */
  async function queryAll(databaseId) {
    const rows = [];
    let cursor;
    do {
      const body = JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) });
      const r = await call(`/databases/${databaseId}/query`, { method: 'POST', body });
      rows.push(...r.results);
      cursor = r.has_more ? r.next_cursor : undefined;
    } while (cursor);
    return rows;
  }

  /** 블록의 자식들을 재귀적으로 가져와 block.children에 붙인다 */
  async function blockTree(blockId) {
    const blocks = [];
    let cursor;
    do {
      const q = `?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`;
      const r = await call(`/blocks/${blockId}/children${q}`);
      blocks.push(...r.results);
      cursor = r.has_more ? r.next_cursor : undefined;
    } while (cursor);
    for (const b of blocks) {
      if (b.has_children && b.type !== 'child_page' && b.type !== 'child_database') b.children = await blockTree(b.id);
    }
    return blocks;
  }

  return { queryAll, blockTree };
}
