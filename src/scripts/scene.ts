// 메인 히어로 배경: 별(먼지) 입자가 깊이감 있게 반짝이며 천천히 다가오고, 포인터를 따라 시차가 생긴다 (three.js).
// 기준은 lifestories.org/discover의 별 장면이다(코드는 복사하지 않고 원리만 보고 직접 구현했다). docs/07 §3.
//  - 입자는 한 덩어리의 점구름(Points). 대부분 아주 작고 가끔 큰 별, 일부는 성단처럼 뭉친다.
//  - 입자마다 제 박자로 반짝이고(twinkle), 멀리·아주 가까이에서는 흐려지며, 화면에서 최대 크기가 제한된다.
//  - 별은 처음부터 이미 자리에 있고, 화면 전체가 부드럽게 나타난 뒤 별들이 점차 앞으로 다가온다(터져 나오는 연출 없음).
//  - 색은 CSS 토큰 --particle(rgb 채널). 테마가 바뀌면 다시 읽는다.
//  - prefers-reduced-motion이면 한 장면만 그린다. 탭이 숨겨지면 멈춘다. WebGL이 없으면 캔버스를 숨긴다.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineSegments,
  NormalBlending,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';

const canvas = document.querySelector<HTMLCanvasElement>('[data-scene]');

const VERT = /* glsl */ `
  uniform float uFly;        // 지금까지 날아온 거리(깊이 방향)
  uniform float uDepth;      // 깊이 범위
  uniform float uD0;         // 화면 가장자리에 정확히 걸리는 깊이
  uniform float uNear;
  uniform vec2 uPan;         // 포인터 시차(-1~1)
  uniform float uRoll;       // 아주 느린 회전
  uniform vec2 uTan;         // 화면 반폭/깊이 비율(x), 반높이/깊이 비율(y)
  uniform float uTime;
  uniform float uIntro;      // 0 → 1
  uniform float uIntroSpread;
  uniform float uDpr;
  uniform float uMaxPx;
  attribute float aSize;
  attribute float aSeed;
  attribute float aZ;
  varying float vAlpha;
  void main() {
    // 깊이: 날아온 만큼 가까워지고, 범위를 넘으면 먼 쪽으로 되돌아간다(끝없는 비행)
    float dist = uNear + mod(aZ - uFly, uDepth);
    float c = cos(uRoll), s = sin(uRoll);
    vec2 p = vec2(position.x * c - position.y * s, position.x * s + position.y * c);
    // 원근: 화면 위치는 p * D0 / dist. 멀리 있을 땐 중앙에 모여 있다가, 다가올수록 가속하며 테두리 쪽으로 퍼져 나간다
    vec2 xy = p * (uD0 / dist);
    // 가까운 별일수록 포인터에 크게 반응한다
    xy += uPan * vec2(0.05, 0.035) * (uD0 / dist);
    float onset = smoothstep(aSeed * 0.65, aSeed * 0.65 + 0.35, uIntro);
    xy *= mix(1.0 - uIntroSpread, 1.0, onset);
    gl_Position = vec4(xy, 0.0, 1.0);
    float t = dist / uDepth;
    float size = (0.9 + aSize * 3.2) * mix(2.4, 0.6, t) * uDpr;
    gl_PointSize = min(size, uMaxPx * uDpr) * onset;
    // 먼 쪽과 바로 눈앞에서는 흐려진다
    float far = 1.0 - smoothstep(0.55, 1.0, t);
    float near = smoothstep(0.0, 0.08, t);
    // 입자마다 제 박자의 반짝임(두 사인이 겹쳐 불규칙하게)
    float ph = aSeed * 40.0;
    float sp = 1.0 + fract(aSeed * 7.31) * 3.0;
    float tw = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.6 * sp + ph) * sin(uTime * 1.1 * sp + ph * 1.7));
    float edge = smoothstep(0.35, 1.1, length(xy));
    vAlpha = far * near * tw * onset * (1.0 - 0.7 * edge);
  }
`;

