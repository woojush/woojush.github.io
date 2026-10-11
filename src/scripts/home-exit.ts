// 홈의 요약정리(흰 세계)에서 Knowledge로 나갈 때, 홈 쪽의 짧은 첫 막(0.55초): 요약정리가 흰 바탕 위에서 가운데로 가라앉으며 사라진 뒤 이동한다.
// 둘째 막(흰 빛이 걷히며 별이 드러남, 약 3.4초)은 도착한 Knowledge가 돌린다(topic-stage.ts). 이동을 기다리는 시간이 길어지지 않고 흰색에서 흰색으로 이어진다.
// 곡선은 intro-timeline.ts의 exitFrame·arriveFrame, 공용 도구는 home-world.ts.
//
// 효과는 요약정리가 자리 잡은 뒤에만 쓴다. 인트로가 도는 중이거나 흰 세계가 아니면 아무것도 하지 않고 브라우저가 평소처럼 페이지를 바꾼다(크로스페이드).
// 움직임 줄이기도 평소 이동이다. 다른 곳으로 가는 링크·새 탭·수정 키 클릭도 그대로 둔다.
// 새 페이지는 sessionStorage의 world-exit 표시를 <head>의 인라인 스크립트(knowledge/index.astro)가 읽어 흰 화면으로 시작한다.
import { EXIT_SECONDS, exitFrame } from '@/scripts/intro-timeline';
import { aimHome, root, setHome } from '@/scripts/home-world';

/** 이 주소로 나갈 때 효과를 쓴다(정확히 일치). 이어받는 쪽(도착 재생이 있는 페이지)이 있어야 한다. Recent 목록의 Knowledge 글(/knowledge/<slug>/)은 평소 이동이다 */
const EXIT_TO = ['/knowledge/'];
const FLAG = 'world-exit'; // 새 페이지가 이어받을 표시(시각)
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const nav = document.querySelector<HTMLElement>('.nav');

let exiting = false;
let raf = 0;
let timer = 0;

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
    // 탭 바가 벌어진 채 누른 표시(nav.ts): 그 사이 마우스가 떠났으면 지운다(새 페이지에서 벌어졌다 줄어들지 않게)
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
  const hint = document.createElement('link'); // 새 페이지를 미리 받아 둔다
  hint.rel = 'prefetch';
  hint.href = href;
  document.head.append(hint);

  aimHome(); // 가라앉는 기준점은 변형이 없을 때 잰다
  setHome(1);
  root.dataset.intro = 'exit'; // 스크롤을 잠그고 index.astro의 exit 규칙(--home-p)이 켜진다

  let t = 0;
  let last = performance.now();
  function frame(now: number): void {
    t += Math.min((now - last) / 1000, 0.1);
    last = now;
    const f = exitFrame(t);
    setHome(f.home);
    if (f.done) {
      go(href);
      return;
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  // 화면이 멈추는 경우(백그라운드 탭)에도 이동은 한다
  timer = window.setTimeout(() => go(href), (EXIT_SECONDS + 1.5) * 1000);
}

// 뒤로 가기로 돌아왔을 때(bfcache) 효과가 끝난 모습으로 남아 있지 않게 요약정리 화면으로 되돌린다
addEventListener('pageshow', (e) => {
  if (!e.persisted || !exiting) return;
  exiting = false;
  cancelAnimationFrame(raf);
  window.clearTimeout(timer);
  delete root.dataset.intro;
  setHome(1);
});
