// 메인 히어로 배경: 별(먼지) 입자가 깊이감 있게 반짝이며 천천히 다가오고, 포인터를 따라 시차가 생긴다 (three.js).
// 기준은 lifestories.org/discover의 별 장면이다(코드는 복사하지 않고 원리만 보고 직접 구현했다). docs/07 §3.
//  - 입자는 한 덩어리의 점구름(Points). 대부분 아주 작고 가끔 큰 별, 일부는 성단처럼 뭉친다.
//  - 입자마다 제 박자로 반짝이고(twinkle), 멀리·아주 가까이에서는 흐려지며, 화면에서 최대 크기가 제한된다.
//  - 별은 처음부터 이미 자리에 있고, 화면 전체가 부드럽게 나타난 뒤 별들이 점차 앞으로 다가온다(터져 나오는 연출 없음).
//  - 비행 속도와 마지막 확대의 강도는 밖(home-intro.ts)이 정한다. 문구가 커지는 속도와 같은 곡선이다(intro-timeline.ts).
//  - 마지막 확대(블랙홀로 빨려 들어가는 구간)에서는 별이 짧은 줄(streak)로 늘어나 가운데에서 쏟아지고 장면이 점점 빠르게 회전한다.
//  - 별은 화면 전체에 고르게 흩어진다(멀리 있을 때의 화면 위치를 고르게 뽑고, 다가오며 바깥으로 흘러간다). 가장자리 별도 보인다.
//  - 선택(post): 가장자리로 갈수록 색이 어긋나는 색수차 + 가장자리 비네팅 + 잔 그레인(lifestories.org와 같은 후처리). 전환 때 setFx로 세게 한다.
//  - 색은 CSS 토큰 --particle(rgb 채널). 테마가 바뀌면 다시 읽는다.
//  - prefers-reduced-motion이면 한 장면만 그린다. WebGL이 없으면 startScene이 던지고, 부르는 쪽이 캔버스를 숨긴다.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineSegments,
  NormalBlending,
  OrthographicCamera,
  Mesh,
  NoBlending,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderTarget,
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
  #ifdef STREAK
  uniform float uTrail;      // 줄의 길이(깊이 단위): 꼬리는 그만큼 먼 곳(가운데에 더 가까운 쪽)에 있다
  attribute float aEnd;      // 0 = 머리, 1 = 꼬리
  #endif
  attribute float aSize;
  attribute float aSeed;
  attribute float aZ;
  varying float vAlpha;
  void main() {
    // 깊이: 날아온 만큼 가까워지고, 범위를 넘으면 먼 쪽으로 되돌아간다(끝없는 비행)
    float dist = uNear + mod(aZ - uFly, uDepth);
    float distP = dist; // 화면에 놓는 깊이(줄의 꼬리는 더 멀다)
    float tailKeep = 1.0;
    #ifdef STREAK
    distP = dist + uTrail * aEnd;
    // 꼬리가 깊이 범위를 넘어 되돌아간 별은 그리지 않는다(화면을 가로지르는 줄이 생기지 않게). 꼬리 쪽은 점점 옅어진다
    tailKeep = (1.0 - aEnd * 0.9) * step(distP, uNear + uDepth) * smoothstep(0.0, 0.3, uBoost);
    #endif
    float c = cos(uRoll), s = sin(uRoll);
    vec2 p = vec2(position.x * c - position.y * s, position.x * s + position.y * c);
    // 원근: 화면 위치는 p * D0 / dist. 멀리 있을 땐 중앙에 모여 있다가, 다가올수록 가속하며 테두리 쪽으로 퍼져 나간다
    vec2 xy = p * (uD0 / distP);
    // 가까운 별일수록 포인터에 크게 반응한다
    xy += uPan * vec2(0.05, 0.035) * (uD0 / distP);
    float onset = smoothstep(aSeed * 0.65, aSeed * 0.65 + 0.35, uIntro);
    xy *= mix(1.0 - uIntroSpread, 1.0, onset);
    gl_Position = vec4(xy, 0.0, 1.0);
    float t = dist / uDepth;
    // 원근법: 처음(먼 곳)의 크기에서 시작해, 다가올수록 거리에 반비례하는 쪽으로 점점 커진다
    float size = (0.9 + aSize * 3.2) * 0.6 * pow(uDepth / dist, 0.55) * (1.0 + 0.6 * uBoost) * uDpr;
    gl_PointSize = clamp(size, 2.4 * uDpr, uMaxPx * (1.0 + uBoost) * uDpr) * onset; // 최소 2px: discover처럼 작고 또렷한 점
    // 먼 쪽과 바로 눈앞에서는 흐려진다
    float far = 1.0 - smoothstep(0.78, 1.0, t);
    float near = smoothstep(0.0, 0.08, t);
    // 입자마다 제 박자의 반짝임(두 사인이 겹쳐 불규칙하게)
    float ph = aSeed * 40.0;
    float sp = 1.0 + fract(aSeed * 7.31) * 3.0;
    float tw = 0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * 1.6 * sp + ph) * sin(uTime * 1.1 * sp + ph * 1.7));
    float rr = length(xy);
    float edge = smoothstep(0.35, 1.1, rr);
    // 가운데에도 별이 있되, 한 점으로 뭉쳐 보이지 않도록 가장 안쪽만 아주 옅게 한다
    float hole = smoothstep(0.02, 0.16, rr);
    // 마지막 확대에서는 가장자리로 쏟아지는 별도 흐려지지 않고 오히려 밝아진다
    vAlpha = far * near * tw * onset * (1.0 - 0.3 * edge * (1.0 - uBoost)) * hole * (1.0 + 0.35 * uBoost) * tailKeep * 1.7;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = pow(1.0 - r, 0.85); // 가장자리가 빨리 꺼져 또렷한 점
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;

