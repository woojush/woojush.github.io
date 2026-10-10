// 메인 히어로 배경: 별가루가 천천히 다가오듯 흐르고, 포인터를 따라 살짝 시차가 생긴다 (2D canvas, 의존성 없음).
// - 색은 CSS 토큰 --particle(rgb 채널)에서 읽는다. 테마가 바뀌면 다시 읽는다.
// - prefers-reduced-motion이면 한 장면만 그리고 움직이지 않는다.
// - 탭이 숨겨지면 requestAnimationFrame이 멈춘다. DPR은 2까지만.

const canvas = document.querySelector<HTMLCanvasElement>('[data-starfield]');
const ctx = canvas?.getContext('2d');

interface Star {
  x: number; // -1 ~ 1
  y: number;
  z: number; // 0(가까움) ~ 1(멀리)
}

if (canvas && ctx) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const SPEED = 0.035; // 초당 z 감소량
  let stars: Star[] = [];
  let width = 0;
  let height = 0;
  let rgb = '235, 231, 223';
  let px = 0; // 포인터(-1~1)와 현재 시차 값
  let py = 0;
  let tx = 0;
  let ty = 0;
  let last = 0;

  const spawn = (z = Math.random()): Star => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.max(z, 0.04) });

  function readColor(): void {
    rgb = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() || rgb;
  }

  function resize(): void {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = canvas!.clientWidth;
    height = canvas!.clientHeight;
    canvas!.width = Math.round(width * dpr);
    canvas!.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(480, Math.round((width * height) / 2600));
    stars = Array.from({ length: count }, () => spawn());
    draw();
  }

  function draw(): void {
    ctx!.clearRect(0, 0, width, height);
    const cx = width / 2 + px * 24;
    const cy = height / 2 + py * 24;
    const scale = Math.max(width, height) * 0.5;
    for (const s of stars) {
      const sx = cx + (s.x / s.z) * scale * 0.18 + px * (1 - s.z) * 40;
      const sy = cy + (s.y / s.z) * scale * 0.18 + py * (1 - s.z) * 40;
      if (sx < -4 || sx > width + 4 || sy < -4 || sy > height + 4) continue;
      const near = 1 - s.z;
      ctx!.fillStyle = `rgba(${rgb}, ${(0.18 + near * 0.62).toFixed(3)})`;
      const r = 0.4 + near * 1.6;
      ctx!.fillRect(sx - r / 2, sy - r / 2, r, r);
    }
  }

  function frame(now: number): void {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    px += (tx - px) * 0.04;
    py += (ty - py) * 0.04;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]!;
      s.z -= SPEED * dt;
      if (s.z <= 0.04) stars[i] = spawn(1);
    }
    draw();
    if (!reduce.matches) requestAnimationFrame(frame);
  }

  function start(): void {
    if (!reduce.matches) {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  }

  addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
  });
  addEventListener('resize', resize);
  new MutationObserver(() => {
    readColor();
    draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  reduce.addEventListener('change', () => (reduce.matches ? draw() : start()));

  readColor();
  resize();
  start();
}
