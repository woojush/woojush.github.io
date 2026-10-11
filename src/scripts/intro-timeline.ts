// 메인 인트로의 시간표. 문구의 확대와 별의 움직임이 같은 곡선에서 나온다 (DOM·WebGL 없는 순수 함수만 둔다).
//
//   0s      별이 먼저 나타난다
//   2s      메인 문장이 나타나 천천히 커지기 시작한다 (T_TITLE)
//   3.8s    메인 문장이 나타나고 1.8초 뒤, 작은 문장이 나타나 같이 커진다 (T_SUB)
//   6.0s    작은 문장이 다 나타나고(0.9초) 1.3초가 지나면, 별들의 중심을 향한 마지막 확대(블랙홀)가 시작된다 (T_CLIMAX)
//   6.0~10.0s 처음엔 느리게, 갈수록 폭발적으로 빨라져 마지막 1~2초는 블랙홀로 빨려 들어가듯 쏟아지고, 문구는 지나가 사라진다.
//           8.0초(WORLD_START)에 가운데에서 흰 세계가 작은 빛으로 나타나 같이 가속하며 커지고, 9.7초쯤 화면 전체를 덮는다
//   9.4~10.5s 흰 세계가 덮이는 만큼 요약정리 화면이 그 안에서 나타나 제 크기로 자리 잡는다 (T_DONE에 끝)
//
// "확대 속도 → 별의 속도": 문구가 로그 척도로 커지는 비율(rate, 1/s)이 곧 별이 날아오는 속도를 정한다.
// 카메라가 앞으로 날아갈 때 가까운 물체는 비례해서 빠르게 커지므로, 문구와 별이 한 장면 안에서 맞물려 보인다.
//
// 흰 세계에서 Knowledge로 나갈 때의 시간표는 아래쪽 exitFrame·arriveFrame.

export const T_TITLE = 2;
export const T_SUB = T_TITLE + 1.8; // 메인 문장이 나타나고 1.8초 뒤 (HomeHero.astro의 animation-delay와 같은 값)
const SUB_APPEAR_SECONDS = 0.9; // 작은 문장이 나타나는 데 걸리는 시간 (HomeHero.astro의 appear)
export const SUB_HOLD_SECONDS = 1.3; // 작은 문장이 다 나타난 뒤 이만큼 지나면 마지막 확대가 시작된다
export const T_CLIMAX = T_SUB + SUB_APPEAR_SECONDS + SUB_HOLD_SECONDS;
export const CLIMAX_SECONDS = 4; // 마지막 확대의 길이. 앞쪽은 거의 정지에 가깝고 가속이 뒤쪽 1~2초에 몰린다
export const T_END = T_CLIMAX + CLIMAX_SECONDS; // 마지막 확대가 끝나는 때(흰 세계는 이미 화면을 덮었다)
export const SETTLE_SECONDS = 0.5; // 마지막 확대가 끝난 뒤 요약정리 화면이 제 크기로 자리 잡는 시간
export const T_DONE = T_END + SETTLE_SECONDS;

const SCALE_START = 1; // 문장이 나타날 때의 크기(배). 1에서 시작해 커지기만 한다(글자를 한 번 그린 크기보다 작아지지 않는다)
const SCALE_END = 300; // 마지막 확대가 끝날 때의 크기(배). 이때 문구는 이미 투명하다
const CLIMAX_POWER = 4; // 마지막 확대의 가속: 확대 비율이 (진행)^4로 커진다. 클수록 처음은 더 느리고 끝은 더 가파르다
const RATE_START = 0.02; // 문장이 나타날 때의 확대 비율(로그, 1/s)
const RATE_CLIMAX = 0.066; // 마지막 확대 직전의 확대 비율. 여기서 끊김 없이 이어서 빨라진다

// 흰 빛(veil.ts): 마지막 확대의 후반에 하얀 빛이 구름처럼 번져 화면을 덮는다. world는 그 정도(0~1)이고 1이면 화면 전체가 흰색이다.
const WORLD_START = 0.5; // 마지막 확대의 진행이 여기에 닿으면 흰 빛이 번지기 시작한다
const WORLD_END = 0.92; // 여기서 화면 전체를 덮는다
const HOME_FROM = 0.88; // 마지막 확대의 진행이 여기에 닿으면 요약정리 화면이 흰 빛 안에서 나타나기 시작한다

