// 홈의 별 세계 층(별 캔버스·어둠·흰 바탕)과 요약정리 화면을 인트로(home-intro.ts)와 퇴장(home-exit.ts)이 같이 쓰는 도구.
// DOM 요소와 별 장면을 한 곳에서 잡아 두고, 어둠의 정도·요약정리 화면의 나타남·바탕색(흰/어두움)을 바꾸는 함수만 둔다.
// 시간표(곡선)는 intro-timeline.ts, 별 그리기는 scene.ts.
import { startScene, type SceneHandle } from '@/scripts/scene';

export const root = document.documentElement;
const pick = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector);

export const hero = pick('[data-hero]');
export const inner = hero?.querySelector<HTMLElement>('[data-hero-inner]') ?? null;
export const canvas = pick<HTMLCanvasElement>('[data-scene]');
const hole = pick('[data-hole]'); // 가운데에서 번져 덮는 어둠 (HomeHero.astro)
const paper = pick('[data-paper]'); // 어둠 위로 나타나는 흰 바탕 (HomeHero.astro)
const home = pick('[data-home]'); // 요약정리 화면 (index.astro)
const footer = pick('.site-footer');
const main = pick('#main');
const header = pick('.site-header');

/** 장면 시계(초). 인트로와 탈출이 이어서 쓴다(별의 반짝임·회전이 끊기지 않게) */
export const clock = { t: 0 };

let scene: SceneHandle | null | undefined;

/**
 * 별 장면을 한 번만 만들어 돌려준다. WebGL을 못 쓰면 null(별 없이 문구만 보인다).
 * 캔버스가 숨겨져 있는 동안 만들어도 되지만(크기는 0), 보여줄 때 scene.resize()를 불러야 한다.
 */
export function getScene(): SceneHandle | null {
  if (scene !== undefined) return scene;
  scene = null;
  if (canvas) {
    try {
      scene = startScene(canvas);
    } catch {
      canvas.hidden = true;
    }
  }
  return scene;
}

/** 어둠이 번진 정도(0~1). 1이면 화면 전체가 어둡다 (HomeHero.astro의 CSS가 --hole을 읽는다) */
export function setHole(level: number): void {
  hole?.style.setProperty('--hole', level.toFixed(3));
}

/** 요약정리 화면(과 푸터, 흰 바탕)이 나타난 정도(0~1). 어두운 화면에서 천천히 나타나고 살짝 커진다 (index.astro의 CSS가 읽는다) */
export function setHome(amount: number): void {
  const v = amount.toFixed(3);
  home?.style.setProperty('--home-p', v);
  footer?.style.setProperty('--home-p', v);
  paper?.style.setProperty('--home-p', v);
  // 헤더·푸터는 흰 바탕이 어느 정도 나타나면(절반쯤) 스스로 흰 세계의 색을 쓴다(밝은 글자가 흰 바탕에서 사라지지 않게). 페이지 바탕(<html>)은 끝에 한 번에 바꾼다
  const light = amount >= 0.45;
  for (const el of [header, footer]) {
    if (!el) continue;
    if (light) el.dataset.world = 'light';
    else delete el.dataset.world;
  }
}

/**
 * 요약정리 화면이 커지고 작아질 때의 기준점을 화면 가운데로 맞춘다.
 * 화면 가운데의 높이를 .home 안의 좌표로 바꾼다. main은 변형이 없으므로 .home의 변형과 무관하게 잴 수 있다.
 */
export function aimHome(): void {
  if (!home || !main) return;
  const top = main.getBoundingClientRect().top + parseFloat(getComputedStyle(main).paddingTop || '0');
  home.style.setProperty('--home-oy', `${innerHeight / 2 - top}px`);
}

/** 페이지 바탕·헤더를 흰 세계(true) 또는 어두운 세계(false)의 색으로 바꾼다. .home은 스스로 흰 세계 색을 가진다 */
export function setLight(on: boolean): void {
  if (on) root.dataset.world = 'light';
  else delete root.dataset.world;
}
