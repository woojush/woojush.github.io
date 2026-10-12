// 행성 화면의 회전 카드 호. 카드는 큰 원(행성 가장자리)을 따라 놓이고, pos(소수 가능)가 가운데 카드의 위치다.
//  - 끌기: 75px(폭 197px 기준)에 카드 한 장. 놓으면 가장 가까운 카드로 부드럽게 멈춘다.
//  - 휠·트랙패드, 방향키(←→, Home, End), 옆 카드 누르기(가운데로 옴), Tab 포커스(가운데로 옴).
//  - 가운데 카드를 누르면 글로 간다. 끌었다 놓은 것은 클릭으로 치지 않는다.
//  - 이전/다음 행성 링크를 누르면 카드가 옆으로 쓸려 나가고, 도착한 쪽에서 반대 방향에서 들어온다(sessionStorage 'wdir').
// 기하(카드 폭, 반지름, 간격 각도)는 2026-10-12 참고 사이트(Form Follows Function) 화면을 보고 눈으로 맞춘 값이다. 움직임의 속도·곡선은 소스를 볼 수 없어 눈대중이다.
const root = document.documentElement;
const section = document.querySelector<HTMLElement>('[data-wspace="arc"]');
const wheel = section?.querySelector<HTMLElement>('[data-wheel]');
const ring = section?.querySelector<HTMLElement>('[data-ring]');

root.classList.add('js-arc');

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const STEP_DEG = 8.6; // 이웃 카드와의 각도 차
const R_PER_CW = 5.6; // 반지름 = 카드 폭 × 5.6
const DRAG_PER_CARD = 75 / 197; // 카드 한 장을 넘기는 끌기 거리 = 카드 폭 × 0.38
const VISIBLE = 9; // 가운데에서 이만큼 넘게 떨어진 카드는 그리지 않는다

