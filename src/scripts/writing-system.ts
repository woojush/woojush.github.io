// Writing 입구: 실제 태양계를 닮은 3D 장면 (three.js, 질감 이미지 없이 셰이더로 그림 — scripts/solar/shaders.ts).
//  - 태양 + 수성·금성·지구(달)·화성·소행성대·목성·토성(고리)·천왕성·해왕성. 거리와 크기는 보기 좋게 압축·과장했다.
//  - 글의 형식 4종만 누를 수 있다: 시=수성, 산문=목성, 에세이=토성, 책갈피=달. 나머지는 배경의 천체다.
//  - 마우스를 올린(또는 포커스한) 행성만 공전이 멈추고 후광이 켜진다. 누르면 카메라가 그 행성으로 다가간 뒤 이동한다.
//  - 별 배경은 홈·Knowledge와 같은 장면(scene.ts)을 뒤에 깔고, 카메라가 움직이면 약간 어긋나 깊이가 느껴진다.
//  - 움직임 줄이기: 공전·카메라 흔들림·다가가기를 끈다. WebGL이 없으면 `no-gl`로 평범한 링크 목록이 된다.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  CustomBlending,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  OneFactor,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  ZeroFactor,
} from 'three';
import { startScene, type SceneHandle } from '@/scripts/scene';
import { GLOW_FRAG, GLOW_VERT, PLANET_FRAG, PLANET_VERT, RING_FRAG, RING_VERT, SUN_FRAG } from '@/scripts/solar/shaders';

const section = document.querySelector<HTMLElement>('[data-wspace="system"]');
const glCanvas = section?.querySelector<HTMLCanvasElement>('[data-wgl]');
const sky = section?.querySelector<HTMLCanvasElement>('[data-wsky]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 640px)');

interface BodySpec {
  id: string;
  type: number; // 셰이더의 uType
  r: number; // 반지름
  orbit: number; // 궤도 반지름
  period: number; // 공전 주기(초)
  phase: number; // 시작 각도(도)
  spin: number; // 자전(rad/s)
  tilt?: number; // 자전축 기울기(rad)
  parent?: string;
  link?: string; // data-body 값(누를 수 있는 천체)
  halo: [number, number, number];
  seed: number;
}

// 단위는 임의다. 가운데 태양 반지름 5.5, 해왕성 궤도 66.
const SPECS: BodySpec[] = [
  { id: 'Mercury', type: 0, r: 0.85, orbit: 11, period: 36, phase: 200, spin: 0.05, link: 'Mercury', halo: [0.7, 0.85, 1.0], seed: 1.3 },
  { id: 'Venus', type: 1, r: 1.3, orbit: 15.5, period: 58, phase: 320, spin: -0.02, halo: [1, 0.85, 0.55], seed: 2.1 },
  { id: 'Earth', type: 2, r: 1.45, orbit: 20.5, period: 88, phase: 95, spin: 0.22, tilt: 0.41, halo: [0.5, 0.75, 1], seed: 4.7 },
  { id: 'Moon', type: 3, r: 0.6, orbit: 3.4, period: 11, phase: 30, spin: 0.05, parent: 'Earth', link: 'Moon', halo: [0.85, 0.82, 1.0], seed: 3.3 },
  { id: 'Mars', type: 4, r: 1.0, orbit: 26, period: 130, phase: 250, spin: 0.2, tilt: 0.44, halo: [1, 0.65, 0.45], seed: 6.2 },
  { id: 'Jupiter', type: 5, r: 4.2, orbit: 38, period: 260, phase: 40, spin: 0.16, tilt: 0.05, link: 'Jupiter', halo: [1, 0.8, 0.6], seed: 0.7 },
  { id: 'Saturn', type: 6, r: 3.6, orbit: 50, period: 400, phase: 300, spin: 0.14, tilt: 0.47, link: 'Saturn', halo: [1, 0.9, 0.62], seed: 5.1 },
  { id: 'Uranus', type: 7, r: 2.1, orbit: 59, period: 560, phase: 150, spin: -0.08, tilt: 1.4, halo: [0.6, 0.9, 1], seed: 8.4 },
  { id: 'Neptune', type: 8, r: 2.0, orbit: 67, period: 700, phase: 20, spin: 0.09, tilt: 0.5, halo: [0.4, 0.6, 1], seed: 9.6 },
];

interface Body {
  spec: BodySpec;
  pivot: Group; // 궤도 위의 위치
  holder: Group; // 자전축 기울기
  mesh: Mesh;
  glow: Mesh;
  angle: number;
  speed: number; // 0~1 공전 속도 배수(마우스를 올리면 0으로)
  hot: number; // 0~1 강조
  hover: boolean;
  anchor?: HTMLAnchorElement;
}