// 줄(streak)은 점과 같은 별 데이터를 쓰되 한 별이 머리·꼬리 두 꼭짓점이다. 색만 칠한다
const FRAG_LINE = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);
  }
`;

export interface SceneHandle {
  /** 한 프레임 그린다. flySpeed: 앞으로 날아오는 속도(깊이 단위/초), boost: 마지막 확대의 진행(0~1), clock: 장면이 시작한 뒤의 초, alpha: 장면 전체의 투명도 배수(0~1) */
  update(flySpeed: number, boost: number, dt: number, clock: number, alpha: number): void;
  /** 후처리(색수차·비네팅·그레인)를 세게 하는 정도(0~1). startScene에서 post를 켠 경우에만 의미가 있다 */
  setFx(amount: number): void;
}

// 후처리: 별 장면을 한 번 텍스처에 그린 뒤, 화면 가장자리로 갈수록 R·B 채널을 반대 방향으로 밀어 색이 어긋나게 하고(색수차),
// 가장자리를 어둡게 하고(비네팅), 잔 노이즈(그레인)를 얹는다. 결과는 곱해진(premultiplied) 색으로 내보낸다.
const POST_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const POST_FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uCA;      // 색수차 세기(모서리에서의 UV 이동량)
  uniform float uBlur;    // 가장자리 번짐 반경(모서리에서의 UV 길이)
  uniform float uVig;     // 가장자리 어둡기(0~1)
  uniform float uGrain;   // 그레인 세기
  uniform float uAspect;  // 가로/세로
  uniform float uTime;
  uniform float uLight;   // 1이면 밝은 테마(별이 어두운 점): 비네팅·그레인을 쓰지 않는다
  varying vec2 vUv;
  // 사선·격자 무늬가 없는 노이즈 (Hoskins hash). interleaved gradient noise는 사선 줄무늬가 보여 쓰지 않는다
  float ign(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  void main() {
    vec2 c = vUv - 0.5;
    float r2 = dot(c, c) * 4.0;          // 가운데 0 → 모서리 약 2
    float rr = sqrt(r2);
    float edge = smoothstep(0.6, 1.35, rr); // 번짐은 중심에서 더 멀리 떨어진 곳부터
    vec2 off = c * uCA * r2;
    // 가장자리일수록 퍼지는 원형 번짐: R·B는 반대로 어긋난 중심에서, G는 제자리에서 모은다
    float rad = uBlur * edge * edge;
    vec4 sr = vec4(0.0);
    vec4 sg = vec4(0.0);
    vec4 sb = vec4(0.0);
    // 점마다 나선을 무작위로 돌려 한 별이 여러 개의 점(눈송이 무늬)으로 갈라지지 않고 곱게 번지게 한다
    float rot = ign(gl_FragCoord.xy * 0.91 + 17.0) * 6.2831853;
    for (int i = 0; i < 12; i++) {
      float ang = float(i) * 2.39996 + rot;
      float d = sqrt((float(i) + 0.5) / 12.0);
      vec2 o = vec2(cos(ang), sin(ang) * uAspect) * d * rad;
      sr += texture2D(uTex, vUv + off + o);
      sg += texture2D(uTex, vUv + o * 0.8);
      sb += texture2D(uTex, vUv - off + o * 1.15);
    }
    sr /= 12.0;
    sg /= 12.0;
    sb /= 12.0;
    vec3 col = vec3(sr.r, sg.g * (1.0 + 0.3 * edge * (1.0 - uLight)), sb.b);
    // 어두운 테마: 별은 빛(더하기)이라 밝기가 곧 불투명도. 밝은 테마: 저장된 알파를 쓴다
    float a = mix(max(col.r, max(col.g, col.b)), max(sr.a, max(sg.a, sb.a)), uLight);
    float vr = smoothstep(0.0, 1.5, rr); // 0에서 기울기가 0이라 비네팅이 시작되는 경계선(등고선)이 생기지 않는다
    float v = uVig * vr * vr * (1.0 - uLight);
    float n1 = ign(gl_FragCoord.xy + fract(uTime * 0.37) * 211.0) - 0.5;
    float n2 = ign(gl_FragCoord.yx * 1.31 + fract(uTime * 0.53) * 173.0) - 0.5;
    float g = n1 * uGrain * (0.35 + 0.65 * edge) * (1.0 - uLight);
    vec3 n = vec3(g, g * 0.6 + n2 * uGrain * edge * 0.8, g);
    col = col * (1.0 - v) + max(n, 0.0) * 0.9;
    float outA = 1.0 - (1.0 - a) * (1.0 - v);
    outA = max(outA, max(col.r, max(col.g, col.b)) * (1.0 - uLight));
    // 비네팅이 만드는 단계(밴딩)가 등고선처럼 보이지 않게 어둠 쪽 알파에 미세한 디더를 섞는다
    outA = clamp(outA + n1 * 0.11 * min(1.0, v * 10.0), 0.0, 1.0);
    gl_FragColor = vec4(col, outA);
  }
`;

