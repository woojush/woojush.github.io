// 탭 바의 캡슐. 현재 페이지의 탭에 머물다가, 마우스가 탭 위에 있으면 그 탭으로 움직이고 커진다.
// 막대를 벗어나면 현재 탭으로 돌아간다. 터치에서는 호버 동작을 하지 않는다(글로우 맥동은 CSS가 맡는다).
// JS가 없으면 Nav.astro의 정적 표시(.nav-indicator)가 그대로 남는다.
const nav = document.querySelector<HTMLElement>('.nav');
const bar = nav?.querySelector<HTMLElement>('.nav-bar');
const capsule = nav?.querySelector<HTMLElement>('.nav-capsule');

if (nav && bar && capsule) {
  const slots = Array.from(bar.querySelectorAll<HTMLElement>('.nav-list li'));
  const currentSlot = bar.querySelector<HTMLElement>('[aria-current]')?.parentElement ?? null;
  const REST_HEIGHT = 32;

  function place(slot: HTMLElement | null, hovered: boolean) {
    if (!slot) {
      delete nav!.dataset.placed;
      return;
    }
    const b = bar!.getBoundingClientRect();
    const r = slot.getBoundingClientRect();
    capsule!.style.setProperty('--cap-x', `${r.left - b.left - bar!.clientLeft}px`);
    capsule!.style.setProperty('--cap-w', `${r.width}px`);
    capsule!.style.setProperty('--cap-h', `${hovered ? r.height : Math.min(REST_HEIGHT, r.height)}px`);
    nav!.dataset.placed = '';
  }

  const rest = () => {
    delete nav.dataset.hover;
    place(currentSlot, false);
  };

  nav.dataset.js = '';
  rest();
  // 첫 배치는 움직임 없이 놓고, 다음 프레임부터 전환을 켠다
  requestAnimationFrame(() => requestAnimationFrame(() => (nav.dataset.ready = '')));

  slots.forEach((slot) => {
    slot.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      nav.dataset.hover = '';
      place(slot, true);
    });
  });
  bar.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') rest();
  });
  // 키보드 포커스도 같은 위치로 보낸다
  bar.addEventListener('focusin', (e) => {
    const slot = (e.target as HTMLElement).closest<HTMLElement>('li');
    if (slot && (e.target as HTMLElement).matches(':focus-visible')) {
      nav.dataset.hover = '';
      place(slot, true);
    }
  });
  bar.addEventListener('focusout', rest);

  new ResizeObserver(() => (nav.dataset.hover === undefined ? rest() : undefined)).observe(bar);
}
