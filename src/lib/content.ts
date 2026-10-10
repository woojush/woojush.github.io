// 컬렉션 조회 헬퍼. 페이지/컴포넌트는 getCollection을 직접 부르지 않고 여기를 거친다.
// (draft 제외 같은 규칙을 한 곳에서 관리하기 위해서 — docs/05_folder_structure.md 3절)
import { getCollection, getEntry } from 'astro:content';

export type ListableCollection = 'knowledge' | 'projects' | 'writing';

// draft는 개발 서버에서만 보인다. 프로덕션 빌드에서는 제외된다.
// INCLUDE_DRAFTS=1 로 빌드하면 draft 포함 미리보기 빌드가 된다 (배포용으로 쓰지 않는다).
const includeDrafts = import.meta.env.DEV || process.env.INCLUDE_DRAFTS === '1';

export async function getEntries<C extends ListableCollection>(collection: C) {
  const entries = await getCollection(collection);
  return entries
    .filter((entry) => includeDrafts || !entry.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// singleton 데이터. 파일이 없으면 빌드가 멈추도록 던진다.
export async function getAbout() {
  const entry = await getEntry('about', 'about');
  if (!entry) throw new Error('src/content/about.md 가 없다.');
  return entry;
}

export async function getTimeline() {
  const entry = await getEntry('timeline', 'timeline');
  if (!entry) throw new Error('src/data/timeline.yaml 이 없다.');
  return entry.data.entries;
}

export async function getNow() {
  const entry = await getEntry('now', 'now');
  if (!entry) throw new Error('src/data/now.yaml 이 없다.');
  return entry.data;
}

export interface ContentRow {
  href: string;
  title: string;
  /** 제목 아래/오른쪽에 붙는 설명 (프로젝트는 summary, 글은 종류) */
  meta?: string;
  date?: Date;
}

// HOME의 Projects: 진행 중(active)인 것만. featured가 먼저, 그다음 최신순
export async function getActiveProjects(limit: number): Promise<ContentRow[]> {
  const entries = (await getEntries('projects')).filter((e) => e.data.status === 'active');
  entries.sort((a, b) => Number(b.data.featured) - Number(a.data.featured));
  return entries.slice(0, limit).map((e) => ({
    href: `/projects/${e.id}/`,
    title: e.data.title,
    meta: e.data.summary,
  }));
}

// HOME의 Recent: writing과 knowledge를 합쳐 최신순. projects는 위 Projects에 있으므로 넣지 않는다
export async function getRecentPosts(limit: number): Promise<ContentRow[]> {
  const [writing, knowledge] = await Promise.all([getEntries('writing'), getEntries('knowledge')]);
  const rows: ContentRow[] = [
    ...writing.map((e) => ({ href: `/writing/${e.id}/`, title: e.data.title, meta: 'writing', date: e.data.date })),
    ...knowledge.map((e) => ({ href: `/knowledge/${e.id}/`, title: e.data.title, meta: 'knowledge', date: e.data.date })),
  ];
  return rows.sort((a, b) => b.date!.valueOf() - a.date!.valueOf()).slice(0, limit);
}
