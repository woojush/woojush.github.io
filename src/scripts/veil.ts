// 흰 빛(veil): 화면을 덮는 하얀 빛이 구름처럼 번지고 걷히는 층. 홈 인트로의 끝(번져 덮음)과 Knowledge 도착(걷힘)이 같이 쓴다.
// 원이 커지고 줄어드는 기하학적 모양이 아니라, 느리게 흐르는 노이즈가 문턱을 넘는 곳부터 하얘지고(걷힐 때는 그 반대로 사라지고) 가장자리가 부드럽게 풀린다.
// WebGL을 쓰지 않는다: 아주 작은 해상도(칸 6px)의 2D 캔버스에 알파만 그려 CSS로 늘린다(부드럽게 보간되어 흐린 가장자리가 된다). 별 장면과 별개라 어느 쪽이 실패해도 서로 영향이 없다.
// 시간표(level 곡선)는 intro-timeline.ts, 여기서는 level(0~1)을 그리기만 한다.

const CELL = 6; // 캔버스 한 칸이 화면에서 차지하는 px
const SOFT = 0.32; // 가장자리가 풀리는 폭(클수록 더 안개 같다. 너무 크면 어두운 별 위에서 탁한 회색 띠가 된다)

// 값 노이즈(해시 격자 + 부드러운 보간). 외부 의존성 없음
function hash(ix: number, iy: number): number {
  let h = (ix * 374761393 + iy * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function noise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

export interface Veil {
  /**
   * level: 0(없음)~1(화면 전체가 흰색). time: 노이즈가 흐르는 시계(초).
   * 시작·끝의 빈/찬 상태는 그리지 않고 CSS만 바꾼다(비용 0).
   */
  set(level: number, time: number): void;
  /** 화면 크기가 바뀌었거나 캔버스가 막 보이게 되었을 때 */
  resize(): void;
}

/**
 * @param center 'first'면 가운데에서 먼저 하얘지고(번져 덮기) 'last'면 가운데가 가장 늦게 하얘진다(= 걷힐 때 가운데부터 열린다)
 */
export function createVeil(canvas: HTMLCanvasElement, center: 'first' | 'last'): Veil {
  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0;
  let h = 0;
  let img: ImageData | null = null;
  let radial: Float32Array | null = null; // 칸마다 가운데에서의 거리(0~1)
  let shownLevel = -1;

  function resize(): void {
    w = Math.max(2, Math.ceil(innerWidth / CELL));
    h = Math.max(2, Math.ceil(innerHeight / CELL));
    canvas.width = w;
    canvas.height = h;
    img = ctx ? ctx.createImageData(w, h) : null;
    radial = new Float32Array(w * h);
    const cx = (w - 1) / 2;
    const cy = (h - 1) / 2;
    const max = Math.hypot(cx, cy);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) radial[y * w + x] = Math.hypot(x - cx, y - cy) / max;
    shownLevel = -1;
  }

  function set(level: number, time: number): void {
    const l = Math.min(1, Math.max(0, level));
    if (l <= 0) {
      if (shownLevel !== 0) {
        canvas.style.opacity = '0';
        canvas.style.backgroundColor = 'transparent'; // CSS의 첫 페인트용 흰 바탕(topic-space.css)을 덮어쓴다
        ctx?.clearRect(0, 0, w, h);
        shownLevel = 0;
      }
      return;
    }
    if (l >= 1) {
      if (shownLevel !== 1) {
        canvas.style.opacity = '1';
        canvas.style.backgroundColor = 'var(--paper, #fff)'; // 통째로 흰색(노이즈를 계산하지 않는다)
        shownLevel = 1;
      }
      return;
    }
    if (!ctx || !img || !radial) return;
    if (shownLevel !== 2) {
      canvas.style.opacity = '1';
      canvas.style.backgroundColor = 'transparent'; // CSS의 첫 페인트용 흰 바탕(topic-space.css)을 덮어쓴다
      shownLevel = 2;
    }
    const data = img.data;
    const t = time * 0.06; // 노이즈가 천천히 흐른다
    const scale = 2.4 / Math.max(w, h); // 가장 큰 덩어리가 화면 폭의 절반쯤
    const thr = l * (1 + SOFT);
    const radialSign = center === 'first' ? 1 : -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const px = x * scale;
        const py = y * scale;
        // 3겹 노이즈. 큰 덩어리 + 중간 + 잔결, 각자 다른 방향으로 흐른다
        let n = noise(px + t, py - t * 0.7) * 0.55 + noise(px * 2.1 - t * 1.3 + 17, py * 2.1 + t) * 0.3 + noise(px * 4.3 + t * 2 + 41, py * 4.3 - t * 1.6) * 0.15;
        n = Math.min(1, Math.max(0, (n - 0.25) / 0.5)); // 값이 가운데에 몰리므로 0~1로 펴 준다
        const r = radial[y * w + x];
        n = n * 0.78 + (radialSign > 0 ? r : 1 - r) * 0.22;
        let a = (thr - n) / SOFT;
        a = a <= 0 ? 0 : a >= 1 ? 1 : a * a * (3 - 2 * a);
        const i = (y * w + x) * 4;
        data[i] = data[i + 1] = data[i + 2] = 255;
        data[i + 3] = (a * 255) | 0;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  resize();
  return { set, resize };
}