export function startScene(canvas: HTMLCanvasElement, options: { post?: boolean } = {}): SceneHandle {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 640px)');
  const root = document.documentElement;
  const css = (name: string) => getComputedStyle(root).getPropertyValue(name).trim();

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1); // 정점 셰이더가 직접 화면 좌표를 만든다

  const DEPTH = 36;
  const COUNT = small.matches ? 4500 : 11000;
  const FOV_TAN = Math.tan((60 * Math.PI) / 360); // fov 60°

  // 입자 생성: 화면 전체에 고르게 + 일부는 성단처럼 뭉친다. x,y는 깊이 1일 때 화면 비율(-1~1)
  const pos = new Float32Array(COUNT * 3);
  const size = new Float32Array(COUNT);
  const seed = new Float32Array(COUNT);
  const zs = new Float32Array(COUNT);
  const CLUSTERS = 24;
  // 별의 화면 위치는 p * D0 / dist. 가장 먼 깊이(dist≈DEPTH)에서 화면 전체에 고르게 놓이도록 p = s * (DFAR / D0)로 뽑는다.
  // (p를 상자 안에서 고르게 뽑으면 화면 가운데에 몰리고 바깥은 비는 고리 모양이 된다)
  const D0 = 7;
  const DFAR = DEPTH + 0.3;
  const K = DFAR / D0;
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
      x = Math.random() * 2.6 - 1.3;
      y = Math.random() * 2.6 - 1.3;
      z = Math.random() * DEPTH;
    }
    if (Math.random() < 0.02) big = 0.9 + Math.random() * 0.8; // 가끔 큰 별
    // 소실점(가운데)을 정확히 지나가는 별은 만들지 않는다: 한 점으로 뭉쳐 보이는 것을 막는다
    const rr = Math.hypot(x, y);
    if (rr < 0.05) {
      const k = (0.05 + Math.random() * 0.08) / Math.max(rr, 1e-3);
      x *= k;
      y *= k;
    }
    pos.set([x * K, y * K, 0], i * 3);
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
      uD0: { value: D0 },
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

  // 별마다 머리·꼬리 두 꼭짓점. 마지막 확대에서만 보인다
  const dup = (src: Float32Array, n: number) => {
    const out = new Float32Array(src.length * 2);
    for (let i = 0; i < src.length / n; i++) {
      out.set(src.subarray(i * n, i * n + n), i * n * 2);
      out.set(src.subarray(i * n, i * n + n), i * n * 2 + n);
    }
    return out;
  };
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute('position', new BufferAttribute(dup(pos, 3), 3));
  lineGeo.setAttribute('aSize', new BufferAttribute(dup(size, 1), 1));
  lineGeo.setAttribute('aSeed', new BufferAttribute(dup(seed, 1), 1));
  lineGeo.setAttribute('aZ', new BufferAttribute(dup(zs, 1), 1));
  lineGeo.setAttribute('aEnd', new BufferAttribute(Float32Array.from({ length: COUNT * 2 }, (_, i) => i % 2), 1));
  material.uniforms.uTrail = { value: 0 };
  const lineMaterial = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG_LINE,
    defines: { STREAK: '' },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: material.uniforms, // 점과 같은 값을 같이 쓴다
  });
  const streaks = new LineSegments(lineGeo, lineMaterial);
  streaks.frustumCulled = false;
  streaks.visible = false;
  scene.add(streaks);

  // 후처리 준비 (options.post일 때만)
  const post = options.post
    ? (() => {
        const target = new WebGLRenderTarget(2, 2, { depthBuffer: false });
        const mat = new ShaderMaterial({
          vertexShader: POST_VERT,
          fragmentShader: POST_FRAG,
          blending: NoBlending,
          transparent: false,
          depthTest: false,
          depthWrite: false,
          uniforms: {
            uTex: { value: target.texture },
            uCA: { value: 0.006 },
            uBlur: { value: 0.006 },
            uAspect: { value: 1.6 },
            uVig: { value: 0.3 },
            uGrain: { value: 0.03 },
            uTime: { value: 0 },
            uLight: { value: 0 },
          },
        });
        const quad = new Mesh(new PlaneGeometry(2, 2), mat);
        quad.frustumCulled = false;
        const postScene = new Scene();
        postScene.add(quad);
        return { target, mat, postScene };
      })()
    : null;
  let fx = 0;

  function readTheme(): void {
    const rgb = css('--particle').split(',').map((n) => Number(n.trim()));
    if (rgb.length === 3 && rgb.every((n) => !Number.isNaN(n))) material.uniforms.uColor.value = new Color(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    // 어두운 배경에서는 빛으로 더하고, 밝은 배경에서는 어두운 점으로 얹는다
    const light = root.getAttribute('data-theme') === 'light';
    material.blending = light ? NormalBlending : AdditiveBlending;
    material.uniforms.uOpacity.value = light ? 0.7 : 0.95;
    lineMaterial.blending = material.blending;
    material.needsUpdate = true;
    lineMaterial.needsUpdate = true;
    if (post) post.mat.uniforms.uLight.value = light ? 1 : 0;
    if (reduce.matches) render();
  }

  function resize(): void {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    material.uniforms.uDpr.value = dpr;
    post?.target.setSize(Math.max(2, Math.round(w * dpr)), Math.max(2, Math.round(h * dpr)));
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
  let swirl = 0;
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  function render(): void {
    if (!post) {
      renderer.render(scene, camera);
      return;
    }
    const pu = post.mat.uniforms;
    pu.uCA.value = 0.006 + 0.016 * fx;
    pu.uBlur.value = 0.007 + 0.014 * fx;
    pu.uAspect.value = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    pu.uVig.value = 0.16 + 0.34 * fx;
    pu.uGrain.value = 0.03 + 0.07 * fx;
    pu.uTime.value = material.uniforms.uTime.value;
    renderer.setRenderTarget(post.target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(post.postScene, camera);
  }

  // 움직임을 줄이는 설정이면 한 장면만 그린다
  function still(): void {
    const u = material.uniforms;
    u.uIntro.value = 1;
    u.uFly.value = 0;
    u.uTime.value = 1.7;
    u.uBoost.value = 0;
    streaks.visible = false;
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
    // 마지막 확대에서는 줄이 길어지고 장면이 점점 빨리 소용돌이친다
    swirl += boost * boost * 2.5 * dt;
    u.uRoll.value = clock * 0.004 + swirl;
    // 줄은 켜지는 순간 없이 boost를 따라 0부터 길어진다(임계값 없음). 밝기도 셰이더에서 같이 서서히 나타난다
    const ramp = Math.min(1, boost / 0.35);
    u.uTrail.value = Math.min(flySpeed * 0.06, 5) * ramp * ramp * (3 - 2 * ramp);
    streaks.visible = boost > 0;
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
  function setFx(amount: number): void {
    fx = Math.min(1, Math.max(0, amount));
  }
  return { update, setFx };
}
