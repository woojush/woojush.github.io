// 홈의 별 세계 층(별 캔버스·흰 세계)과 요약정리 화면을 인트로(home-intro.ts)와 탈출(home-exit.ts)이 같이 쓰는 도구.
// DOM 요소와 별 장면을 한 곳에서 잡아 두고, 흰 세계의 크기·요약정리 화면의 나타남·바탕색(흰/어두움)을 바꾸는 함수만 둔다.
// 시간표(곡선)는 intro-timeline.ts, 별 그리기는 scene.ts.
import { startScene, type SceneHandle } from '@/scripts/scene';

export const root = document.documentElement;
const pick = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector);

export const hero = pick('[data-hero]');
export const inner = hero?.querySelector<HTMLElement>('[data-hero-inner]') ?? null;
export const canvas = pick<HTMLCanvasElement>('[data-scene]');
const disc = pick('[data-world-disc]'); // 가운데에서 커지는 흰 세계 (HomeHero.astro)
const home = pick('[data-home]'); // 요약정리 화면 (index.astro)
const footer = pick('.site-footer');
const main = pick('#main');

/** 장면 시계(초). 인트로와 탈출이 이어서 쓴다(별의 반짝임·회전이 끊기지 않게) */
export const clock = { t: 0 };

let scene: SceneHandle | null | undefined;

/**
 * 별 장면을 한 번만 만들어 돌려준다. WebGL을 못 쓰면 null(별 없이 흰 세계와 문구만 보인다).
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

/** 흰 세계의 크기(0~1). 반지름은 CSS가 world × 170%(화면 모서리까지 거리 기준)로 그린다 */
export function setWorld(world: number): void {
  disc?.style.setProperty('--world', world.toFixed(4));
}

/** 요약정리 화면(과 푸터)이 나타난 정도(0~1). 흰 세계가 덮는 만큼 나타나고 살짝 커진다 (index.astro의 CSS가 읽는다) */
export function setHome(amount: number): void {
  const v = amount.toFixed(3);
  home?.style.setProperty('--home-p', v);
  footer?.style.setProperty('--home-p', v);
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

/** 푸터가 페이지 바탕과 따로 흰 세계 색을 유지하게 한다(탈출 중 요약정리와 함께 사라져야 하므로) */
export function keepFooterLight(on: boolean): void {
  if (on) footer?.setAttribute('data-world', 'light');
  else footer?.removeAttribute('data-world');
}
