// 첫 페인트 전에 <head>에 인라인으로 박히는 스크립트(BaseLayout이 ?raw로 읽는다). 모든 페이지에 실리므로 짧게 유지한다.
// 저장된 선택(light | dark)이 있으면 그 값, 없으면 'system'. 키는 theme-toggle.ts와 같아야 한다.
(function () {
  var t = 'system';
  try {
    var s = localStorage.getItem('theme');
    if (s === 'light' || s === 'dark') t = s;
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', t);
})();
