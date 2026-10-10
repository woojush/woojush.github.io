// 메인 히어로 배경: 별(먼지) 입자가 깊이감 있게 반짝이며 천천히 다가오고, 포인터를 따라 시차가 생긴다 (three.js).
// 기준은 lifestories.org/discover의 별 장면이다(코드는 복사하지 않고 원리만 보고 직접 구현했다). docs/07 §3.
//  - 입자는 한 덩어리의 점구름(Points). 대부분 아주 작고 가끔 큰 별, 일부는 성단처럼 뭉친다.
//  - 입자마다 제 박자로 반짝이고(twinkle), 멀리·아주 가까이에서는 흐려지며, 화면에서 최대 크기가 제한된다.
//  - 별은 처음부터 이미 자리에 있고, 화면 전체가 부드럽게 나타난 뒤 별들이 점차 앞으로 다가온다(터져 나오는 연출 없음).
//  - 비행 속도와 마지막 확대의 강도는 밖(home-intro.ts)이 정한다. 문구가 커지는 속도와 같은 곡선이다(intro-timeline.ts).
//  - 색은 CSS 토큰 --particle(rgb 채널). 테마가 바뀌면 다시 읽는다.
//  - prefers-reduced-motion이면 한 장면만 그린다. WebGL이 없으면 startScene이 던지고, 부르는 쪽이 캔버스를 숨긴다.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';

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
  uniform float uBoost;      // 마지막 확대의 진행(0~1): 별이 더 크고 밝게 지나간다
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
    // 원근법: 처음(먼 곳)의 크기에서 시작해, 다가올수록 거리에 반비례하는 쪽으로 점점 커진다
    float size = (0.9 + aSize * 3.2) * 0.6 * pow(uDepth / dist, 0.55) * (1.0 + 0.6 * uBoost) * uDpr;
    gl_PointSize = clamp(size, 3.0 * uDpr, uMaxPx * (1.0 + uBoost) * uDpr) * onset; // 최소 3px(discover의 1px보다 2px 크게)
    // 먼 쪽과 바로 눈앞에서는 흐려진다
    float far = 1.0 - smoothstep(0.55, 1.0, t);
    float near = smoothstep(0.0, 0.08, t);
    // 입자마다 제 박자의 반짝임(두 사인이 겹쳐 불규칙하게)
    float ph = aSeed * 40.0;
    float sp = 1.0 + fract(aSeed * 7.31) * 3.0;
    float tw = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.6 * sp + ph) * sin(uTime * 1.1 * sp + ph * 1.7));
    float rr = length(xy);
    float edge = smoothstep(0.35, 1.1, rr);
    // 가운데에도 별이 있되, 한 점으로 뭉쳐 보이지 않도록 가장 안쪽만 아주 옅게 한다
    float hole = smoothstep(0.02, 0.16, rr);
    // 마지막 확대에서는 가장자리로 쏟아지는 별도 흐려지지 않고 오히려 밝아진다
    vAlpha = far * near * tw * onset * (1.0 - 0.7 * edge * (1.0 - uBoost)) * hole * (1.0 + 0.35 * uBoost);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = pow(1.0 - r, 0.9);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;

export interface SceneHandle {
  /** 한 프레임 그린다. flySpeed: 앞으로 날아오는 속도(깊이 단위/초), boost: 마지막 확대의 진행(0~1), clock: 장면이 시작한 뒤의 초, alpha: 장면 전체의 투명도 배수(0~1) */
  update(flySpeed: number, boost: number, dt: number, clock: number, alpha: number): void;
}

export function startScene(canvas: HTMLCanvasElement): SceneHandle {
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
    // 소실점(가운데)을 정확히 지나가는 별은 만들지 않는다: 한 점으로 뭉쳐 보이는 것을 막고, 가운데에도 별은 흩어져 있게 한다
    const rr = Math.hypot(x, y);
    if (rr < 0.32) {
      const k = (0.32 + Math.random() * 0.2) / Math.max(rr, 1e-3);
      x *= k;
      y *= k;
    }
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
      uMaxPx: { value: 9 },
      uBoost: { value: 0 },
      uColor: { value: new Color(0xc2c2c2) },
      uOpacity: { value: 0.95 },
    },
  });
  const points = new Points(geo, material);
  points.frustumCulled = false;
  scene.add(points);

  function readTheme(): void {
    const rgb = css('--particle').split(',').map((n) => Number(n.trim()));
    if (rgb.length === 3 && rgb.every((n) => !Number.isNaN(n))) material.uniforms.uColor.value = new Color(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    // 어두운 배경에서는 빛으로 더하고, 밝은 배경에서는 어두운 점으로 얹는다
    const light = root.getAttribute('data-theme') === 'light';
    material.blending = light ? NormalBlending : AdditiveBlending;
    material.uniforms.uOpacity.value = light ? 0.7 : 0.95;
    material.needsUpdate = true;
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
  let intro = 0;
  const FADE_SECONDS = 1.6; // 캔버스가 나타나는 시간(별의 위치·크기는 그대로)
  let fly = 0;
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  function render(): void {
    renderer.render(scene, camera);
  }

  // 움직임을 줄이는 설정이면 한 장면만 그린다
  function still(): void {
    const u = material.uniforms;
    u.uIntro.value = 1;
    u.uFly.value = 0;
    u.uTime.value = 1.7;
    u.uBoost.value = 0;
    canvas.style.opacity = '1';
    render();
  }

  function update(flySpeed: number, boost: number, dt: number, clock: number, alpha: number): void {
    if (reduce.matches) return;
    intro = Math.min(1, intro + dt / FADE_SECONDS);
    px += (tx - px) * Math.min(1, dt * 2.2);
    py += (ty - py) * Math.min(1, dt * 2.2);
    fly += flySpeed * dt;
    const u = material.uniforms;
    u.uTime.value = clock;
    u.uFly.value = fly;
    u.uBoost.value = boost;
    u.uPan.value = [px, py];
    u.uRoll.value = clock * 0.004;
    canvas.style.opacity = String(ease(intro) * alpha);
    render();
  }

  addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = -((e.clientY / innerHeight) * 2 - 1);
  });
  addEventListener('resize', resize);
  reduce.addEventListener('change', () => reduce.matches && still());
  new MutationObserver(readTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  resize();
  readTheme();
  if (reduce.matches) still();
  return { update };
}
