// Knowledge의 topic 트리와 정렬. DOM·getCollection 없이 데이터만 다루는 순수 함수다 (docs/05 4.3절).
//
// topic은 `분야/세부분야` 경로다. 트리는 2단계까지만 만든다: 3단계 이상(a/b/c)은 2단계(a/b) 아래에 평평하게 모인다.
// URL에는 쓰지 않는다 (CLAUDE.md §3-2). 표시 이름·순서는 data/topics.yaml, 없으면 경로를 보기 좋게 바꿔 쓴다.
import type { CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'knowledge'>;
export interface TopicConfigItem {
  path: string;
  name: string;
}

export interface TopicNode {
  path: string;
  name: string;
  /** 목록 페이지의 앵커 id (#topic-mathematics-linear-algebra) */
  anchor: string;
  /** 이 노드 아래 전체 글 수 (하위 포함) */
  count: number;
  /** 이 노드에 직접 속한 글 (정렬됨) */
  notes: Note[];
  children: TopicNode[];
}

const ACRONYMS = new Set(['ai', 'ml', 'nlp', 'cv', 'rl', 'gpu', 'cpu', 'ros', 'ros2', 'bci']);

export function topicAnchor(path: string): string {
  return `topic-${path.replaceAll('/', '-')}`;
}

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

/** 글의 topic 경로를 2단계까지의 breadcrumb으로 만든다 */
export function topicCrumbs(topic: string, config: readonly TopicConfigItem[]): { path: string; name: string; anchor: string }[] {
  const segs = topic.split('/').slice(0, 2);
  return segs.map((_, i) => {
    const path = segs.slice(0, i + 1).join('/');
    return { path, name: topicName(path, config), anchor: topicAnchor(path) };
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

const nodeCompare = (config: readonly TopicConfigItem[]) => (a: TopicNode, b: TopicNode) =>
  configIndex(a.path, config) - configIndex(b.path, config) || a.name.localeCompare(b.name);

export function buildTopicTree(entries: readonly Note[], config: readonly TopicConfigItem[]): TopicNode[] {
  const fields = new Map<string, { direct: Note[]; subs: Map<string, Note[]> }>();
  type Group = { direct: Note[]; subs: Map<string, Note[]> };
  for (const entry of entries) {
    const [field, sub] = entry.data.topic.split('/');
    const group: Group = fields.get(field) ?? { direct: [], subs: new Map<string, Note[]>() };
    if (sub) group.subs.set(sub, [...(group.subs.get(sub) ?? []), entry]);
    else group.direct.push(entry);
    fields.set(field, group);
  }

  const nodes: TopicNode[] = [];
  for (const [field, group] of fields) {
    const children: TopicNode[] = [...group.subs].map(([sub, notes]) => {
      const path = `${field}/${sub}`;
      return { path, name: topicName(path, config), anchor: topicAnchor(path), count: notes.length, notes: sortNotes(notes), children: [] };
    });
    children.sort(nodeCompare(config));
    nodes.push({
      path: field,
      name: topicName(field, config),
      anchor: topicAnchor(field),
      count: group.direct.length + children.reduce((sum, c) => sum + c.count, 0),
      notes: sortNotes(group.direct),
      children,
    });
  }
  return nodes.sort(nodeCompare(config));
}

// ───────── 목록 페이지용 요약 ─────────

export const STATUS_ORDER = ['evergreen', 'growing', 'seed'] as const;

export function countByStatus(entries: readonly Note[]): Record<(typeof STATUS_ORDER)[number], number> {
  const counts = { evergreen: 0, growing: 0, seed: 0 };
  for (const e of entries) counts[e.data.status] += 1;
  return counts;
}

/** 마지막 갱신(updated, 없으면 date)이 최근인 글 */
export function recentlyUpdated(entries: readonly Note[], limit: number): Note[] {
  const when = (n: Note) => (n.data.updated ?? n.data.date).valueOf();
  return [...entries].sort((a, b) => when(b) - when(a) || a.id.localeCompare(b.id)).slice(0, limit);
}

/** 같은 topic 안에서 정렬된 순서 기준의 이전·다음 글 */
export function neighborsInTopic(entries: readonly Note[], current: Note): { prev?: Note; next?: Note } {
  const list = sortNotes(entries.filter((e) => e.data.topic === current.data.topic));
  const i = list.findIndex((e) => e.id === current.id);
  return { prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}
