// 메인(/)의 인트로를 한 시계로 움직인다: 문구가 점점 커지고, 그 확대 속도에 맞춰 별이 날아오고,
// 작은 문장이 3초 커진 뒤에는 확대가 최대로 빨라지며 다음 화면(data-next)으로 넘어간다.
// 곡선은 intro-timeline.ts, 별 그리기는 scene.ts. 여기서는 시계·문구(CSS 변수)·화면 이동만 맡는다.
import { startScene, type SceneHandle } from '@/scripts/scene';
import { T_CLIMAX, flySpeed, introFrame } from '@/scripts/intro-timeline';

const hero = document.querySelector<HTMLElement>('[data-hero]');
const inner = hero?.querySelector<HTMLElement>('[data-hero-inner]');
const canvas = document.querySelector<HTMLCanvasElement>('[data-scene]');
const next = hero?.dataset.next;

let scene: SceneHandle | null = null;
if (canvas) {
  try {
    scene = startScene(canvas);
  } catch {
    canvas.hidden = true; // WebGL을 못 쓰면 배경 없이 문구만 보인다
  }
}

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
if (hero && inner && next && !reduce.matches) {
  // 뒤로/앞으로 가기로 온 경우에는 자동으로 넘기지 않는다 (뒤로 가기가 다시 앞으로 보내는 일을 막는다)
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  let advance = entry?.type !== 'back_forward';
  let clock = 0;
  let last = 0;
  let raf = 0;
  let leaving = false;

  if (advance) {
    // 넘어갈 화면을 미리 받아 두어 전환 때 기다리지 않게 한다
    const prefetch = document.createElement('link');
    prefetch.rel = 'prefetch';
    prefetch.href = next;
    document.head.append(prefetch);
  }

  // 자동으로 넘어갈 때만 "확대해 들어가는" 전환을 쓴다 (base.css의 home-zoom). 미지원 브라우저는 그냥 크로스페이드
  addEventListener('pageswap', (e) => {
    const types = (e as Event & { viewTransition?: { types?: Set<string> } }).viewTransition?.types;
    if (leaving) types?.add('home-zoom');
  });

  function frame(now: number): void {
    // 시계는 실제 시간을 따른다(느린 기기에서 프레임이 줄어도 3초는 3초다). 탭을 오래 떠났다 와도 한 번에 튀지 않게 0.5초로 자른다
    const elapsed = Math.min((now - last) / 1000 || 0, 0.5);
    last = now;
    clock += elapsed;
    const f = introFrame(clock, !advance);
    inner!.style.setProperty('--zoom', f.scale.toFixed(4));
    hero!.style.setProperty('--hero-fade', f.fade.toFixed(3));
    scene?.update(flySpeed(f.rate), f.climax, Math.min(elapsed, 0.1), clock);
    if (f.done && advance && !leaving) {
      leaving = true;
      location.assign(next!);
    }
    raf = requestAnimationFrame(frame);
  }

  function play(): void {
    cancelAnimationFrame(raf);
    if (document.hidden) return; // 탭이 숨겨지면 시계도 멈춘다
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  document.addEventListener('visibilitychange', play);
  // 뒤로 가기로 캐시된 화면이 그대로 돌아온 경우: 마지막 확대 직전에서 멈춘 채 둔다 (다시 넘어가지 않는다)
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    advance = false;
    leaving = false;
    clock = T_CLIMAX;
    play();
  });

  play();
}
