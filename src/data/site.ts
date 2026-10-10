// 사이트 단위 설정. 개인정보는 확정 전이므로 placeholder를 사용한다 (CLAUDE.md "공개 정보 원칙" 참고).
export const site = {
  name: 'Shin WooJu', // placeholder — 실명 확정 전
  tagline: 'AI Engineering student', // 학교/정체성 표현은 허용, 구체적 개인정보는 placeholder
  defaultLang: 'ko',
  // 메뉴는 5개 고정. 추가 조건은 docs/01_information_architecture.md 7절. UI 표기는 소문자.
  nav: [
    { label: 'home', href: '/' },
    { label: 'about', href: '/about/' },
    { label: 'knowledge', href: '/knowledge/' },
    { label: 'projects', href: '/projects/' },
    { label: 'writing', href: '/writing/' },
  ],
} as const;
