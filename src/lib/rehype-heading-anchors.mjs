// h2~h4 끝에 앵커 링크(<a class="anchor" href="#id">)를 붙이는 rehype 플러그인. 글자는 넣지 않는다(목차 글자에 섞이지 않게) — '#' 표시는 CSS가 그린다.
// Astro가 제목에 id를 붙이는 단계는 사용자 플러그인 뒤라서, 여기서 id를 먼저 만든다(Astro는 이미 있는 id를 그대로 쓰고 목차에도 그 id가 실린다).
// 규칙은 github-slugger와 같다: 소문자, 글자·숫자·밑줄·하이픈만 남기고 공백은 -로, 같은 id가 또 나오면 -1, -2를 붙인다. 한글 제목도 그대로 id가 된다.
// 별도 의존성 없이 직접 구현했다. KaTeX보다 먼저 실행해야 한다(수식이 렌더링되기 전의 글자를 쓴다).
const LEVELS = new Set(['h2', 'h3', 'h4']);

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
}

export default function rehypeHeadingAnchors() {
  return (tree) => {
    const seen = new Map();
    const walk = (node) => {
      if (node.type === 'element' && LEVELS.has(node.tagName)) {
        node.properties ??= {};
        if (typeof node.properties.id !== 'string') {
          const base = slugify(textOf(node));
          const n = seen.get(base) ?? 0;
          seen.set(base, n + 1);
          node.properties.id = n === 0 ? base : `${base}-${n}`;
        }
        node.children.push({
          type: 'element',
          tagName: 'a',
          properties: { className: ['anchor'], href: `#${node.properties.id}`, ariaLabel: '이 제목의 링크' },
          children: [],
        });
        return;
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
