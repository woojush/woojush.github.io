// 사이트 단위 설정. 이름은 실명 'Shin WooJu'로 공개하기로 확정했다(2026-10-10). 화면 맨 위 왼쪽 고정 표기(`mark`)만 'J'다(2026-10-11 사용자 지시). 사진·연락처 등 나머지 개인정보는 CLAUDE.md "공개 정보 원칙"을 따른다.
export interface SiteLink {
  label: string;
  href: string;
}

export const site = {
  name: 'Shin WooJu', // 실명 공개 확정 (2026-10-10)
  mark: 'J', // 헤더 맨 왼쪽 위 고정 표기만 (2026-10-11 사용자 지시). 홈·About·제목은 name을 쓴다
  tagline: 'AI Engineering student', // 학교/정체성 표현은 허용
  defaultLang: 'ko',
  // 메뉴는 4개 고정(home은 메뉴에서 뺐다: 이름과 탭 바 가운데 허브가 홈 링크, 2026-10-10). 추가 조건은 docs/01_information_architecture.md 7절.
  // UI 표기는 소문자, 라벨은 영어. 순서: 외부 방문자가 projects를 먼저 보도록 첫 번째에 둔다. 탭 바는 4개를 가운데 허브 양쪽에 둘씩 나눈다.
  nav: [
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
  // 홈 화면(인트로가 끝난 뒤)의 프로필. 한 줄 소개는 About의 lead를 그대로 쓴다. 사진은 public/images/profile.(jpg|jpeg|png|webp)에
  // 사용자가 직접 올린 경우에만 보인다 (src/lib/profile.ts).
  profile: {
    summary: '가천대학교에서 인공지능을 공부하며 Robot AI 엔지니어를 목표로 합니다. 배우고 만들고 쓴 것을 이곳에 쌓아 갑니다.',
  },
  // 푸터와 About의 Elsewhere가 같이 쓰는 링크. 비어 있으면 두 곳 모두 그리지 않는다.
  // GitHub·이메일·LinkedIn은 사용자가 공개를 확인했다 (2026-10-10). LinkedIn 주소는 한글 슬러그라 퍼센트 인코딩했다.
  // 그 밖의 새 외부 링크/개인정보를 넣기 전에는 사용자에게 확인한다 (CLAUDE.md 4절).
  links: [
    { label: 'GitHub', href: 'https://github.com/woojush' },
    { label: 'Email', href: 'mailto:tlsdntjr1121@naver.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/%EC%9A%B0%EC%A3%BC-%EC%8B%A0-346341344' },
  ] as readonly SiteLink[],
} as const;
