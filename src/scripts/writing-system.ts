// Writing 입구의 별. 별 장면(scene.ts)을 Knowledge·홈과 같이 쓰되 후처리 없이, 천천히 날아오는 속도로만 돌린다.
// WebGL이 없으면 별 없이 행성만 보인다. 움직임 줄이기에서는 한 장면만 그린다(scene.ts가 처리).
import { startScene, type SceneHandle } from '@/scripts/scene';

const sky = document.querySelector<HTMLCanvasElement>('[data-wsky]');
if (sky) {
  let scene: SceneHandle | null = null;
  try {
    scene = startScene(sky);
  } catch {
    sky.hidden = true;
  }
  if (scene && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let last = performance.now();
    let clock = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      scene!.update(0.22, 0, dt, clock, 1);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
