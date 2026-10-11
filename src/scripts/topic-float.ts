// 주제 태그들이 별 장면 위에서 떠다니는 움직임: 천천히 흘러가고, 서로 겹치면 부드럽게 튕기며, 마우스를 올린 것은 멈춘다.
// 화면을 끌면 모든 태그가 같이 밀려가고(놓으면 관성으로 잠시 더 간다), 화면 밖으로 나간 것은 반대편에서 다시 들어온다.
// 포인터 위치에 따라 태그마다 조금씩 다르게 움직이는 시차(깊이감)도 있다. 위치 계산만 하고 마크업·전환은 topic-stage.ts가 맡는다.
export interface Field {
  /** 태그(li)들을 놓는다. 처음 배치는 seed에서 만든 고정 난수 */
  load(els: HTMLElement[], seed: string): void;
  /** 한 프레임. 움직임 줄이기면 부르지 않아도 된다 */
  tick(dt: number): void;
  measure(): void;
}

interface Item {
  el: HTMLElement;
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number; // 시차의 크기
  held: boolean;
}

const GAP = 18; // 서로 떨어져 있어야 하는 최소 간격(px)
const SPEED_MIN = 14; // px/초
const SPEED_MAX = 26;
const DRAG_THRESHOLD = 6; // 이만큼 움직여야 끌기로 본다(그 전에는 누르기)

const mod = (a: number, n: number) => ((a % n) + n) % n;