if (section && wheel) {
  const cards = [...wheel.querySelectorAll<HTMLElement>('.wcard')];
  const n = cards.length;
  const dirKey = 'wdir';
  let arrive: string | null = null;
  try {
    arrive = sessionStorage.getItem(dirKey);
    sessionStorage.removeItem(dirKey);
  } catch {
    /* 저장소를 못 써도 괜찮다 */
  }

  let cw = 197;
  let R = cw * R_PER_CW;
  let cx = 0;
  let cy = 0;
  const layout = () => {
    const w = section.clientWidth;
    const h = section.clientHeight;
    cw = Math.min(230, Math.max(120, w * 0.13));
    R = cw * R_PER_CW;
    cx = w / 2;
    const top = h * (w < 700 ? 0.4 : 0.44); // 가운데 카드의 윗변
    cy = top + R; // 카드의 윗변이 원 위에 놓이고 카드는 안쪽(중심 쪽)으로 뻗는다: 윗변은 부채꼴로 벌어지고 아랫변은 모여 겹친다
    section.style.setProperty('--cw', `${cw.toFixed(1)}px`);
    if (ring) {
      const rr = R - cw * 1.414 - 8; // 카드 아랫변 바로 밑에서 솟는 둥근 가장자리
      ring.style.width = ring.style.height = `${(rr * 2).toFixed(0)}px`;
      ring.style.left = `${(cx - rr).toFixed(0)}px`;
      ring.style.top = `${(cy - rr).toFixed(0)}px`;
    }
  };

  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  // 들어올 때 카드가 옆에서 쓸려 들어온다: 다음 행성이면 오른쪽에서, 이전 행성이면 왼쪽에서
  const intro = reduce.matches ? 0 : arrive === 'prev' ? -4 : arrive === 'next' ? 4 : 3;
  let pos = -intro;
  let target = 0;
  let rate = 5; // 1초에 당기는 정도(클수록 빨리 멈춘다). 들어올 때만 느리게
  let rafId = 0;
  let dragging = false;

  const place = () => {
    for (let i = 0; i < n; i++) {
      const el = cards[i];
      const off = i - pos;
      const a = Math.abs(off);
      if (a > VISIBLE) {
        el.style.visibility = 'hidden';
        continue;
      }
      el.style.visibility = 'visible';
      el.classList.toggle('is-c', a < 0.5); // 날짜·형식은 가운데 카드에서만 보인다(옆 카드는 가장자리 조각만 비쳐 지저분하다)
      el.classList.toggle('is-r', off > 0.5); // 오른쪽 카드는 안쪽(왼쪽)이 가운데 카드에 가려지므로 글자를 바깥쪽(오른쪽)에 붙인다
      const deg = off * STEP_DEG;
      el.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) rotate(${deg.toFixed(3)}deg) translate(${(-cw / 2).toFixed(1)}px, ${(-R).toFixed(1)}px)`;
      el.style.zIndex = String(100 - Math.round(a * 10));
      // 멀수록 카드 안의 글자와 이름표를 옅게 한다(가장자리에서는 기울어 읽기 어렵다)
      el.style.setProperty('--lab', String(clamp(1.15 - Math.max(0, a - 2) * 0.28, 0.12, 1)));
      el.style.opacity = String(clamp(1.2 - Math.max(0, a - 5) * 0.3, 0.3, 1));
    }
  };

  let lastT = 0;
  const tick = (t: number) => {
    const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
    lastT = t;
    if (!dragging) {
      const k = 1 - Math.exp(-dt * rate);
      pos += (target - pos) * k;
      if (Math.abs(target - pos) < 0.0015) pos = target;
      if (rate < 9 && Math.abs(target - pos) < 1.2) rate = Math.min(9, rate + dt * 14);
    }
    place();
    if (dragging || pos !== target) rafId = requestAnimationFrame(tick);
    else rafId = 0;
  };
  const go = () => {
    if (reduce.matches) {
      pos = target;
      place();
      return;
    }
    if (!rafId) {
      lastT = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  };
  const goTo = (i: number) => {
    target = clamp(Math.round(i), 0, n - 1);
    go();
  };

  layout();
  place();
  go();
  addEventListener('resize', () => {
    layout();
    place();
  });

  // ── 끌기 ──
  let startX = 0;
  let startPos = 0;
  let moved = 0;
  let vel = 0;
  let lastX = 0;
  let lastMove = 0;
  let captured = false;
  let pointerId = 0;
  wheel.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    moved = 0;
    vel = 0;
    startX = lastX = e.clientX;
    startPos = pos;
    lastMove = performance.now();
    captured = false;
    pointerId = e.pointerId;
    go();
  });
  wheel.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    // 실제로 끌기 시작한 뒤에만 포인터를 붙잡는다(붙잡으면 링크의 클릭이 사라진다)
    if (!captured && moved > 4) {
      captured = true;
      wheel.setPointerCapture(pointerId);
      wheel.classList.add('is-dragging');
    }
    const now = performance.now();
    const dtm = Math.max(1, now - lastMove);
    vel = (vel * 0.6 + (-(e.clientX - lastX) / (cw * DRAG_PER_CARD) / dtm) * 1000 * 0.4) ;
    lastX = e.clientX;
    lastMove = now;
    // 양 끝을 넘으면 저항을 준다
    const raw = startPos - dx / (cw * DRAG_PER_CARD);
    pos = raw < 0 ? raw * 0.35 : raw > n - 1 ? n - 1 + (raw - (n - 1)) * 0.35 : raw;
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    wheel.classList.remove('is-dragging');
    // 놓은 속도만큼 더 나아간 뒤 가장 가까운 카드에 멈춘다(한 번에 최대 4장)
    const glide = clamp(vel * 0.28, -4, 4);
    goTo(pos + (moved > 4 ? glide : 0));
  };
  wheel.addEventListener('pointerup', release);
  wheel.addEventListener('pointercancel', release);

  // 끌었다 놓은 것은 클릭이 아니다. 옆 카드를 누르면 가운데로 오고, 가운데 카드만 링크로 간다
  wheel.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('.wcard-link');
    if (!link) return;
    const i = Number(link.closest<HTMLElement>('.wcard')?.dataset.i);
    if (moved > 6 || i !== Math.round(target)) {
      e.preventDefault();
      if (moved <= 6) goTo(i);
    }
    moved = 0;
  });

  // ── 휠·트랙패드 ──
  let acc = 0;
  let wheelAt = 0;
  wheel.addEventListener(
    'wheel',
    (e) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelAt > 180) acc = 0;
      acc += d;
      if (Math.abs(acc) >= 50 && now - wheelAt > 110) {
        goTo(Math.round(target) + (acc > 0 ? 1 : -1));
        acc = 0;
        wheelAt = now;
      } else if (Math.abs(acc) < 50) {
        wheelAt = now;
      }
    },
    { passive: false },
  );

  // ── 키보드 ──
  section.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') goTo(Math.round(target) + 1);
    else if (e.key === 'ArrowLeft') goTo(Math.round(target) - 1);
    else if (e.key === 'Home') goTo(0);
    else if (e.key === 'End') goTo(n - 1);
    else return;
    e.preventDefault();
    cards[Math.round(target)]?.querySelector<HTMLElement>('.wcard-link')?.focus({ preventScroll: true });
  });
  wheel.addEventListener('focusin', (e) => {
    const i = Number((e.target as HTMLElement).closest<HTMLElement>('.wcard')?.dataset.i);
    if (Number.isFinite(i) && i !== Math.round(target)) goTo(i);
  });

  // ── 행성 이동: 카드가 옆으로 쓸려 나간 뒤 이동한다 ──
  section.querySelectorAll<HTMLAnchorElement>('.pnav a[data-dir]').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const dir = a.dataset.dir === 'prev' ? 'prev' : 'next';
      try {
        sessionStorage.setItem(dirKey, dir);
      } catch {
        /* 저장소를 못 써도 이동은 된다 */
      }
      if (reduce.matches || n === 0 || a.hasAttribute('aria-current')) return;
      e.preventDefault();
      target = Math.round(pos) + (dir === 'next' ? 4.5 : -4.5);
      rate = 7;
      go();
      wheel.style.transition = 'opacity 0.32s ease';
      wheel.style.opacity = '0';
      setTimeout(() => (location.href = a.href), 340);
    });
  });
} else if (section) {
  // 글이 없는 행성: 카드 없이 이동 링크만 쓴다
  section.querySelectorAll<HTMLAnchorElement>('.pnav a[data-dir]').forEach((a) => {
    a.addEventListener('click', () => {
      try {
        sessionStorage.setItem('wdir', a.dataset.dir === 'prev' ? 'prev' : 'next');
      } catch {
        /* 무시 */
      }
    });
  });
}
export {};
