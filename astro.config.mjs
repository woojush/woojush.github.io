// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// 배포 구조 (docs/03_technical_stack.md 6절)
// - 기준: `<username>.github.io` 저장소 → 루트 경로(base: '/')
// - SITE_URL은 GitHub Actions에서 주입한다 (.github/workflows/deploy.yml).
//   로컬 빌드에서는 placeholder를 쓴다. 사용자명을 코드에 하드코딩하지 않는다.
// - 커스텀 도메인을 연결할 때는 SITE_URL만 바꾸면 되고, base는 그대로 '/'.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://USERNAME.github.io',
  base: '/',
  // GitHub Pages는 /about/ → about/index.html 로 서빙한다. 모든 내부 링크는 trailing slash로 통일.
  trailingSlash: 'always',
  integrations: [mdx()],
});
