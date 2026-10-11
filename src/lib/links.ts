// 글 사이의 관계(links) 해석: 존재 검증, 선행 순환 검증, 한쪽 선언을 양쪽에 보여 주는 역링크 계산.
// 관계는 한쪽에만 선언하고 반대쪽은 여기서 계산한다 (CLAUDE.md §3-8). 컴포넌트는 결과만 그린다.
import { getEntries } from '@/lib/content';

export type LinkType = 'knowledge' | 'project' | 'writing';
type Rel = 'related' | 'prerequisite' | 'builds-on' | 'explains';

export interface Ref {
  type: LinkType;
  slug: string;
  title: string;
  href: string;
}

export interface RelationGroup {
  label: string;
  items: Ref[];
}

interface Node {
  ref: Ref;
  file: string;
  links: { type: LinkType; slug: string; rel: Rel }[];
}

const keyOf = (type: LinkType, slug: string) => `${type}:${slug}`;

async function loadNodes(): Promise<Map<string, Node>> {
  const [knowledge, projects, writing] = await Promise.all([getEntries('knowledge'), getEntries('projects'), getEntries('writing')]);
  const nodes = new Map<string, Node>();
  const add = (type: LinkType, section: string, e: { id: string; filePath?: string; data: { title: string; links: Node['links'] } }) =>
    nodes.set(keyOf(type, e.id), {
      ref: { type, slug: e.id, title: e.data.title, href: `/${section}/${e.id}/` },
      file: e.filePath ?? `${section}/${e.id}`,
      links: e.data.links,
    });
  knowledge.forEach((e) => add('knowledge', 'knowledge', e));
  projects.forEach((e) => add('project', 'projects', e));
  writing.forEach((e) => add('writing', 'writing', e));
  return nodes;
}

/** 없는 글을 가리키는 link와 선행(prerequisite)의 순환을 빌드 시점에 막는다 */
export async function validateLinks(): Promise<void> {
  const nodes = await loadNodes();
  for (const node of nodes.values()) {
    for (const l of node.links) {
      if (!nodes.has(keyOf(l.type, l.slug))) {
        throw new Error(`${node.file}: links가 없는 글을 가리킨다 → ${l.type}/${l.slug} (파일명이 slug이고, draft는 프로덕션 빌드에 없다)`);
      }
    }
  }
  // 선행 순환: knowledge끼리의 prerequisite만 본다
  const state = new Map<string, 1 | 2>();
  const visit = (key: string, trail: string[]): void => {
    if (state.get(key) === 2) return;
    if (state.get(key) === 1) throw new Error(`prerequisite가 순환한다: ${[...trail, key].map((k) => k.replace('knowledge:', '')).join(' → ')}`);
    state.set(key, 1);
    for (const l of nodes.get(key)?.links ?? []) {
      if (l.type === 'knowledge' && l.rel === 'prerequisite') visit(keyOf('knowledge', l.slug), [...trail, key]);
    }
    state.set(key, 2);
  };
  for (const key of nodes.keys()) if (key.startsWith('knowledge:')) visit(key, []);
}

// 이 글이 선언한 관계(나가는 방향)의 이름
const OUTGOING: Record<Rel, string> = {
  prerequisite: 'Prerequisite',
  'builds-on': 'Builds on',
  explains: 'Explains',
  related: 'Related',
};

// 다른 글이 이 글을 가리킬 때(들어오는 방향)의 이름
function incomingLabel(from: LinkType, rel: Rel): string {
  if (rel === 'prerequisite') return 'Leads to';
  if (rel === 'builds-on') return from === 'project' ? 'Built' : 'Extended in';
  if (rel === 'explains') return 'Explained in';
  return 'Related';
}

const GROUP_ORDER = ['Prerequisite', 'Leads to', 'Builds on', 'Extended in', 'Built', 'Explains', 'Explained in', 'Related'];

/** 한 knowledge 글의 관계: 직접 선언한 것 + 다른 글이 선언한 것(역링크)을 묶어서, 비어 있는 묶음은 뺀다 */
export async function getRelations(slug: string): Promise<RelationGroup[]> {
  const nodes = await loadNodes();
  const self = keyOf('knowledge', slug);
  const groups = new Map<string, Map<string, Ref>>();
  const put = (label: string, ref: Ref) => {
    const bucket = groups.get(label) ?? new Map<string, Ref>();
    bucket.set(keyOf(ref.type, ref.slug), ref);
    groups.set(label, bucket);
  };

  for (const l of nodes.get(self)?.links ?? []) {
    const target = nodes.get(keyOf(l.type, l.slug));
    if (target) put(OUTGOING[l.rel], target.ref);
  }
  for (const [key, node] of nodes) {
    if (key === self) continue;
    for (const l of node.links) {
      if (keyOf(l.type, l.slug) === self) put(incomingLabel(node.ref.type, l.rel), node.ref);
    }
  }

  return GROUP_ORDER.filter((label) => groups.has(label)).map((label) => ({
    label,
    items: [...groups.get(label)!.values()].sort((a, b) => a.title.localeCompare(b.title)),
  }));
}