const GROW_SECONDS = T_CLIMAX - T_TITLE;
const LOG_AT_CLIMAX = RATE_START * GROW_SECONDS + ((RATE_CLIMAX - RATE_START) * GROW_SECONDS) / 2;
// 마지막 확대에서 SCALE_END에 정확히 닿도록 정점의 비율을 역산한다 (상수를 바꿔도 끝 크기가 유지된다)
const RATE_PEAK =
  RATE_CLIMAX +
  ((CLIMAX_POWER + 1) * (Math.log(SCALE_END / SCALE_START) - LOG_AT_CLIMAX - RATE_CLIMAX * CLIMAX_SECONDS)) /
    CLIMAX_SECONDS;

const FLY_BASE = 0.4; // 확대가 없을 때도 별이 천천히 앞으로 다가오는 속도(깊이 단위/초)
const FLY_PER_RATE = 10; // 확대 비율 1(1/s)당 더해지는 별의 속도

export interface IntroFrame {
  /** 문구의 크기(배) */
  scale: number;
  /** 문구가 커지는 비율(로그, 1/s) */
  rate: number;
  /** 문구의 투명도 배수(0~1). 마지막 확대에서 지나가며 사라진다 */
  fade: number;
  /** 마지막 확대의 진행(0~1) */
  climax: number;
  /** 별을 더 크고 밝게 하는 정도(0~1). 마지막 확대가 가팔라질수록 커진다 */
  boost: number;
  /** 번져 덮는 흰 빛의 정도(0~1). 1이면 화면 전체가 흰색이다 */
  world: number;
  /** 흰 세계가 화면을 덮었는가. 이때부터 페이지 바탕·헤더가 흰 세계의 색으로 바뀌어도 눈에 띄지 않는다 */
  covered: boolean;
  /** 요약정리 화면이 나타난 정도(0~1). 흰 세계가 덮이는 만큼 나타나고 살짝 커지며 자리 잡는다 */
  home: number;
  /** 별 장면의 투명도 배수(0~1). 흰 세계가 화면을 덮은 뒤에 사라진다 */
  stars: number;
  /** 인트로가 끝나 요약정리 화면이 자리를 잡았는가 */
  done: boolean;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * 시각 t(초)의 인트로 상태. hold가 참이면 마지막 확대 직전(T_CLIMAX)에서 멈춘 채로 둔다
 * (필요하면 마지막 확대 없이 머무르게 하는 용도).
 */
export function introFrame(t: number, hold = false): IntroFrame {
  const held = hold && t >= T_CLIMAX;
  const time = held ? T_CLIMAX : t;

  if (time <= T_TITLE) {
    return { scale: SCALE_START, rate: 0, fade: 1, climax: 0, boost: 0, world: 0, covered: false, home: 0, stars: 1, done: false };
  }
  if (time <= T_CLIMAX) {
    const u = time - T_TITLE;
    const log = RATE_START * u + ((RATE_CLIMAX - RATE_START) * u * u) / (2 * GROW_SECONDS);
    const rate = held ? RATE_CLIMAX : RATE_START + ((RATE_CLIMAX - RATE_START) * u) / GROW_SECONDS;
    return { scale: SCALE_START * Math.exp(log), rate, fade: 1, climax: 0, boost: 0, world: 0, covered: false, home: 0, stars: 1, done: false };
  }

  const tau = Math.min(1, (time - T_CLIMAX) / CLIMAX_SECONDS);
  const log =
    LOG_AT_CLIMAX +
    RATE_CLIMAX * CLIMAX_SECONDS * tau +
    ((RATE_PEAK - RATE_CLIMAX) * CLIMAX_SECONDS * tau ** (CLIMAX_POWER + 1)) / (CLIMAX_POWER + 1);
  const rate = RATE_CLIMAX + (RATE_PEAK - RATE_CLIMAX) * tau ** CLIMAX_POWER;
  const scale = SCALE_START * Math.exp(log);
  const world = smoothstep(WORLD_START, WORLD_END, tau);
  return {
    scale,
    rate,
    // 문구는 크기를 기준으로 사라진다(가속이 끝에 몰려 있어서 시간 기준이면 작은 채로 사라진다)
    fade: 1 - smoothstep(Math.log(2.2), Math.log(30), Math.log(scale)),
    world,
    covered: world >= 1,
    // 마지막 확대가 끝난 뒤(SETTLE_SECONDS)까지 이어서 자리 잡는다. 시간 기준이라 tau가 1에서 멈춰도 계속 진행한다
    home: smoothstep(T_CLIMAX + HOME_FROM * CLIMAX_SECONDS, T_DONE, time),
    // 흰 빛이 화면을 완전히 덮은 뒤(tau 0.92)에야 별을 끈다
    stars: 1 - smoothstep(0.93, 1, tau),
    climax: tau,
    boost: tau * tau,
    done: time >= T_DONE,
  };
}

/** 문구의 확대 비율에 맞춘 별의 비행 속도(깊이 단위/초) */
export function flySpeed(rate: number): number {
  return FLY_BASE + FLY_PER_RATE * rate;
}

// ───────── 홈에서 Knowledge로 (흰 세계 → 별 세계) ─────────
//
// 두 막이다. ① 홈에서(exitFrame, 0.55초): 요약정리가 흰 바탕 위에서 가운데로 가라앉으며 사라지고 곧바로 Knowledge로 이동한다(흰 바탕은 그대로).
// ② Knowledge에서(arriveFrame, 약 3.4초): 흰 화면으로 시작해, 흰 빛이 가운데부터 구름처럼 걷히며 그 속에서 별이 드러난다.
// 별은 줄(꼬리)로 길게 늘어난 빠른 비행에서 시작해 평소 속도로 잦아들고, 걷힐 때쯤 태그가 피어난다. 효과가 도착한 쪽에서 돌기 때문에 이동을 기다리는 시간이 없고
// 마지막 장면이 Knowledge의 별 장면 자체라서 이어붙인 자국이 없다.
export const EXIT_SECONDS = 0.55;
export const ARRIVE_HOLD = 0.35; // 도착해서 별 장면이 준비될 때까지 흰색으로 머무는 시간
export const ARRIVE_SECONDS = 3.4; // 흰 빛이 걷히는 데 걸리는 시간
export const ARRIVE_BLOOM_AT = 0.45; // 걷힘의 이 비율에서 태그가 피어나기 시작한다
export const EXIT_CRUISE = 0.35; // Knowledge 장면(topic-stage.ts)의 평소 비행 속도. 여기서 끊김 없이 이어진다
const ARRIVE_SPEED = 9; // 걷히기 시작할 때 별의 추가 속도(깊이 단위/초)
const ARRIVE_BOOST = 0.7;

export interface ExitFrame {
  /** 요약정리 화면이 보이는 정도(1 → 0) */
  home: number;
  /** 홈에서의 효과가 끝나 이동할 때가 되었는가 */
  done: boolean;
}

/** 시각 t(초)의 홈 쪽 상태 */
export function exitFrame(t: number): ExitFrame {
  const u = Math.min(1, Math.max(0, t / EXIT_SECONDS));
  return { home: 1 - smoothstep(0, 1, u), done: u >= 1 };
}

export interface ArriveFrame {
  /** 흰 빛의 정도(1 → 0) */
  veil: number;
  /** 별의 비행 속도(깊이 단위/초) */
  speed: number;
  /** 별을 더 크고 밝게, 줄로 늘이는 정도(0~1) */
  boost: number;
  /** 태그가 피어날 때가 되었는가 */
  bloom: boolean;
  /** 걷힘이 끝났는가 */
  done: boolean;
}

/** 도착 후 시각 t(초)의 상태 */
export function arriveFrame(t: number): ArriveFrame {
  const u = Math.min(1, Math.max(0, (t - ARRIVE_HOLD) / ARRIVE_SECONDS));
  // 부드러운 시작과 끝(smoothstep): 처음엔 천천히 열리고 가운데가 가장 빠르며 끝에서 잔잔히 멎는다
  const open = u * u * (3 - 2 * u);
  const r = 1 - u;
  return {
    veil: 1 - open,
    speed: EXIT_CRUISE + ARRIVE_SPEED * r * r * r,
    boost: ARRIVE_BOOST * r * r,
    bloom: u >= ARRIVE_BLOOM_AT,
    done: u >= 1,
  };
}
