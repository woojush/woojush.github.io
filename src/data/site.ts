// 사이트 단위 설정. 이름은 실명 'Shin WooJu'로 공개하기로 확정했다(2026-10-10). 사진·연락처 등 나머지 개인정보는 CLAUDE.md "공개 정보 원칙"을 따른다.
export interface SiteLink {
  label: string;
  href: string;
}

export const site = {
  name: 'Shin WooJu', // 실명 공개 확정 (2026-10-10)
  tagline: 'AI Engineering student', // 학교/정체성 표현은 허용
  defaultLang: 'ko',
  // 메뉴는 5개 고정. 추가 조건은 docs/01_information_architecture.md 7절. UI 표기는 소문자, 라벨은 영어.
  // 순서: 외부 방문자가 projects를 먼저 보도록 두 번째에 둔다 (2026-10-10). 탭 디자인은 향후 수정 예정.
  nav: [
    { label: 'home', href: '/' },
    { label: 'projects', href: '/projects/' },
    { label: 'about', href: '/about/' },
    { label: 'knowledge', href: '/knowledge/' },
    { label: 'writing', href: '/writing/' },
  ],
  // 메인 첫 화면 문구. 강조(strong)는 굵기로만 표시한다. 개인정보 없이 방향만 쓴다.
  hero: {
    title: [
      { text: '배우고', strong: true },
      { text: '만들고 설명하고 돌아본 것을' },
      { text: '쌓아 가는 기록.', strong: true },
    ],
    sub: '지식, 프로젝트, 글이 함께 자라는 개인 아카이브.',
  },
  // 푸터 링크 (GitHub 등 외부 링크). 비어 있으면 푸터에 링크 영역을 그리지 않는다.
  // GitHub·이메일은 공개하기로 했고 페이지 완성 후 추가한다 (2026-10-10). 그때까지 비워 둔다.
  // 그 밖의 새 외부 링크/개인정보를 넣기 전에는 사용자에게 확인한다 (CLAUDE.md 4절).
  links: [] as readonly SiteLink[],
} as const;