const STREAK_VERT = /* glsl */ `
  uniform float uFly;
  uniform float uDepth;
  uniform float uD0;
  uniform float uNear;
  uniform vec2 uPan;
  uniform float uRoll;
  uniform float uTime;
  uniform float uStreak;     // 꼬리 길이(깊이 단위)
  uniform float uAb;         // 색수차 방향(-1, 0, +1)
  attribute float aEnd;      // 0 = 머리(현재 위치), 1 = 꼬리(조금 먼 위치)
  attribute float aSeed;
  attribute float aZ;
  varying float vAlpha;
  void main() {
    float dist = uNear + mod(aZ - uFly, uDepth) + aEnd * uStreak;
    float c = cos(uRoll), s = sin(uRoll);
    vec2 p = vec2(position.x * c - position.y * s, position.x * s + position.y * c);
    vec2 xy = p * (uD0 / dist) + uPan * vec2(0.05, 0.035) * (uD0 / dist);
    float r = length(xy);
    // 테두리 쪽으로 갈수록 색이 갈라진다(색수차)
    xy *= 1.0 + uAb * 0.028 * r * r;
    gl_Position = vec4(xy, 0.0, 1.0);
    float t = dist / uDepth;
    float far = 1.0 - smoothstep(0.55, 1.0, t);
    float near = smoothstep(0.0, 0.08, t);
    float ph = aSeed * 40.0;
    float sp = 1.0 + fract(aSeed * 7.31) * 3.0;
    float tw = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * 1.6 * sp + ph) * sin(uTime * 1.1 * sp + ph * 1.7));
    // 중앙에서는 점, 테두리 쪽에서만 줄무늬가 보인다. 꼬리 끝은 투명
    float edge = smoothstep(0.55, 1.15, r);
    vAlpha = far * near * tw * edge * (1.0 - aEnd);
  }
`;

const STREAK_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = pow(1.0 - r, 1.6);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;

