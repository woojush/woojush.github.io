// 메인(/)의 인트로를 한 시계로 움직인다: 문구가 점점 커지고, 그 확대 속도에 맞춰 별이 날아오고,
// 작은 문장이 다 나타나고 1.3초 뒤에는 별들의 중심을 향한 블랙홀식 마지막 확대(4초)가 시작되어 화면이 어둠 속으로 사라진다.
// 끝나면 같은 페이지의 홈 화면(.home)이 나타난다(<html data-intro="done">). 다른 페이지로 이동하지 않는다.
// 곡선은 intro-timeline.ts, 별 그리기는 scene.ts. 여기서는 시계·문구(CSS 변수)·상태 전환만 맡는다.
//
// 인트로를 할지는 HomeHero.astro의 인라인 스크립트가 첫 페인트 전에 정해 <html data-intro="play">를 붙인다
// (움직임 줄이기 / 뒤로 가기 / 사이트 안에서 온 경우에는 붙지 않고 홈 화면이 바로 보인다).
import { startScene, type SceneHandle } from '@/scripts/scene';
import { T_END, flySpeed, introFrame } from '@/scripts/intro-timeline';

const root = document.documentElement;
const hero = document.querySelector<HTMLElement>('[data-hero]');
const inner = hero?.querySelector<HTMLElement>('[data-hero-inner]');
const canvas = document.querySelector<HTMLCanvasElement>('[data-scene]');
const hole = document.querySelector<HTMLElement>('[data-blackhole]');

if (root.dataset.intro === 'play' && hero && inner) {
  root.dataset.introStarted = ''; // 인라인 스크립트의 안전장치(스크립트가 안 뜨면 홈 화면을 보여준다)에 알린다

  let scene: SceneHandle | null = null;
  if (canvas) {
    try {
      scene = startScene(canvas);
    } catch {
      canvas.hidden = true; // WebGL을 못 쓰면 별 없이 문구만 보인다
    }
  }

  let clock = 0;
  let last = 0;
  let raf = 0;

  function finish(): void {
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', play);
    removeEventListener('pointerdown', skip);
    removeEventListener('keydown', skipKey);
    root.dataset.intro = 'done'; // 인트로 층은 CSS가 숨기고 홈 화면이 나타난다
    scrollTo(0, 0);
  }

  // 지켜보기 싫은 사람을 위해: 화면을 누르거나 Enter·Space·Esc를 누르면 바로 홈 화면으로 (헤더의 링크는 그대로 동작)
  function skip(e: Event): void {
    if ((e.target as Element | null)?.closest?.('.site-header')) return;
    finish();
  }
  function skipKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip(e);
  }

  function frame(now: number): void {
    // 시계는 실제 시간을 따른다(느린 기기에서 프레임이 줄어도 3초는 3초다). 탭을 오래 떠났다 와도 한 번에 튀지 않게 0.5초로 자른다
    const elapsed = Math.min((now - last) / 1000 || 0, 0.5);
    last = now;
    clock += elapsed;
    const f = introFrame(clock);
    inner!.style.setProperty('--zoom', f.scale.toFixed(4));
    hero!.style.setProperty('--hero-fade', f.fade.toFixed(3));
    hole?.style.setProperty('--blackhole', f.blackhole.toFixed(3));
    scene?.update(flySpeed(f.rate), f.boost, Math.min(elapsed, 0.1), clock, f.stars);
    if (clock >= T_END) {
      finish();
      return;
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
  addEventListener('pointerdown', skip);
  addEventListener('keydown', skipKey);
  play();
}
