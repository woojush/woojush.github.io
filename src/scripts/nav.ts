// 탭 바: 글자에 마우스(또는 키보드 포커스)가 올라가면 알약 아래쪽 은은한 빛(.nav-blob)이 그 글자 밑으로 따라간다.
// 알약이 벌어지기 전에는 기다렸다가 나타난다. 알약이 늘어나고 줄어드는 동작과 글자 등장은 CSS가 맡는다.
const nav = document.querySelector<HTMLElement>('.nav');
const blob = nav?.querySelector<HTMLElement>('.nav-blob');

// 탭(링크)을 누르면 "알약이 벌어져 있었다"고 표시해 둔다. 다음 페이지가 같은 모양으로 시작한다(BaseLayout의 인라인 스크립트가 읽는다).
// 새 문서에서는 마우스가 움직이기 전까지 :hover가 잡히지 않아, 표시가 없으면 알약이 작아졌다 다시 벌어진다.
const KEY = 'nav-open';
const root = document.documentElement;
if (root.hasAttribute('data-nav-open')) {
  // 첫 마우스 움직임에서 포인터가 어디 있는지(좌표)로 정한다. :hover 상태를 기다리면 새 문서가 아직 호버를 계산하기 전이라
  // 표시를 푸는 순간 알약이 줄었다가 다시 벌어진다.
  //  - 알약 위: 표시를 둔 채 알약을 떠날 때 푼다 (그동안 :hover 규칙이 같은 모양을 유지한다)
  //  - 알약 밖: 바로 푼다 (평소처럼 줄어든다)
  const release = () => root.removeAttribute('data-nav-open');
  addEventListener(
    'pointermove',
    (e) => {
      const r = nav?.getBoundingClientRect();
      const inside = !!r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside) {
        // 알약을 떠나는 순간 푼다. pointerleave는 새 문서에서 믿기 어려워(호버가 늦게 잡힌다) 좌표로 직접 본다
        const watch = (ev: PointerEvent) => {
          const b = nav!.getBoundingClientRect();
          if (ev.clientX < b.left || ev.clientX > b.right || ev.clientY < b.top || ev.clientY > b.bottom) {
            removeEventListener('pointermove', watch);
            release();
          }
        };
        addEventListener('pointermove', watch);
      } else release();
    },
    { once: true },
  );
}
nav?.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('a')) return;
  try {
    if (nav.matches(':hover')) sessionStorage.setItem(KEY, '1');
  } catch {
    // 저장소를 못 쓰면 표시 없이 이동한다
  }
});

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

  // 늘어나는 동안 튕기므로 transitionend를 기다리지 않고, 처음 크게 벌어진 뒤(약 0.3초)에 연다
  let openTimer: number | undefined;
  const opening = () => {
    if (isOpen || openTimer !== undefined) return;
    openTimer = window.setTimeout(() => {
      openTimer = undefined;
      isOpen = true;
      if (pending) show(pending);
      pending = null;
    }, 300);
  };
  nav.addEventListener('pointerenter', opening);
  nav.addEventListener('focusin', opening);
  nav.addEventListener('pointerleave', () => {
    window.clearTimeout(openTimer);
    openTimer = undefined;
    isOpen = false;
    hide();
  });
}
