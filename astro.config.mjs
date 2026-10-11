// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHeadingAnchors from './src/lib/rehype-heading-anchors.mjs';
import rehypeMathErrors from './src/lib/rehype-math-errors.mjs';

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
  markdown: {
    // 수식: $…$ 인라인, $$…$$ 블록. 잘못된 TeX는 빨간 글자로 배포되지 않도록 빌드를 멈춘다(rehype-math-errors).
    // Astro 7의 기본 처리기는 Sätteri라서, remark/rehype 플러그인은 unified 처리기(@astrojs/markdown-remark)로 돌린다.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeHeadingAnchors, [rehypeKatex, { strict: 'ignore' }], rehypeMathErrors],
    }),
    // 코드: 어두운 테마 하나만 쓴다(라이트 테마는 없앴다). 색은 CSS 변수(--shiki-dark)로 내보내고 prose.css가 쓴다.
    shikiConfig: { themes: { dark: 'vitesse-dark' }, defaultColor: false },
  },
});