function start(canvas: HTMLCanvasElement): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 640px)');
  const root = document.documentElement;
  const css = (name: string) => getComputedStyle(root).getPropertyValue(name).trim();

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1); // 정점 셰이더가 직접 화면 좌표를 만든다

  const DEPTH = 36;
  const COUNT = small.matches ? 1500 : 3200;
  const FOV_TAN = Math.tan((60 * Math.PI) / 360); // fov 60°

  // 입자 생성: 화면 전체에 고르게 + 일부는 성단처럼 뭉친다. x,y는 깊이 1일 때 화면 비율(-1~1)
  const pos = new Float32Array(COUNT * 3);
  const size = new Float32Array(COUNT);
  const seed = new Float32Array(COUNT);
  const zs = new Float32Array(COUNT);
  const CLUSTERS = 24;
  const centers = Array.from({ length: CLUSTERS }, () => [Math.random() * 2.4 - 1.2, Math.random() * 2.4 - 1.2, Math.random() * DEPTH]);
  const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-6, Math.random()))) * Math.cos(2 * Math.PI * Math.random());
  for (let i = 0; i < COUNT; i++) {
    let x: number, y: number, z: number, big = 0.11 + Math.random() * 0.28;
    if (Math.random() < 0.08) {
      const c = centers[(Math.random() * CLUSTERS) | 0];
      x = c[0] + gauss() * 0.3;
      y = c[1] + gauss() * 0.3;
      z = c[2] + gauss() * 1.4;
      big = 0.13 + Math.random() * 0.5;
    } else {
      x = Math.random() * 2.4 - 1.2;
      y = Math.random() * 2.4 - 1.2;
      z = Math.random() * DEPTH;
    }
    if (Math.random() < 0.02) big = 0.9 + Math.random() * 0.8; // 가끔 큰 별
    pos.set([x, y, 0], i * 3);
    size[i] = big;
    seed[i] = Math.random();
    zs[i] = ((z % DEPTH) + DEPTH) % DEPTH;
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aSize', new BufferAttribute(size, 1));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  geo.setAttribute('aZ', new BufferAttribute(zs, 1));

  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uFly: { value: 0 },
      uDepth: { value: DEPTH },
      uD0: { value: 7 },
      uNear: { value: 0.3 },
      uPan: { value: [0, 0] },
      uRoll: { value: 0 },
      uTan: { value: [FOV_TAN, FOV_TAN] },
      uTime: { value: 0 },
      uIntro: { value: 1 },
      uIntroSpread: { value: 0 },
      uDpr: { value: 1 },
      uMaxPx: { value: 3.5 },
      uColor: { value: new Color(0xc2c2c2) },
      uOpacity: { value: 0.95 },
    },
  });
  const points = new Points(geo, material);
  points.frustumCulled = false;
  scene.add(points);

  // 테두리 쪽 줄무늬: 같은 별을 (머리, 꼬리) 두 점의 선분으로 그린다. 가운데 흰 줄 + 붉은·푸른 색수차 줄 두 겹
  const sPos = new Float32Array(COUNT * 6);
  const sEnd = new Float32Array(COUNT * 2);
  const sSeed = new Float32Array(COUNT * 2);
  const sZ = new Float32Array(COUNT * 2);
  for (let i = 0; i < COUNT; i++) {
    for (let k = 0; k < 2; k++) {
      sPos.set([pos[i * 3], pos[i * 3 + 1], 0], (i * 2 + k) * 3);
      sEnd[i * 2 + k] = k;
      sSeed[i * 2 + k] = seed[i];
      sZ[i * 2 + k] = zs[i];
    }
  }
  const sGeo = new BufferGeometry();
  sGeo.setAttribute('position', new BufferAttribute(sPos, 3));
  sGeo.setAttribute('aEnd', new BufferAttribute(sEnd, 1));
  sGeo.setAttribute('aSeed', new BufferAttribute(sSeed, 1));
  sGeo.setAttribute('aZ', new BufferAttribute(sZ, 1));
  const streakMats = [
    { ab: 0, color: new Color(0xc2c2c2), opacity: 0.4 },
    { ab: 1, color: new Color(1.0, 0.25, 0.2), opacity: 0.16 },
    { ab: -1, color: new Color(0.25, 0.45, 1.0), opacity: 0.16 },
  ].map((m, i) => {
    const mat = new ShaderMaterial({
      vertexShader: STREAK_VERT,
      fragmentShader: STREAK_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uFly: material.uniforms.uFly,
        uDepth: material.uniforms.uDepth,
        uD0: material.uniforms.uD0,
        uNear: material.uniforms.uNear,
        uPan: material.uniforms.uPan,
        uRoll: material.uniforms.uRoll,
        uTime: material.uniforms.uTime,
        uStreak: { value: 0.16 },
        uAb: { value: m.ab },
        uColor: { value: m.color },
        uOpacity: { value: m.opacity },
      },
    });
    const lines = new LineSegments(sGeo, mat);
    lines.frustumCulled = false;
    lines.renderOrder = i;
    scene.add(lines);
    return { mat, base: m, lines };
  });

  function readTheme(): void {
    const rgb = css('--particle').split(',').map((n) => Number(n.trim()));
    if (rgb.length === 3 && rgb.every((n) => !Number.isNaN(n))) material.uniforms.uColor.value = new Color(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    // 어두운 배경에서는 빛으로 더하고, 밝은 배경에서는 어두운 점으로 얹는다
    const light = root.getAttribute('data-theme') === 'light';
    material.blending = light ? NormalBlending : AdditiveBlending;
    material.uniforms.uOpacity.value = light ? 0.7 : 0.95;
    material.needsUpdate = true;
    // 줄무늬·색수차는 어두운 배경에서만(밝은 배경에서는 빛으로 더하는 효과가 보이지 않는다)
    streakMats.forEach((m, i) => {
      m.lines.visible = !light;
      if (i === 0) m.mat.uniforms.uColor.value = material.uniforms.uColor.value;
    });
    if (reduce.matches) render();
  }

  function resize(): void {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    material.uniforms.uDpr.value = dpr;
    material.uniforms.uTan.value = [FOV_TAN * (w / h), FOV_TAN];
    if (reduce.matches) render();
  }

  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  let clock = 0;
  let last = 0;
  let intro = 0;
  const FADE_SECONDS = 1.6; // 캔버스가 나타나는 시간(별의 위치·크기는 그대로)
  const FLY_SPEED = 0.8; // 초당 깊이 이동량(36 중): 이미 있는 별이 천천히 앞으로 다가온다
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  function render(): void {
    renderer.render(scene, camera);
  }

  function frame(now: number): void {
    const dt = Math.min((now - last) / 1000 || 0, 0.05);
    last = now;
    clock += dt;
    intro = Math.min(1, intro + dt / FADE_SECONDS);
    px += (tx - px) * Math.min(1, dt * 2.2);
    py += (ty - py) * Math.min(1, dt * 2.2);
    const u = material.uniforms;
    u.uTime.value = clock;
    u.uFly.value = clock * FLY_SPEED;
    u.uPan.value = [px, py];
    u.uRoll.value = clock * 0.004;
    canvas.style.opacity = String(ease(intro));
    render();
  }

  let raf = 0;
  function loop(now: number): void {
    frame(now);
    raf = requestAnimationFrame(loop);
  }

  function play(): void {
    cancelAnimationFrame(raf);
    if (reduce.matches) {
      const u = material.uniforms;
      u.uIntro.value = 1;
      u.uFly.value = 0;
      u.uTime.value = 1.7;
      canvas.style.opacity = '1';
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
  play();
}

if (canvas) {
  try {
    start(canvas);
  } catch {
    canvas.hidden = true; // WebGL을 못 쓰면 배경 없이 문구만 보인다
  }
}
