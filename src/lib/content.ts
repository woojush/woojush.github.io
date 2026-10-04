// 컬렉션 조회 헬퍼. 페이지/컴포넌트는 getCollection을 직접 부르지 않고 여기를 거친다.
// (draft 제외 같은 규칙을 한 곳에서 관리하기 위해서 — docs/05_folder_structure.md 3절)
import { getCollection } from 'astro:content';

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
