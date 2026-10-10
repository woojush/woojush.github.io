// 첫 페인트 전에 <head>에 인라인으로 박히는 스크립트(BaseLayout이 ?raw로 읽는다). 모든 페이지에 실리므로 짧게 유지한다.
// 기본은 dark. 저장된 선택이 light일 때만 light. 키는 theme-toggle.ts와 같아야 한다.
(function () {
  var t = 'dark';
  try {
    if (localStorage.getItem('theme') === 'light') t = 'light';
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', t);
})();
