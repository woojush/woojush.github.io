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
// 반대로 흰 세계에서 Knowledge로 나갈 때(블랙홀 벗어나기)는 같은 곡선을 거꾸로 돈다: exitFrame(t).

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

// 흰 세계: 가운데의 작은 빛에서 시작해 가속하며 커져 화면을 덮는다.
// world는 0~1이고, CSS(HomeHero.astro의 .world-disc)가 반지름을 world × 170%(화면 모서리까지 거리 기준)로 그린다.
// WORLD_COVERED 이상이면 가장자리의 번짐까지 포함해 화면 전체가 흰색이다.
const WORLD_START = 0.5; // 마지막 확대의 진행이 여기에 닿으면 흰 세계가 나타난다
const WORLD_POWER = 2.4; // 클수록 처음엔 작게 머물다 끝에서 폭발적으로 커진다 (별이 쏟아지는 가속과 같은 결)
export const WORLD_COVERED = 0.64;
const HOME_FROM = 0.84; // 마지막 확대의 진행이 여기에 닿으면 요약정리 화면이 흰 세계 안에서 나타나기 시작한다 (이때 흰 세계가 내용 영역을 덮고 있다)

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
  /** 가운데에서 커지는 흰 세계의 크기(0~1). WORLD_COVERED 이상이면 화면 전체가 흰색이다 */
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
  const world = Math.max(0, (tau - WORLD_START) / (1 - WORLD_START)) ** WORLD_POWER;
  return {
    scale,
    rate,
    // 문구는 크기를 기준으로 사라진다(가속이 끝에 몰려 있어서 시간 기준이면 작은 채로 사라진다)
    fade: 1 - smoothstep(Math.log(2.2), Math.log(30), Math.log(scale)),
    world,
    covered: world >= WORLD_COVERED,
    // 마지막 확대가 끝난 뒤(SETTLE_SECONDS)까지 이어서 자리 잡는다. 시간 기준이라 tau가 1에서 멈춰도 계속 진행한다
    home: smoothstep(T_CLIMAX + HOME_FROM * CLIMAX_SECONDS, T_DONE, time),
    // 흰 세계가 화면을 완전히 덮은 뒤(world 0.64 → tau 약 0.91)에야 별을 끈다
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

// ───────── 블랙홀 벗어나기 (흰 세계 → 별 세계, 홈에서 Knowledge로 나갈 때) ─────────
//
// 입장의 거꾸로다. 흰 세계가 가운데 한 점으로 줄어들며 요약정리 화면이 그 안으로 말려 들어가고, 별은 반대 방향으로 날며(가운데로 모여들며)
// 줄이 길게 늘어났다가 점점 잦아들어 평소의 느린 비행(Knowledge의 별과 같은 속도)으로 이어진다. 끝나면 Knowledge로 이동한다.
export const EXIT_SECONDS = 1.6;
export const EXIT_CRUISE = 0.35; // Knowledge 장면(topic-stage.ts)의 평소 비행 속도. 여기서 끊김 없이 이어진다
const EXIT_REVERSE_SPEED = 14; // 시작할 때 뒤로 나는 속도(깊이 단위/초). 입장의 마지막 속도보다 느리다
const EXIT_BOOST = 0.8;
const EXIT_HOME_FADE = 0.22; // 요약정리 화면이 사라지는 데 걸리는 진행(0~1)

export interface ExitFrame {
  /** 흰 세계의 크기(0~1). 입장에서 화면을 막 덮은 크기(WORLD_COVERED)에서 시작해 0으로 줄어든다 */
  world: number;
  /** 요약정리 화면이 보이는 정도(1 → 0). 흰 세계가 줄기 시작하면 곧바로 말려 들어간다 */
  home: number;
  /** 별의 비행 속도(깊이 단위/초). 음수는 뒤로 나는 것(가운데로 모여든다) */
  speed: number;
  /** 별을 더 크고 밝게, 줄로 늘이는 정도(0~1) */
  boost: number;
  /** 탈출이 끝나 다음 페이지로 이동할 때가 되었는가 */
  done: boolean;
}

/** 시각 t(초)의 탈출 상태 */
export function exitFrame(t: number): ExitFrame {
  const u = Math.min(1, Math.max(0, t / EXIT_SECONDS));
  const r = 1 - u;
  return {
    world: WORLD_COVERED * r ** WORLD_POWER,
    home: 1 - smoothstep(0, EXIT_HOME_FADE, u),
    speed: EXIT_CRUISE - EXIT_REVERSE_SPEED * r ** 3,
    boost: EXIT_BOOST * r * r,
    done: u >= 1,
  };
}
