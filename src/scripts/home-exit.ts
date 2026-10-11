// 홈의 요약정리(흰 세계)에서 Knowledge로 나갈 때: 블랙홀을 벗어나는 효과(약 1.6초) 뒤에 이동한다.
// 흰 세계가 가운데 한 점으로 줄어들고 요약정리 화면이 그 안으로 말려 들어가며, 별은 반대 방향으로 날다(가운데로 모여들며 줄로 늘어난다)
// 점점 잦아들어 Knowledge의 평소 별과 같은 속도로 이어진다. 곡선은 intro-timeline.ts의 exitFrame, 공용 도구는 home-world.ts.
//
// 효과는 요약정리가 자리 잡은 뒤에만 쓴다. 인트로가 도는 중(블랙홀에 빨려 드는 동안)이거나 흰 세계가 아니면 아무것도 하지 않고
// 브라우저가 평소처럼 페이지를 바꾼다(크로스페이드). 움직임 줄이기도 평소 이동이다. 다른 곳으로 가는 링크·새 탭·수정 키 클릭도 그대로 둔다.
// 새 페이지(topic-stage.ts)는 sessionStorage의 world-exit 표시를 읽어 별이 이미 보이는 채로 시작하고 태그가 피어난다.
import { EXIT_SECONDS, WORLD_COVERED, exitFrame } from '@/scripts/intro-timeline';
import { aimHome, canvas, clock, getScene, keepFooterLight, root, setHome, setLight, setWorld } from '@/scripts/home-world';

/**
 * 흰 세계에서 이 주소로 나갈 때 탈출 효과를 쓴다(정확히 일치할 때). 효과가 별 장면으로 끝나므로 이어받는 쪽(별 장면이 있는 페이지)이 있어야 한다.
 * 다른 어두운 페이지(about, writing 등)에도 쓰려면 여기에 추가한다. Recent 목록의 Knowledge 글(/knowledge/<slug>/)은 평소 이동이다.
 */
const EXIT_TO = ['/knowledge/'];
const FLAG = 'world-exit'; // 새 페이지가 이어받을 표시(시각). topic-stage.ts가 읽는다
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const nav = document.querySelector<HTMLElement>('.nav');

let exiting = false;
let raf = 0;
let timer = 0;

// 탭 바에 마우스가 올라가면(누르기 전에) 별 장면을 미리 만들어 둔다: 누르는 순간 WebGL을 만드느라 첫 프레임이 끊기지 않게
function prewarm(): void {
  if (root.dataset.intro !== 'play') getScene();
}
nav?.addEventListener('pointerenter', prewarm, { once: true });
nav?.addEventListener('focusin', prewarm, { once: true });

function leavesToDark(a: HTMLAnchorElement): boolean {
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download')) return false;
  const url = new URL(a.href, location.href);
  return url.origin === location.origin && EXIT_TO.includes(url.pathname);
}

document.addEventListener('click', (e) => {
  if (exiting || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (reduce.matches || root.dataset.intro === 'play' || root.dataset.world !== 'light') return; // 인트로가 안 끝났거나 흰 세계가 아니면 평소 이동
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!a || !leavesToDark(a)) return;
  e.preventDefault();
  exit(a.href);
});

function go(href: string): void {
  cancelAnimationFrame(raf);
  window.clearTimeout(timer);
  try {
    // 탭 바가 벌어진 채 누른 표시(nav.ts)는 효과가 길어서 그 사이 마우스가 떠났으면 지운다(새 페이지에서 벌어졌다 줄어들지 않게)
    if (!nav?.matches(':hover')) sessionStorage.removeItem('nav-open');
  } catch {
    // 저장소를 못 쓰면 표시 없이 이동한다
  }
  location.href = href;
}

function exit(href: string): void {
  exiting = true;
  try {
    sessionStorage.setItem(FLAG, String(Date.now()));
  } catch {
    // 저장소를 못 쓰면 새 페이지가 평소대로 시작한다
  }
  const hint = document.createElement('link'); // 새 페이지를 미리 받아 둔다(효과가 끝나기 전에 도착하게)
  hint.rel = 'prefetch';
  hint.href = href;
  document.head.append(hint);

  // 확대의 기준점은 층이 켜지기 전, 변형이 없을 때 잰다. 요약정리 화면은 처음엔 그대로 보이고(1), 흰 세계가 막 화면을 덮은 크기에서 줄기 시작한다
  aimHome();
  setWorld(WORLD_COVERED);
  setHome(1);
  keepFooterLight(true);
  setLight(false); // 흰 세계가 줄면 바깥은 어두운 세계다(.home은 스스로 흰 세계 색을 가져 그대로)
  root.dataset.intro = 'exit'; // 별·흰 세계 층이 보이고 스크롤이 잠긴다
  void canvas?.offsetWidth; // 층이 보이게 된 뒤의 크기를 반영한다
  const scene = getScene();
  scene?.resize();
  scene?.skipFade(); // 흰 세계에 가려져 있다가 드러나므로 페이드 없이 바로 보인다
  scene?.setFx(0);

  let t = 0;
  let last = performance.now();
  function frame(now: number): void {
    const dt = Math.min((now - last) / 1000 || 0, 0.1);
    last = now;
    t += dt;
    clock.t += dt;
    const f = exitFrame(t);
    setWorld(f.world);
    setHome(f.home);
    scene?.update(f.speed, f.boost, dt, clock.t, 1);
    if (f.done) {
      go(href);
      return;
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  // 화면이 멈추는 경우(백그라운드 탭, 그래픽 문제)에도 이동은 한다
  timer = window.setTimeout(() => go(href), (EXIT_SECONDS + 1.5) * 1000);
}

// 뒤로 가기로 돌아왔을 때(bfcache) 효과가 끝난 모습으로 남아 있지 않게 요약정리 화면으로 되돌린다
addEventListener('pageshow', (e) => {
  if (!e.persisted || !exiting) return;
  exiting = false;
  cancelAnimationFrame(raf);
  window.clearTimeout(timer);
  delete root.dataset.intro;
  keepFooterLight(false);
  setLight(true);
  setWorld(0);
  setHome(1);
});
