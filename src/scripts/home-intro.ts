// 메인(/)의 인트로를 한 시계로 움직인다: 문구가 점점 커지고, 그 확대 속도에 맞춰 별이 날아오고,
// 작은 문장이 다 나타나고 1.3초 뒤에는 별들의 중심을 향한 블랙홀식 마지막 확대(4초)가 시작된다.
// 그 끝에서 하얀 빛이 구름처럼 번져 화면을 덮고, 요약정리 화면이 그 안에서 나타나 자리 잡는다(<html data-intro="done">).
// 다른 페이지로 이동하지 않는다. 곡선은 intro-timeline.ts, 별 그리기는 scene.ts, 공용 도구는 home-world.ts.
// 여기서는 시계·문구(CSS 변수)·상태 전환만 맡는다.
//
// 인트로를 할지는 index.astro의 <head> 인라인 스크립트가 첫 페인트 전에 정해 <html data-intro="play">를 붙인다
// (브라우저 세션에서 처음 들어왔을 때만 붙는다. 사이트 안에서 홈으로 돌아오거나 새로고침하거나 움직임 줄이기면 붙지 않고 요약정리 화면이 바로 보인다).
// 인트로는 어두운 세계에서 시작하므로 그 스크립트가 data-world(흰 세계)를 떼고, 흰 세계가 화면을 덮는 순간 여기서 다시 켠다.
import { T_END, flySpeed, introFrame } from '@/scripts/intro-timeline';
import { aimHome, clock, getScene, hero, inner, resizeVeil, root, setHome, setLight, setWorld } from '@/scripts/home-world';

if (root.dataset.intro === 'play' && hero && inner) {
  root.dataset.introStarted = ''; // 인라인 스크립트의 안전장치(스크립트가 안 뜨면 요약정리 화면을 보여준다)에 알린다

  const scene = getScene();
  resizeVeil(); // 캔버스가 보이는 상태(play)에서 크기를 잡는다
  addEventListener('resize', resizeVeil);
  aimHome();

  const FAST_FORWARD = 6; // 건너뛰기를 누르면 남은 인트로를 이 배속으로 빨리 감는다
  let speed = 1;
  let last = 0;
  let raf = 0;
  let lit = false; // 흰 세계가 화면을 덮어 바탕을 흰색으로 바꿨는가

  function finish(): void {
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', play);
    removeEventListener('pointerdown', skip);
    removeEventListener('keydown', skipKey);
    removeEventListener('resize', resizeVeil);
    setLight(true);
    setWorld(0); // 인트로 층은 곧 숨겨진다(흰 바탕은 페이지 자체가 이어받는다)
    setHome(1);
    root.dataset.intro = 'done'; // 인트로 층은 CSS가 숨기고 요약정리 화면이 자리 잡는다
    scrollTo(0, 0);
  }

  // 지켜보기 싫은 사람을 위해: 화면을 누르거나 Enter·Space·Esc를 누르면 남은 인트로를 빨리 감아 같은 장면으로 끝낸다(갑자기 흰 화면이 번쩍이지 않게).
  // 이미 빨리 감는 중이거나 마지막 확대가 끝났으면 한 번 더 눌러 바로 요약정리 화면으로 간다 (헤더의 링크는 그대로 동작)
  function skip(e: Event): void {
    if ((e.target as Element | null)?.closest?.('.site-header')) return;
    if (speed > 1 || clock.t >= T_END) finish();
    else speed = FAST_FORWARD;
  }
  function skipKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip(e);
  }

  function frame(now: number): void {
    // 시계는 실제 시간을 따른다(느린 기기에서 프레임이 줄어도 3초는 3초다). 탭을 오래 떠났다 와도 한 번에 튀지 않게 0.5초로 자른다
    const dt = Math.min((now - last) / 1000 || 0, 0.5) * speed;
    last = now;
    clock.t += dt;
    const f = introFrame(clock.t);
    inner!.style.setProperty('--zoom', f.scale.toFixed(4));
    hero!.style.setProperty('--hero-fade', f.fade.toFixed(3));
    setWorld(f.world);
    setHome(f.home);
    if (f.covered && !lit) {
      lit = true;
      setLight(true); // 흰 세계가 화면을 덮었으니 바탕·헤더가 흰 세계의 색으로 바뀌어도 눈에 띄지 않는다
    }
    scene?.update(flySpeed(f.rate), f.boost, Math.min(dt, 0.1), clock.t, f.stars);
    if (f.done) {
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
