// 주제 장면: 하위 주제 링크들이 정해진 영역 안에서 아주 천천히 떠다닌다. 서로 겹치면 부드럽게 튕기고, 벽에 닿으면 되돌아온다.
// 마우스를 올리거나 키보드 포커스가 있는 것은 멈춘다(누르기 쉽게). 움직임 줄이기 설정이면 처음 배치 그대로 멈춰 있다.
// 누르면 나머지가 사라지는 짧은 전환(CSS) 뒤에 이동한다. 위치는 주소에서 만든 고정 난수로 정해서 같은 페이지는 늘 같은 모양으로 시작한다.
const stage = document.querySelector<HTMLElement>('[data-stage]');
const list = stage?.querySelector('ul');

interface Item {
  el: HTMLElement;
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  held: boolean;
}

if (stage && list) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GAP = 14; // 서로 떨어져 있어야 하는 최소 간격(px)
  const items: Item[] = [];
  let W = 0;
  let H = 0;

  // 주소 → 고정 난수 (mulberry32)
  let seed = 0;
  for (const ch of location.pathname) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const overlaps = (a: Item, b: Item, gap = GAP) => a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;
  const put = (it: Item) => (it.el.style.translate = `${it.x.toFixed(1)}px ${it.y.toFixed(1)}px`);

  function measure() {
    W = stage!.clientWidth;
    H = stage!.clientHeight;
    for (const it of items) {
      it.w = it.el.offsetWidth;
      it.h = it.el.offsetHeight;
      it.x = Math.min(Math.max(it.x, 0), Math.max(0, W - it.w));
      it.y = Math.min(Math.max(it.y, 0), Math.max(0, H - it.h));
      put(it);
    }
  }

  function layout() {
    stage!.classList.add('is-floating');
    W = stage!.clientWidth;
    H = stage!.clientHeight;
    for (const el of list!.querySelectorAll<HTMLElement>('li')) {
      const it: Item = { el, w: el.offsetWidth, h: el.offsetHeight, x: 0, y: 0, vx: 0, vy: 0, held: false };
      // 겹치지 않는 자리를 찾을 때까지 시도한다 (못 찾으면 마지막 시도를 쓴다)
      for (let n = 0; n < 300; n++) {
        it.x = rand() * Math.max(0, W - it.w);
        it.y = rand() * Math.max(0, H - it.h);
        if (!items.some((o) => overlaps(it, o, GAP * 2))) break;
      }
      const angle = rand() * Math.PI * 2;
      const speed = 7 + rand() * 7; // px/초. 아주 느리게
      it.vx = Math.cos(angle) * speed;
      it.vy = Math.sin(angle) * speed;
      el.addEventListener('pointerenter', () => (it.held = true));
      el.addEventListener('pointerleave', () => (it.held = false));
      el.addEventListener('focusin', () => (it.held = true));
      el.addEventListener('focusout', () => (it.held = false));
      items.push(it);
      put(it);
    }
  }

  function step(dt: number) {
    for (const it of items) {
      if (it.held) continue;
      it.x += it.vx * dt;
      it.y += it.vy * dt;
      if (it.x < 0 || it.x > W - it.w) {
        it.x = Math.min(Math.max(it.x, 0), Math.max(0, W - it.w));
        it.vx = -it.vx;
      }
      if (it.y < 0 || it.y > H - it.h) {
        it.y = Math.min(Math.max(it.y, 0), Math.max(0, H - it.h));
        it.vy = -it.vy;
      }
    }
    // 겹치면 겹침이 작은 쪽 축으로 밀어내고 그 축의 속도를 맞바꾼다
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        if (!overlaps(a, b, 0)) continue;
        const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (ox < oy) {
          const dir = a.x + a.w / 2 < b.x + b.w / 2 ? -1 : 1;
          if (!a.held) a.x += (dir * ox) / (b.held ? 1 : 2);
          if (!b.held) b.x -= (dir * ox) / (a.held ? 1 : 2);
          [a.vx, b.vx] = [b.vx, a.vx];
        } else {
          const dir = a.y + a.h / 2 < b.y + b.h / 2 ? -1 : 1;
          if (!a.held) a.y += (dir * oy) / (b.held ? 1 : 2);
          if (!b.held) b.y -= (dir * oy) / (a.held ? 1 : 2);
          [a.vy, b.vy] = [b.vy, a.vy];
        }
      }
    }
    for (const it of items) put(it);
  }

  layout();

  if (!reduce) {
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  let timer = 0;
  addEventListener('resize', () => {
    clearTimeout(timer);
    timer = window.setTimeout(measure, 100);
  });

  // 링크를 누르면: 나머지가 사라지는 동안 잠깐 기다렸다가 이동한다 (새 탭·보조키·움직임 줄이기는 그대로 이동)
  stage.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    stage.classList.add('is-leaving');
    a.closest('li')?.classList.add('is-picked');
    window.setTimeout(() => (location.href = a.href), 360);
  });

  // 뒤로 가기로 돌아왔을 때(bfcache) 사라진 상태가 남지 않게
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    stage.classList.remove('is-leaving');
    stage.querySelector('.is-picked')?.classList.remove('is-picked');
  });
}
