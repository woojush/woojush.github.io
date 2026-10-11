// Knowledge의 topic 트리와 정렬. DOM·getCollection 없이 데이터만 다루는 순수 함수다 (docs/05 4.3절).
//
// topic은 `분야/세부분야[/더 세부]` 경로(최대 3단계, 그 이상은 3단계로 모음)이고, 경로의 각 단계가 하나의 주제 페이지다.
// 하위 주제가 있는 페이지는 하위 주제들이 떠다니는 화면이고, 하위 주제가 없는 페이지(끝)는 글 목록이다.
// 주제 페이지의 주소는 /knowledge/topics/<경로>/ 이고, 글의 주소는 topic과 무관하다 (CLAUDE.md §3-2).
// 표시 이름·설명·순서는 data/topics.yaml, 없으면 경로를 보기 좋게 바꿔 쓴다.
import type { CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'knowledge'>;
export interface TopicConfigItem {
  path: string;
  name: string;
  description?: string;
}

export interface TopicNode {
  path: string;
  name: string;
  description?: string;
  /** 이 노드 아래 전체 글 수 (하위 포함) */
  count: number;
  /** 이 노드에 직접 속한 글 (정렬됨) */
  notes: Note[];
  children: TopicNode[];
}

const MAX_DEPTH = 3;
const ACRONYMS = new Set(['ai', 'ml', 'nlp', 'cv', 'rl', 'gpu', 'cpu', 'ros', 'ros2', 'bci']);

export const topicHref = (path: string): string => `/knowledge/topics/${path}/`;

const segmentsOf = (topic: string): string[] => topic.split('/').slice(0, MAX_DEPTH);

function segmentLabel(segment: string): string {
  return segment
    .split('-')
    .map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

export function topicName(path: string, config: readonly TopicConfigItem[]): string {
  const hit = config.find((t) => t.path === path);
  if (hit) return hit.name;
  return segmentLabel(path.split('/').at(-1) ?? path);
}

/** 글의 topic 경로를 단계별 breadcrumb으로 만든다 (각각 주제 페이지로 간다) */
export function topicCrumbs(topic: string, config: readonly TopicConfigItem[]): { path: string; name: string; href: string }[] {
  const segs = segmentsOf(topic);
  return segs.map((_, i) => {
    const path = segs.slice(0, i + 1).join('/');
    return { path, name: topicName(path, config), href: topicHref(path) };
  });
}

// ───────── 글 정렬 ─────────

const baseCompare = (a: Note, b: Note): number =>
  (a.data.order ?? Infinity) - (b.data.order ?? Infinity) ||
  a.data.date.valueOf() - b.data.date.valueOf() ||
  a.id.localeCompare(b.id);

/**
 * 같은 목록 안의 글 정렬: order → 날짜(오래된 것 먼저) 순을 기본으로 하되, 선행(prerequisite)으로 선언된 글이 항상 앞에 온다.
 * 교재를 따라 쓴 노트가 읽는 순서대로 나열되게 하려는 것이다.
 */
export function sortNotes(notes: readonly Note[]): Note[] {
  const base = [...notes].sort(baseCompare);
  const ids = new Set(base.map((n) => n.id));
  // 글 → 이 목록 안에서 먼저 와야 하는 글
  const needs = new Map<string, Set<string>>();
  for (const n of base) {
    needs.set(
      n.id,
      new Set(n.data.links.filter((l) => l.type === 'knowledge' && l.rel === 'prerequisite' && ids.has(l.slug) && l.slug !== n.id).map((l) => l.slug)),
    );
  }
  const out: Note[] = [];
  const placed = new Set<string>();
  const rest = [...base];
  while (rest.length > 0) {
    let idx = rest.findIndex((n) => [...needs.get(n.id)!].every((p) => placed.has(p)));
    if (idx < 0) idx = 0; // 순환은 links.ts가 막는다. 방어용
    const [next] = rest.splice(idx, 1);
    out.push(next);
    placed.add(next.id);
  }
  return out;
}

// ───────── 트리 ─────────

function configIndex(path: string, config: readonly TopicConfigItem[]): number {
  const i = config.findIndex((t) => t.path === path);
  return i < 0 ? Infinity : i;
}

export function buildTopicTree(entries: readonly Note[], config: readonly TopicConfigItem[]): TopicNode[] {
  interface Trie {
    notes: Note[];
    kids: Map<string, Trie>;
  }
  const root: Trie = { notes: [], kids: new Map() };
  for (const entry of entries) {
    let node = root;
    for (const seg of segmentsOf(entry.data.topic)) {
      const next: Trie = node.kids.get(seg) ?? { notes: [], kids: new Map() };
      node.kids.set(seg, next);
      node = next;
    }
    node.notes.push(entry);
  }

  const convert = (trie: Trie, prefix: string): TopicNode[] =>
    [...trie.kids]
      .map(([seg, kid]) => {
        const path = prefix ? `${prefix}/${seg}` : seg;
        const children = convert(kid, path);
        return {
          path,
          name: topicName(path, config),
          description: config.find((t) => t.path === path)?.description,
          count: kid.notes.length + children.reduce((sum, c) => sum + c.count, 0),
          notes: sortNotes(kid.notes),
          children,
        };
      })
      .sort((a, b) => configIndex(a.path, config) - configIndex(b.path, config) || a.name.localeCompare(b.name));

  return convert(root, '');
}

/** 트리의 모든 노드를 (조상 목록과 함께) 펼친다. 주제 페이지를 만들 때 쓴다 */
export function flattenTree(tree: readonly TopicNode[], ancestors: TopicNode[] = []): { node: TopicNode; ancestors: TopicNode[] }[] {
  return tree.flatMap((node) => [{ node, ancestors }, ...flattenTree(node.children, [...ancestors, node])]);
}

// ───────── 목록 페이지용 요약 ─────────

export const STATUS_ORDER = ['evergreen', 'growing', 'seed'] as const;

export function countByStatus(entries: readonly Note[]): Record<(typeof STATUS_ORDER)[number], number> {
  const counts = { evergreen: 0, growing: 0, seed: 0 };
  for (const e of entries) counts[e.data.status] += 1;
  return counts;
}

/** 같은 topic 안에서 정렬된 순서 기준의 이전·다음 글 */
export function neighborsInTopic(entries: readonly Note[], current: Note): { prev?: Note; next?: Note } {
  const list = sortNotes(entries.filter((e) => e.data.topic === current.data.topic));
  const i = list.findIndex((e) => e.id === current.id);
  return { prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}