function glowMaterial(color: [number, number, number], falloff: number) {
  return new ShaderMaterial({
    uniforms: { uColor: { value: new Color(...color) }, uIntensity: { value: 1 }, uFalloff: { value: falloff } },
    vertexShader: GLOW_VERT,
    fragmentShader: GLOW_FRAG,
    transparent: true,
    depthWrite: false,
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: OneFactor,
    blendSrcAlpha: ZeroFactor,
    blendDstAlpha: OneFactor,
  });
}

function start() {
  if (!section || !glCanvas) return;

  // ── 별 배경 ──
  let stars: SceneHandle | null = null;
  if (sky) {
    try {
      stars = startScene(sky);
    } catch {
      sky.hidden = true;
    }
  }

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas: glCanvas, alpha: true, antialias: true });
  } catch {
    section.classList.add('no-gl');
    return;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small.matches ? 1 : 1.5));

  const scene = new Scene();
  const camera = new PerspectiveCamera(36, 1, 1, 2000);

  const bodies = new Map<string, Body>();
  const world = new Group();
  scene.add(world);

  // ── 궤도선 ──
  const orbitLines = new Map<string, Line>();
  const makeOrbit = (radius: number, parent: Group, id: string, op: number) => {
    const pts: number[] = [];
    const N = 256;
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      pts.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3));
    const m = new LineBasicMaterial({ color: 0xd8d2c4, transparent: true, opacity: op, depthWrite: false });
    const line = new Line(g, m);
    parent.add(line);
    orbitLines.set(id, line);
    return line;
  };

  // ── 태양 ──
  const sunGeo = new SphereGeometry(5.5, 96, 64);
  const sunMat = new ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: PLANET_VERT, fragmentShader: SUN_FRAG });
  const sun = new Mesh(sunGeo, sunMat);
  world.add(sun);
  const coronas: Mesh[] = [];
  ([
    [2.1, [1, 0.62, 0.22], 2.2, 0.9],
    [3.4, [1, 0.5, 0.15], 2.6, 0.5],
    [6.5, [1, 0.45, 0.12], 3.2, 0.32],
    [12, [1, 0.4, 0.1], 4.0, 0.18],
  ] as [number, [number, number, number], number, number][]).forEach(([scale, color, fall, inten]) => {
    const m = new Mesh(new PlaneGeometry(1, 1), glowMaterial(color, fall));
    (m.material as ShaderMaterial).uniforms.uIntensity.value = inten;
    m.scale.setScalar(5.5 * 2 * scale);
    m.userData.k = scale;
    m.renderOrder = 5;
    world.add(m);
    coronas.push(m);
  });

  // ── 행성 ──
  const planetGeo = new SphereGeometry(1, 96, 64);
  let ringMat: ShaderMaterial | null = null;
  let ringMesh: Mesh | null = null;
  for (const spec of SPECS) {
    const parentBody = spec.parent ? bodies.get(spec.parent) : undefined;
    const pivot = new Group();
    (parentBody ? parentBody.pivot : world).add(pivot);
    makeOrbit(spec.orbit, parentBody ? parentBody.pivot : world, spec.id, parentBody ? 0.1 : 0.15);
    const holder = new Group();
    holder.rotation.z = spec.tilt ?? 0;
    pivot.add(holder);
    const mat = new ShaderMaterial({
      uniforms: {
        uType: { value: spec.type },
        uTime: { value: 0 },
        uSeed: { value: spec.seed },
        uRingCenter: { value: new Vector3() },
        uRingNormal: { value: new Vector3(0, 1, 0) },
        uRingRange: { value: new Vector2(0, 0) },
      },
      vertexShader: PLANET_VERT,
      fragmentShader: PLANET_FRAG,
    });
    const mesh = new Mesh(planetGeo, mat);
    mesh.scale.setScalar(spec.r);
    holder.add(mesh);
    const glow = new Mesh(new PlaneGeometry(1, 1), glowMaterial(spec.halo, 2.0));
    glow.renderOrder = 6;
    (glow.material as ShaderMaterial).uniforms.uIntensity.value = 0;
    glow.scale.setScalar(spec.r * 2 * 3.2);
    scene.add(glow);
    const body: Body = { spec, pivot, holder, mesh, glow, angle: (spec.phase * Math.PI) / 180, speed: 1, hot: 0, hover: false };
    bodies.set(spec.id, body);

    if (spec.id === 'Saturn') {
      const inner = spec.r * 1.25;
      const outer = spec.r * 2.35;
      ringMat = new ShaderMaterial({
        uniforms: {
          uCenter: { value: new Vector3() },
          uPlanetR: { value: spec.r },
          uNormal: { value: new Vector3(0, 1, 0) },
          uRange: { value: new Vector2(inner, outer) },
          uSeed: { value: spec.seed },
        },
        vertexShader: RING_VERT,
        fragmentShader: RING_FRAG,
        transparent: true,
        side: DoubleSide,
        depthWrite: false,
      });
      ringMesh = new Mesh(new RingGeometry(inner, outer, 160, 2), ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      holder.add(ringMesh);
      mat.uniforms.uRingRange.value.set(inner, outer);
    }
  }

  // ── 소행성대(화성과 목성 사이) ──
  {
    const N = 1800;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 30.2 + Math.random() * 3.6 + (Math.random() - 0.5) * 0.8;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    const belt = new Points(g, new PointsMaterial({ color: 0xb9b2a4, size: 0.18, sizeAttenuation: true, transparent: true, opacity: 0.8, depthWrite: false, blending: AdditiveBlending }));
    world.add(belt);
    scene.userData.belt = belt;
  }

  // ── DOM 링크를 3D 천체에 붙인다 ──
  const anchors = [...section.querySelectorAll<HTMLAnchorElement>('a.pl')];
  for (const a of anchors) {
    const b = [...bodies.values()].find((x) => x.spec.link === a.dataset.body);
    if (!b) continue;
    b.anchor = a;
    const on = () => {
      b.hover = true;
      a.dataset.hot = '';
    };
    const off = () => {
      b.hover = false;
      delete a.dataset.hot;
    };
    a.addEventListener('pointerenter', on);
    a.addEventListener('pointerleave', off);
    a.addEventListener('focus', on);
    a.addEventListener('blur', off);
  }

  // ── 카메라 ──
  const fovTan = Math.tan((camera.fov * Math.PI) / 360);
  let width = 1;
  let height = 1;
  let dist = 100;
  let elev = 0.46;
  const fit = () => {
    const w = section.clientWidth;
    const h = section.clientHeight;
    width = w;
    height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const portrait = w < h;
    elev = portrait ? 0.98 : 0.44;
    const R = portrait ? 38 : 68;
    dist = Math.max(R / (fovTan * camera.aspect), (R * Math.sin(elev) + 8) / fovTan) * 1.02;
  };
  fit();
  addEventListener('resize', fit);

  let mx = 0;
  let my = 0;
  let pmx = 0;
  let pmy = 0;
  let swayCur = 0;
  addEventListener('pointermove', (e) => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
  });

  // 다가가기(누르면): 카메라가 그 천체 쪽으로 간다
  let dive: { body: Body; t0: number; href: string } | null = null;
  const reduceNav = reduce;
  for (const a of anchors) {
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || reduceNav || dive) return;
      const b = [...bodies.values()].find((x) => x.anchor === a);
      if (!b) return;
      e.preventDefault();
      dive = { body: b, t0: performance.now(), href: a.href };
      section.classList.add('is-leaving');
    });
  }

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const tmp = new Vector3();
  const tmp2 = new Vector3();
  const lookAt = new Vector3();
  const camPos = new Vector3();
  const t0 = performance.now();
  let last = t0;
  let clock = 0;
  const INTRO_MS = reduce ? 1 : 2800;
  requestAnimationFrame(() => section.classList.add('is-ready'));

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += dt;

    // 공전·자전
    for (const b of bodies.values()) {
      const target = b.hover || dive?.body === b ? 0 : 1;
      b.speed += (target - b.speed) * (1 - Math.exp(-dt * 6));
      if (!reduce) b.angle += ((Math.PI * 2) / b.spec.period) * dt * b.speed;
      b.pivot.position.set(Math.cos(b.angle) * b.spec.orbit, b.spec.id === 'Moon' ? Math.sin(b.angle) * b.spec.orbit * 0.22 : 0, Math.sin(b.angle) * b.spec.orbit * (b.spec.id === 'Moon' ? 0.97 : 1));
      if (!reduce) b.mesh.rotation.y += b.spec.spin * dt * (0.4 + 0.6 * b.speed);
      const u = (b.mesh.material as ShaderMaterial).uniforms;
      u.uTime.value = clock;
      b.hot += ((b.hover || dive?.body === b ? 1 : 0) - b.hot) * (1 - Math.exp(-dt * 7));
      const ol = orbitLines.get(b.spec.id);
      if (ol) (ol.material as LineBasicMaterial).opacity = (b.spec.parent ? 0.1 : 0.15) + 0.35 * b.hot;
    }
    (sun.material as ShaderMaterial).uniforms.uTime.value = clock;
    sun.rotation.y += 0.02 * dt;
    const pulse = 1 + 0.03 * Math.sin(clock * 0.7);
    coronas.forEach((c, i) => (c.userData.s = pulse * (1 + 0.015 * Math.sin(clock * (0.5 + i * 0.23)))));

    // 토성 고리: 행성과 같은 기울기, 그림자 계산용 월드 값
    const sat = bodies.get('Saturn');
    if (sat && ringMesh && ringMat) {
      sat.holder.updateWorldMatrix(true, false);
      sat.mesh.getWorldPosition(tmp);
      tmp2.set(0, 1, 0).transformDirection(sat.holder.matrixWorld).normalize();
      ringMat.uniforms.uCenter.value.copy(tmp);
      ringMat.uniforms.uNormal.value.copy(tmp2);
      const pu = (sat.mesh.material as ShaderMaterial).uniforms;
      pu.uRingCenter.value.copy(tmp);
      pu.uRingNormal.value.copy(tmp2);
    }

    // 카메라: 처음엔 멀리서 들어오고, 평소엔 천천히 흔들리며 마우스에 약간 따라간다
    const introT = Math.min(1, (now - t0) / INTRO_MS);
    const ie = easeOut(introT);
    // 천체에 마우스를 올린 동안은 카메라도 가만히 둔다(누르려는 천체가 도망가지 않게)
    let anyHover = false;
    for (const b of bodies.values()) if (b.hover) anyHover = true;
    if (!anyHover && !dive) {
      pmx += (mx - pmx) * (1 - Math.exp(-dt * 2.2));
      pmy += (my - pmy) * (1 - Math.exp(-dt * 2.2));
      swayCur += ((reduce ? 0 : Math.sin(clock * 0.07) * 0.1) - swayCur) * (1 - Math.exp(-dt * 3));
    }
    const sway = swayCur;
    const yaw = (1 - ie) * 0.9 + sway + pmx * 0.16;
    const el = elev + (1 - ie) * 0.5 - pmy * 0.05;
    const d = dist * (1 + (1 - ie) * 0.65);
    camPos.set(Math.sin(yaw) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(yaw) * Math.cos(el) * d);
    lookAt.set(0, 0, 0);
    if (dive) {
      const k = ease(Math.min(1, (now - dive.t0) / 950));
      dive.body.mesh.getWorldPosition(tmp);
      const away = tmp2.copy(camPos).sub(tmp).normalize();
      const near = tmp.clone().addScaledVector(away, dive.body.spec.r * 5.2);
      camPos.lerp(near, k);
      lookAt.lerp(tmp, k);
      if (k >= 1) {
        const href = dive.href;
        dive = null;
        location.href = href;
      }
    }
    camera.position.copy(camPos);
    camera.lookAt(lookAt);
    camera.updateMatrixWorld();

    // 후광과 코로나는 늘 카메라를 본다
    for (const b of bodies.values()) {
      b.mesh.getWorldPosition(tmp);
      const toCam = tmp2.copy(camera.position).sub(tmp).normalize();
      b.glow.position.copy(tmp).addScaledVector(toCam, -b.spec.r * 0.9);
      b.glow.quaternion.copy(camera.quaternion);
      const gm = b.glow.material as ShaderMaterial;
      const idle = b.spec.link ? 0.16 + 0.05 * Math.sin(clock * 1.6 + b.spec.seed) : 0;
      gm.uniforms.uIntensity.value = idle + b.hot * 1.05;
      b.glow.scale.setScalar(b.spec.r * 2 * (3.0 + b.hot * 0.9));
    }
    coronas.forEach((c) => {
      c.position.set(0, 0, 0);
      c.quaternion.copy(camera.quaternion);
      c.scale.setScalar(5.5 * 2 * c.userData.k * (c.userData.s ?? 1));
    });

    renderer.render(scene, camera);

    // 별 배경(어긋나며 깊이감)
    stars?.update(0.12, 0, dt, clock, 1);
    if (sky) sky.style.transform = `translate(${(-pmx * 14 - yaw * 30).toFixed(1)}px, ${(-pmy * 8).toFixed(1)}px) scale(1.06)`;

    // DOM 링크를 3D 위치에 맞춘다
    for (const b of bodies.values()) {
      if (!b.anchor) continue;
      b.mesh.getWorldPosition(tmp);
      const dcam = tmp.distanceTo(camera.position);
      const rpx = (b.spec.r / (dcam * fovTan)) * (height / 2);
      tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * width;
      const y = (-tmp.y * 0.5 + 0.5) * height;
      const dd = Math.max(44, rpx * 2 + 10);
      b.anchor.style.setProperty('--d', `${dd.toFixed(1)}px`);
      b.anchor.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      b.anchor.style.setProperty('--r', `${rpx.toFixed(1)}px`);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

start();
