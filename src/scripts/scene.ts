// 메인 히어로 배경: 3D 공간에 카드가 떠다니고, 가는 입자가 흐르며, 포인터를 따라 카메라가 살짝 움직인다 (three.js).
// 모양의 기준은 lifestories.org/discover의 장면이다(코드는 복사하지 않고 직접 구현했다). docs/07 §3 참고.
// - 카드 내용은 index.astro가 data-cards(JSON)로 넘긴다. 내용이 없는 카드는 빈 액자(깊이감용)다.
// - 색은 CSS 토큰(--bg, --surface, --text, --text-muted, --particle)에서 읽고, 테마가 바뀌면 다시 읽는다.
// - prefers-reduced-motion이면 한 장면만 그린다. 탭이 숨겨지면 멈춘다. WebGL이 없으면 캔버스를 숨긴다.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';

interface CardData {
  label: string;
  title: string;
}

const canvas = document.querySelector<HTMLCanvasElement>('[data-scene]');

function start(canvas: HTMLCanvasElement): void {
  const cards: CardData[] = JSON.parse(canvas.dataset.cards || '[]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 640px)');
  const root = document.documentElement;
  const css = (name: string) => getComputedStyle(root).getPropertyValue(name).trim();

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 60);
  camera.position.set(0, 0, 8);

  const world = new Group();
  scene.add(world);

  const CARD_W = 1.7;
  const CARD_H = 1.05;
  const geometry = new PlaneGeometry(CARD_W, CARD_H);

  interface Floater {
    mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
    data: CardData | null;
    base: [number, number, number];
    phase: number;
    speed: number;
  }
  const floaters: Floater[] = [];

  // 카드 한 장의 그림: 어두운 면 + 얇은 테두리 + 라벨/제목. 내용이 없으면 면과 테두리만 그린다.
  function paint(data: CardData | null): CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 680;
    c.height = 420;
    const g = c.getContext('2d')!;
    const r = 28;
    g.fillStyle = `rgb(${css('--card-rgb') || '28, 27, 25'})`;
    g.beginPath();
    g.roundRect(4, 4, c.width - 8, c.height - 8, r);
    g.fill();
    g.strokeStyle = `rgba(${css('--particle') || '235, 231, 223'}, 0.3)`;
    g.lineWidth = 3;
    g.stroke();
    if (data) {
      const family = getComputedStyle(root).getPropertyValue('--font-sans') || 'sans-serif';
      g.fillStyle = css('--text-muted') || '#a09b90';
      g.font = `500 30px ${family}`;
      g.fillText(data.label, 44, 78);
      g.fillStyle = css('--text') || '#ebe7df';
      g.font = `600 56px ${family}`;
      const words = data.title.split(' ');
      let line = '';
      let y = 190;
      for (const w of words) {
        const next = line ? `${line} ${w}` : w;
        if (g.measureText(next).width > c.width - 88 && line) {
          g.fillText(line, 44, y);
          line = w;
          y += 70;
        } else line = next;
      }
      g.fillText(line, 44, y);
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  function buildCards(): void {
    for (const f of floaters) {
      f.mesh.material.map?.dispose();
      f.mesh.material.dispose();
      world.remove(f.mesh);
    }
    floaters.length = 0;
    const total = small.matches ? 9 : 16;
    for (let i = 0; i < total; i++) {
      const data = cards[i] ?? null;
      const mat = new MeshBasicMaterial({ map: paint(data), transparent: true, opacity: data ? 1 : 0.8, fog: true });
      const mesh = new Mesh(geometry, mat);
      // 보이는 영역 안에 겹치지 않게 흩뿌린다: 격자 칸마다 한 장, 칸 안에서 흔든다
      const cols = small.matches ? 3 : 5;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const rows = Math.ceil(total / cols);
      const x = ((col + 0.5) / cols - 0.5) * (small.matches ? 7 : 17) + (Math.random() - 0.5) * 2;
      const y = (0.5 - (row + 0.5) / rows) * (small.matches ? 11 : 8.5) + (Math.random() - 0.5) * 1.4;
      const z = -6 + Math.random() * 6;
      mesh.position.set(x, y, z);
      mesh.rotation.set((Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.45, (Math.random() - 0.5) * 0.12);
      world.add(mesh);
      floaters.push({ mesh, data, base: [x, y, z], phase: Math.random() * Math.PI * 2, speed: 0.12 + Math.random() * 0.18 });
    }
  }

  // 가는 입자 층
  const COUNT = small.matches ? 260 : 520;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 24;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pos[i * 3 + 2] = -10 + Math.random() * 16;
  }
  const pGeo = new BufferGeometry();
  pGeo.setAttribute('position', new BufferAttribute(pos, 3));
  const dot = document.createElement('canvas');
  dot.width = dot.height = 64;
  const dg = dot.getContext('2d')!;
  const grad = dg.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  dg.fillStyle = grad;
  dg.fillRect(0, 0, 64, 64);
  const pMat = new PointsMaterial({ size: 0.07, map: new CanvasTexture(dot), transparent: true, opacity: 0.7, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true });
  const points = new Points(pGeo, pMat);
  scene.add(points);

  function readTheme(): void {
    const rgb = css('--particle').split(',').map((n) => Number(n.trim()));
    pMat.color = new Color(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    // 가까운 카드는 또렷하게, 먼 카드는 배경 색으로 묻히게
    scene.fog = new Fog(new Color(css('--bg') || '#121211'), 9, 24);
    buildCards();
    if (reduce.matches) render();
  }

  function resize(): void {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (reduce.matches) render();
  }

  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  let clock = 0;
  let last = 0;
  let intro = 0; // 0 → 1: 처음 한 번 천천히 나타난다

  function render(): void {
    renderer.render(scene, camera);
  }

  function frame(now: number): void {
    const dt = Math.min((now - last) / 1000 || 0, 0.05);
    last = now;
    clock += dt;
    intro = Math.min(1, intro + dt / 2.2);
    px += (tx - px) * Math.min(1, dt * 2.5);
    py += (ty - py) * Math.min(1, dt * 2.5);
    // 카메라: 아주 느린 떠다님 + 포인터 시차
    camera.position.x = Math.sin(clock * 0.07) * 0.6 + px * 0.9;
    camera.position.y = Math.cos(clock * 0.05) * 0.35 + py * 0.55;
    camera.position.z = 8 - (1 - ease(intro)) * 2.5;
    camera.lookAt(0, 0, 0);
    for (const f of floaters) {
      const t = clock * f.speed + f.phase;
      f.mesh.position.set(f.base[0] + Math.sin(t) * 0.35, f.base[1] + Math.cos(t * 1.3) * 0.28, f.base[2] + Math.sin(t * 0.7) * 0.4);
      f.mesh.rotation.z += Math.sin(t) * 0.0004;
    }
    points.rotation.y = clock * 0.012;
    canvas.style.opacity = String(ease(intro));
    render();
  }
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  let raf = 0;
  function loop(now: number): void {
    frame(now);
    raf = requestAnimationFrame(loop);
  }

  function play(): void {
    cancelAnimationFrame(raf);
    if (reduce.matches) {
      intro = 1;
      canvas.style.opacity = '1';
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      render();
    } else if (!document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  }

  addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = -((e.clientY / innerHeight) * 2 - 1);
  });
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', play);
  reduce.addEventListener('change', play);
  new MutationObserver(readTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  resize();
  readTheme();
  // 글꼴이 준비된 뒤 카드 글자를 다시 그린다
  document.fonts?.ready.then(readTheme);
  play();
}

if (canvas) {
  try {
    start(canvas);
  } catch {
    canvas.hidden = true; // WebGL을 못 쓰면 배경 없이 문구만 보인다
  }
}
