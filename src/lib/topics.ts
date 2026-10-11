// Knowledge의 topic 트리와 정렬. DOM·getCollection 없이 데이터만 다루는 순수 함수다 (docs/05 4.3절).
//
// topic은 `분야/세부분야[/묶음]` 경로다. 화면은 세 걸음이다: 분야 목록(/knowledge/) → 세부분야 목록(분야 페이지) → 글 목록(세부분야 페이지).
// 세 번째 조각(묶음)은 따로 페이지를 만들지 않고, 세부분야 페이지의 글 목록 안에서 소제목으로만 쓴다. 4단계 이상은 3단계로 모은다.
// 주제 페이지의 주소는 /knowledge/topics/<경로>/ 이고, 글의 주소는 topic과 무관하다 (CLAUDE.md §3-2).
// 표시 이름·설명·순서는 data/topics.yaml, 없으면 경로를 보기 좋게 바꿔 쓴다.
import type { CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'knowledge'>;
export interface TopicConfigItem {
  path: string;
  name: string;
  description?: string;
}

/** 세부분야 페이지 안의 소제목 하나 */
export interface NoteGroup {
  path: string;
  name: string;
  notes: Note[];
}

export interface TopicNode {
  path: string;
  name: string;
  description?: string;
  /** 이 노드 아래 전체 글 수 (하위 포함) */
  count: number;
  /** 이 노드에 직접 속한 글 (정렬됨). 분야 노드에서는 세부분야 없이 분야에만 속한 글 */
  notes: Note[];
  /** 세부분야 노드의 글을 묶음(topic의 세 번째 조각)별로 나눈 것. 묶음이 없으면 비어 있고 notes만 쓴다 */
  groups: NoteGroup[];
  children: TopicNode[];
}

const ACRONYMS = new Set(['ai', 'ml', 'nlp', 'cv', 'rl', 'gpu', 'cpu', 'ros', 'ros2', 'bci']);

export const topicHref = (path: string): string => `/knowledge/topics/${path}/`;

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

/** 글의 topic 경로를 2단계까지의 breadcrumb으로 만든다 (각각 주제 페이지로 간다) */
export function topicCrumbs(topic: string, config: readonly TopicConfigItem[]): { path: string; name: string; href: string }[] {
  const segs = topic.split('/').slice(0, 2);
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

const pathCompare = (config: readonly TopicConfigItem[]) => (a: { path: string; name: string }, b: { path: string; name: string }) =>
  configIndex(a.path, config) - configIndex(b.path, config) || a.name.localeCompare(b.name);

const describe = (path: string, config: readonly TopicConfigItem[]) => config.find((t) => t.path === path)?.description;

/** 세부분야 안의 글을 묶음(세 번째 조각) 순서대로, 묶음 안에서는 sortNotes 순서로 나눈다. 묶음 없는 글은 맨 앞 */
function splitGroups(sub: string, notes: readonly Note[], config: readonly TopicConfigItem[]): NoteGroup[] {
  const by = new Map<string, Note[]>();
  for (const n of notes) {
    const third = n.data.topic.split('/')[2] ?? '';
    by.set(third, [...(by.get(third) ?? []), n]);
  }
  return [...by]
    .map(([third, list]) => {
      const path = third ? `${sub}/${third}` : sub;
      return { path, name: third ? topicName(path, config) : '', notes: sortNotes(list) };
    })
    .sort((a, b) => (a.name === '' ? -1 : b.name === '' ? 1 : pathCompare(config)(a, b)));
}

export function buildTopicTree(entries: readonly Note[], config: readonly TopicConfigItem[]): TopicNode[] {
  type Field = { direct: Note[]; subs: Map<string, Note[]> };
  const fields = new Map<string, Field>();
  for (const entry of entries) {
    const [field, sub] = entry.data.topic.split('/');
    const f: Field = fields.get(field) ?? { direct: [], subs: new Map<string, Note[]>() };
    if (sub) f.subs.set(sub, [...(f.subs.get(sub) ?? []), entry]);
    else f.direct.push(entry);
    fields.set(field, f);
  }

  const nodes: TopicNode[] = [];
  for (const [field, f] of fields) {
    const children: TopicNode[] = [...f.subs].map(([sub, notes]) => {
      const path = `${field}/${sub}`;
      const groups = splitGroups(path, notes, config);
      return {
        path,
        name: topicName(path, config),
        description: describe(path, config),
        count: notes.length,
        notes: groups.flatMap((g) => g.notes),
        groups: groups.some((g) => g.name !== '') ? groups : [],
        children: [],
      };
    });
    children.sort(pathCompare(config));
    nodes.push({
      path: field,
      name: topicName(field, config),
      description: describe(field, config),
      count: f.direct.length + children.reduce((sum, c) => sum + c.count, 0),
      notes: sortNotes(f.direct),
      groups: [],
      children,
    });
  }
  return nodes.sort(pathCompare(config));
}

// ───────── 목록 페이지용 요약 ─────────

export const STATUS_ORDER = ['evergreen', 'growing', 'seed'] as const;

export function countByStatus(entries: readonly Note[]): Record<(typeof STATUS_ORDER)[number], number> {
  const counts = { evergreen: 0, growing: 0, seed: 0 };
  for (const e of entries) counts[e.data.status] += 1;
  return counts;
}

/** 같은 세부분야(묶음 순서 포함) 안에서 정렬된 순서 기준의 이전·다음 글 */
export function neighborsInTopic(entries: readonly Note[], current: Note, config: readonly TopicConfigItem[]): { prev?: Note; next?: Note } {
  const sub = current.data.topic.split('/').slice(0, 2).join('/');
  const same = entries.filter((e) => e.data.topic.split('/').slice(0, 2).join('/') === sub);
  const list = splitGroups(sub, same, config).flatMap((g) => g.notes);
  const i = list.findIndex((e) => e.id === current.id);
  return { prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}