export function createField(space: HTMLElement): Field {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let items: Item[] = [];
  let W = 0;
  let H = 0;
  let padTop = 0;
  let padBottom = 0;
  let wrapX = 0;
  let wrapY = 0;
  let rand: () => number = Math.random;
  // 끌기
  let panX = 0;
  let panY = 0;
  let panVX = 0;
  let panVY = 0;
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  // 포인터 시차 (-1 ~ 1, 부드럽게 따라간다)
  let nx = 0;
  let ny = 0;
  let tx = 0;
  let ty = 0;

  const overlaps = (a: Item, b: Item, gap: number) => a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;

  function mulberry(str: string): () => number {
    let s = 0;
    for (const ch of str) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function bounds() {
    W = space.clientWidth;
    H = space.clientHeight;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    padTop = (matchMedia('(max-width: 640px)').matches ? 10.5 : 6.5) * rem; // 헤더(탭 바)와 안내 문구 아래 (좁은 화면은 탭 바가 한 줄 더 내려온다)
    padBottom = 5 * rem; // 좌측 하단 칩 위
    const maxW = items.reduce((m, it) => Math.max(m, it.w), 0) + 40;
    const maxH = items.reduce((m, it) => Math.max(m, it.h), 0) + 40;
    wrapX = W + maxW;
    wrapY = H + maxH;
  }

  function put(it: Item) {
    const px = it.x + panX + nx * 22 * it.depth;
    const py = it.y + panY + ny * 14 * it.depth;
    const x = mod(px + (wrapX - W) / 2 + it.w, wrapX) - it.w - (wrapX - W) / 2;
    const y = mod(py + (wrapY - H) / 2 + it.h, wrapY) - it.h - (wrapY - H) / 2;
    it.el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  }

  function clampIn(it: Item) {
    it.x = Math.min(Math.max(it.x, 24), Math.max(24, W - it.w - 24));
    it.y = Math.min(Math.max(it.y, padTop), Math.max(padTop, H - padBottom - it.h));
  }

  function load(els: HTMLElement[], seed: string) {
    rand = mulberry(seed);
    panX = panY = panVX = panVY = 0;
    items = els.map((el) => ({ el, w: el.offsetWidth, h: el.offsetHeight, x: 0, y: 0, vx: 0, vy: 0, depth: 0.6 + rand() * 1.1, held: false }));
    bounds();
    const placed: Item[] = [];
    for (const it of items) {
      // 겹치지 않는 자리를 찾을 때까지 시도한다 (못 찾으면 마지막 시도를 쓴다)
      for (let n = 0; n < 400; n++) {
        // 처음 배치는 가장자리를 피해 안쪽 넓은 영역에서 (적은 수일 때 구석에 몰리지 않게)
        const inX = Math.max(24, W * 0.1);
        const inY = (H - padBottom - padTop) * 0.08;
        it.x = inX + rand() * Math.max(0, W - it.w - inX * 2);
        it.y = padTop + inY + rand() * Math.max(0, H - padBottom - padTop - it.h - inY * 2);
        if (!placed.some((o) => overlaps(it, o, GAP * 2.5))) break;
      }
      const a = rand() * Math.PI * 2;
      const sp = SPEED_MIN + rand() * (SPEED_MAX - SPEED_MIN);
      it.vx = Math.cos(a) * sp;
      it.vy = Math.sin(a) * sp;
      const link = it.el.querySelector('a');
      const hold = (v: boolean) => () => (it.held = v);
      it.el.addEventListener('pointerenter', hold(true));
      it.el.addEventListener('pointerleave', hold(false));
      link?.addEventListener('focus', hold(true));
      link?.addEventListener('blur', hold(false));
      placed.push(it);
      put(it);
    }
  }

  function measure() {
    for (const it of items) {
      it.w = it.el.offsetWidth;
      it.h = it.el.offsetHeight;
    }
    bounds();
    for (const it of items) {
      clampIn(it);
      put(it);
    }
  }

  function tick(dt: number) {
    nx += (tx - nx) * Math.min(1, dt * 3);
    ny += (ty - ny) * Math.min(1, dt * 3);
    if (!dragging) {
      panX += panVX * dt;
      panY += panVY * dt;
      const k = Math.exp(-2.6 * dt); // 놓은 뒤 관성이 잦아든다
      panVX *= k;
      panVY *= k;
    }
    for (const it of items) {
      if (it.held || dragging) continue;
      it.x += it.vx * dt;
      it.y += it.vy * dt;
      if (it.x < 24 || it.x > W - it.w - 24) {
        clampIn(it);
        it.vx = -it.vx;
      }
      if (it.y < padTop || it.y > H - padBottom - it.h) {
        clampIn(it);
        it.vy = -it.vy;
      }
    }
    // 겹치면 겹침이 작은 쪽 축으로 밀어내고 그 축의 속도를 맞바꾼다
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        if (!overlaps(a, b, 6)) continue;
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

  // ── 포인터: 끌기와 시차 ──
  space.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || (e.target as Element).closest('.chips, header')) return;
    dragging = true;
    moved = false;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = performance.now();
    panVX = panVY = 0;
  });
  addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    // 아직 누르기일 수 있다: 시작점에서 충분히 멀어질 때까지 기다린다
    if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!moved) {
      moved = true;
      space.classList.add('is-dragging');
      space.setPointerCapture?.(e.pointerId);
    }
    const now = performance.now();
    const dt = Math.max(1, now - lastT) / 1000;
    if (!reduce) {
      panX += dx;
      panY += dy;
      // 놓을 때의 속도(관성)는 최근 움직임을 부드럽게 이어받는다
      panVX = panVX * 0.6 + (dx / dt) * 0.4;
      panVY = panVY * 0.6 + (dy / dt) * 0.4;
    }
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = now;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    space.classList.remove('is-dragging');
    // 멈춘 채로 놓으면 관성이 없다
    if (performance.now() - lastT > 90) panVX = panVY = 0;
    panVX = Math.max(-900, Math.min(900, panVX));
    panVY = Math.max(-900, Math.min(900, panVY));
  };
  addEventListener('pointerup', end);
  addEventListener('pointercancel', end);
  // 끌고 나서 손을 뗄 때 생기는 click은 막는다 (태그가 눌리지 않게)
  space.addEventListener(
    'click',
    (e) => {
      if (!moved) return;
      moved = false;
      e.preventDefault();
      e.stopPropagation();
    },
    true,
  );
  addEventListener('resize', () => {
    measure();
  });

  return { load, tick, measure };
}
