// Writing의 책장: 글을 Form(kind)별 층으로 나누고, 책등(spine)의 크기·색을 정한다. DOM·getCollection 없이 데이터만 다루는 순수 함수다.
// 층의 이름과 순서는 여기 한 곳(SHELVES)에서만 정한다. 노션 Form 값과의 대응은 scripts/notion/writing.mjs.
import type { CollectionEntry } from 'astro:content';
import { formatDate } from '@/lib/format';

export type Piece = CollectionEntry<'writing'>;
export type Kind = Piece['data']['kind'];
export type SpineHue = 'oxblood' | 'navy' | 'forest' | 'ochre' | 'slate' | 'plum' | 'umber' | 'cream' | 'teal' | 'sage' | 'dust' | 'mist';
/** 책의 종류: cloth 천 양장(인쇄 제목), paper 종이 표지(밝음), leather 가죽 양장(금박 제목) */
export type SpineKind = 'cloth' | 'paper' | 'leather';

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
  /** 책등 크기(rem). 두께(width)는 제목 길이와 무관하다 */
  width: number;
  height: number;
  /** 제목 줄(세로쓰기 칸) 수: 1 또는 2 */
  cols: number;
  /** 제목 글자 크기(rem) */
  fs: number;
  kind: SpineKind;
  hue: SpineHue;
  /** 옆 책에 기대어 기울어진 정도(deg). 대부분 0 */
  tilt: number;
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

// 책 종류별로 쓰는 색 (tokens.css --book-*)
const HUES: Record<SpineKind, readonly SpineHue[]> = {
  cloth: ['navy', 'forest', 'slate', 'plum', 'teal', 'umber', 'navy', 'oxblood'],
  paper: ['cream', 'sage', 'dust', 'mist', 'cream'],
  leather: ['oxblood', 'forest', 'navy', 'umber'],
};

const PRINT_REM = 0.78; // 제목 글자 하나가 차지하는 길이(작은 글자 기준)
const TRIM_REM = 3.2; // 위아래 여백과 장식
const MAX_H = 14;

export function bookOf(entry: Piece): Book {
  const h = hash(entry.id);
  const len = [...entry.data.title].length;
  // 두께는 제목과 무관하게 책마다 다르다 (실제 책은 쪽수로 두께가 정해진다)
  const width = 2.5 + ((h >> 7) % 4) * 0.2;
  let height = 10 + ((h >> 3) % 8) * 0.5;
  const fit = (fs: number) => Math.floor((height - TRIM_REM) / (fs * 1.14));
  let cols = 1;
  let fs = 0.92;
  if (len > fit(0.92)) {
    if (len <= fit(0.72)) fs = Math.round(((height - TRIM_REM) / (len * 1.14)) * 100) / 100;
    else {
      cols = 2; // 두께는 그대로, 작은 글자를 두 줄로. 그래도 모자라면 책이 조금 커진다
      fs = 0.72;
      height = Math.min(MAX_H, Math.max(height, TRIM_REM + Math.ceil(len / 2) * PRINT_REM));
    }
  }
  const v = (h >> 19) % 10;
  const kind: SpineKind = v < 5 ? 'cloth' : v < 8 ? 'paper' : 'leather';
  const hues = HUES[kind];
  return {
    href: pieceHref(entry),
    title: entry.data.title,
    when: formatDate(entry.data.date),
    description: entry.data.description,
    width: Math.round(width * 100) / 100,
    height: Math.round(height * 100) / 100,
    cols,
    fs,
    kind,
    hue: hues[h % hues.length],
    // 일곱 권에 한 권쯤 기대어 있다
    tilt: (h >> 11) % 7 === 0 ? ((h >> 14) % 2 ? 1 : -1) * (3 + ((h >> 16) % 3)) : 0,
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
