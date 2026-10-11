// Writing의 책장: 글을 Form(kind)별 층으로 나누고, 책등(spine)의 크기·색을 정한다. DOM·getCollection 없이 데이터만 다루는 순수 함수다.
// 층의 이름과 순서는 여기 한 곳(SHELVES)에서만 정한다. 노션 Form 값과의 대응은 scripts/notion/writing.mjs.
import type { CollectionEntry } from 'astro:content';
import { formatDate } from '@/lib/format';

export type Piece = CollectionEntry<'writing'>;
export type Kind = Piece['data']['kind'];
export type SpineHue = 'moss' | 'slate' | 'plum' | 'stone' | 'sand' | 'clay';

/** 위에서 아래로 놓이는 층. label은 노션 Form과 같은 한글 이름, en은 작은 부제 */
export const SHELVES: readonly { kind: Kind; label: string; en: string }[] = [
  { kind: 'poem', label: '시', en: 'Poems' },
  { kind: 'prose', label: '산문', en: 'Prose' },
  { kind: 'essay', label: '에세이', en: 'Essays' },
  { kind: 'bookmark', label: '책갈피', en: 'Bookmarks' },
];

export const shelfOf = (kind: Kind) => SHELVES.find((s) => s.kind === kind) ?? SHELVES[0];
export const shelfHref = (kind: Kind) => `/writing/#shelf-${kind}`;
export const pieceHref = (entry: Piece) => `/writing/${entry.id}/`;

export interface Book {
  href: string;
  title: string;
  /** 'YYYY.MM.DD' */
  when: string;
  description?: string;
  /** 책등 크기(rem) */
  width: number;
  height: number;
  /** 제목이 들어가는 줄(세로쓰기 칸) 수 */
  cols: number;
  hue: SpineHue;
}

export interface Shelf {
  kind: Kind;
  id: string;
  label: string;
  en: string;
  books: Book[];
  /** 한 줄(널빤지 한 칸)의 높이(rem): 그 층에서 가장 큰 책 + 올라올 여유 */
  rowH: number;
}

// 같은 slug는 언제나 같은 모양이 되도록 slug로 만든 해시를 쓴다 (새로 고쳐도, 글이 늘어도 책등이 바뀌지 않는다)
function hash(s: string): number {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.codePointAt(0)!, 16777619);
  return h >>> 0;
}

// 색은 이미 있는 태그 색(tokens.css --tag-*)만 쓴다. 층 널빤지가 walnut이라 책등에서는 뺐다
const HUES: readonly SpineHue[] = ['moss', 'slate', 'plum', 'stone', 'sand', 'slate', 'moss', 'clay', 'stone', 'plum'];

const LINE_REM = 0.95; // 세로쓰기에서 글자 한 자가 차지하는 길이
const COL_REM = 1.35; // 제목 한 줄(칸)의 너비
const TRIM_REM = 3; // 위아래 제본 띠와 여백
const MIN_H = 7.5;
const PER_COL = 9; // 한 칸에 들어가는 최대 글자 수. 넘으면 칸이 늘어난다(최대 4칸, 그 이상은 잘린다)

export function bookOf(entry: Piece): Book {
  const h = hash(entry.id);
  const len = [...entry.data.title].length;
  // 긴 제목은 칸 수를 늘려 칸마다 글자 수를 비슷하게 맞춘다 (한 글자만 덩그러니 남는 칸이 없게)
  const cols = Math.min(4, Math.max(1, Math.ceil(len / PER_COL)));
  const perCol = Math.ceil(len / cols);
  const height = Math.max(MIN_H, TRIM_REM + perCol * LINE_REM) + ((h >> 3) % 5) * 0.2;
  const width = 1.3 + cols * COL_REM + ((h >> 7) % 3) * 0.2;
  return {
    href: pieceHref(entry),
    title: entry.data.title,
    when: formatDate(entry.data.date),
    description: entry.data.description,
    width: Math.round(width * 100) / 100,
    height: Math.round(height * 100) / 100,
    cols,
    hue: HUES[h % HUES.length],
  };
}

/** 글이 있는 층만, 정해진 순서로. 각 층의 책은 최신 글이 왼쪽 (entries가 최신순이어야 한다) */
export function buildShelves(entries: readonly Piece[]): Shelf[] {
  return SHELVES.map((s) => {
    const books = entries.filter((e) => e.data.kind === s.kind).map(bookOf);
    const rowH = Math.round((Math.max(0, ...books.map((b) => b.height)) + 1) * 100) / 100;
    return { kind: s.kind, id: `shelf-${s.kind}`, label: s.label, en: s.en, books, rowH };
  }).filter((s) => s.books.length > 0);
}

/** 같은 층에서 한 칸 왼쪽(더 최근)·오른쪽(더 오래된) 글. entries는 최신순 */
export function neighborsOnShelf(entries: readonly Piece[], entry: Piece) {
  const same = entries.filter((e) => e.data.kind === entry.data.kind);
  const i = same.findIndex((e) => e.id === entry.id);
  return { newer: i > 0 ? same[i - 1] : undefined, older: i >= 0 ? same[i + 1] : undefined };
}

export const isUrl = (s: string): boolean => /^https?:\/\//i.test(s);
