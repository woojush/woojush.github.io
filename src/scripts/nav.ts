// 탭 바: 글자에 마우스(또는 키보드 포커스)가 올라가면 알약 아래쪽 은은한 빛(.nav-blob)이 그 글자 밑으로 따라간다.
// 알약이 다 늘어나기 전에는 기다렸다가 나타난다. 알약이 늘어나고 줄어드는 동작과 글자 등장은 CSS가 맡는다.
const nav = document.querySelector<HTMLElement>('.nav');
const blob = nav?.querySelector<HTMLElement>('.nav-blob');

if (nav && blob) {
  const links = Array.from(nav.querySelectorAll<HTMLElement>('.nav-link'));
  let isOpen = false; // 알약이 다 늘어난 상태
  let pending: HTMLElement | null = null; // 늘어나기를 기다리는 글자

  function show(link: HTMLElement) {
    const n = nav!.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    // 빛이 안 보이는 상태에서 처음 나타날 때는 이동 전환 없이 그 자리에 놓는다
    if (blob!.style.opacity !== '0.5') {
      blob!.style.transition = 'none';
      blob!.style.translate = `${r.left - n.left + r.width / 2}px 0`;
      void blob!.offsetWidth;
      blob!.style.transition = '';
    } else {
      blob!.style.translate = `${r.left - n.left + r.width / 2}px 0`;
    }
    blob!.style.opacity = '0.5';
  }

  function hide() {
    pending = null;
    blob!.style.opacity = '0';
  }

  links.forEach((link) => {
    const enter = () => {
      if (isOpen) show(link);
      else pending = link;
    };
    link.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && enter());
    link.addEventListener('focus', enter);
    link.addEventListener('pointerleave', hide);
    link.addEventListener('blur', hide);
  });

  nav.addEventListener('transitionend', (e) => {
    if (e.target !== nav || e.propertyName !== 'width') return;
    isOpen = nav.matches(':hover, :focus-within');
    if (isOpen && pending) show(pending);
    pending = null;
  });
  nav.addEventListener('pointerleave', () => {
    isOpen = false;
    hide();
  });
}
