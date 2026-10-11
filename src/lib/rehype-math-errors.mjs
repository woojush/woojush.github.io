// rehype-katex는 잘못된 TeX를 만나면 경고만 남기고 빨간 글자로 렌더링한다(빌드는 통과한다).
// 이 플러그인은 KaTeX 뒤에서 그 흔적(.katex-error)을 찾아 빌드를 멈추고, 파일과 오류 내용을 알려 준다.
// 별도 의존성 없이 직접 구현했다.
export default function rehypeMathErrors() {
  return (tree, file) => {
    const walk = (node) => {
      if (node.type === 'element' && Array.isArray(node.properties?.className) && node.properties.className.includes('katex-error')) {
        throw new Error(`${file.path ?? '(알 수 없는 파일)'}: 수식 오류 → ${node.properties.title ?? ''}`);
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
