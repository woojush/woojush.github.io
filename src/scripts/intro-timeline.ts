// 메인 인트로의 시간표. 문구의 확대와 별의 움직임이 같은 곡선에서 나온다 (DOM·WebGL 없는 순수 함수만 둔다).
//
//   0s      별이 먼저 나타난다
//   2s      메인 문장이 나타나 천천히 커지기 시작한다 (T_TITLE)
//   4s      메인 문장이 나타나고 2초 뒤, 작은 문장이 나타나 같이 커진다 (T_SUB)
//   7s      작은 문장이 3초 동안 커진 뒤, 별들의 중심을 향한 마지막 확대가 시작된다 (T_CLIMAX)
//   7~11.5s 처음엔 느리게, 갈수록 가파르게 빨라져 마지막에는 빨려 들어가듯 쏟아지고, 문구는 지나가 사라지고, 끝에서 별도 어둠 속으로 사라진다
//   11.5s   화면이 완전히 어두운 배경이 되고, 그 자리에 홈 화면이 나타난다 (T_END)
//
// "확대 속도 → 별의 속도": 문구가 로그 척도로 커지는 비율(rate, 1/s)이 곧 별이 날아오는 속도를 정한다.
// 카메라가 앞으로 날아갈 때 가까운 물체는 비례해서 빠르게 커지므로, 문구와 별이 한 장면 안에서 맞물려 보인다.

export const T_TITLE = 2;
export const T_SUB = T_TITLE + 2; // 메인 문장이 나타나고 2초 뒤 (HomeHero.astro의 animation-delay와 같은 값)
export const SUB_ZOOM_SECONDS = 3; // 작은 문장이 나타난 뒤 이만큼 커지고 나서 마지막 확대가 시작된다
export const T_CLIMAX = T_SUB + SUB_ZOOM_SECONDS;
export const CLIMAX_SECONDS = 4.5; // 마지막 확대의 길이(4~5초)
export const T_END = T_CLIMAX + CLIMAX_SECONDS;

const SCALE_START = 1; // 문장이 나타날 때의 크기(배). 1에서 시작해 커지기만 한다(글자를 한 번 그린 크기보다 작아지지 않는다)
const SCALE_END = 60; // 마지막 확대가 끝날 때의 크기(배). 이때 문구는 이미 투명하다
const CLIMAX_POWER = 3; // 마지막 확대의 가속: 확대 비율이 (진행)^3으로 커진다. 클수록 처음은 더 느리고 끝은 더 가파르다
const RATE_START = 0.02; // 문장이 나타날 때의 확대 비율(로그, 1/s)
const RATE_CLIMAX = 0.066; // 마지막 확대 직전의 확대 비율. 여기서 끊김 없이 이어서 빨라진다

const GROW_SECONDS = T_CLIMAX - T_TITLE;
const LOG_AT_CLIMAX = RATE_START * GROW_SECONDS + ((RATE_CLIMAX - RATE_START) * GROW_SECONDS) / 2;
// 마지막 확대에서 SCALE_END에 정확히 닿도록 정점의 비율을 역산한다 (상수를 바꿔도 끝 크기가 유지된다)
const RATE_PEAK =
  RATE_CLIMAX +
  ((CLIMAX_POWER + 1) * (Math.log(SCALE_END / SCALE_START) - LOG_AT_CLIMAX - RATE_CLIMAX * CLIMAX_SECONDS)) /
    CLIMAX_SECONDS;

const FLY_BASE = 0.4; // 확대가 없을 때도 별이 천천히 앞으로 다가오는 속도(깊이 단위/초)
const FLY_PER_RATE = 8; // 확대 비율 1(1/s)당 더해지는 별의 속도

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
  /** 별 장면의 투명도 배수(0~1). 마지막 확대의 끝에서 어둠 속으로 사라진다 */
  stars: number;
  /** 인트로가 끝나 홈 화면을 보여줄 때가 되었는가 */
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
    return { scale: SCALE_START, rate: 0, fade: 1, climax: 0, boost: 0, stars: 1, done: false };
  }
  if (time <= T_CLIMAX) {
    const u = time - T_TITLE;
    const log = RATE_START * u + ((RATE_CLIMAX - RATE_START) * u * u) / (2 * GROW_SECONDS);
    const rate = held ? RATE_CLIMAX : RATE_START + ((RATE_CLIMAX - RATE_START) * u) / GROW_SECONDS;
    return { scale: SCALE_START * Math.exp(log), rate, fade: 1, climax: 0, boost: 0, stars: 1, done: false };
  }

  const tau = Math.min(1, (time - T_CLIMAX) / CLIMAX_SECONDS);
  const log =
    LOG_AT_CLIMAX +
    RATE_CLIMAX * CLIMAX_SECONDS * tau +
    ((RATE_PEAK - RATE_CLIMAX) * CLIMAX_SECONDS * tau ** (CLIMAX_POWER + 1)) / (CLIMAX_POWER + 1);
  const rate = RATE_CLIMAX + (RATE_PEAK - RATE_CLIMAX) * tau ** CLIMAX_POWER;
  const scale = SCALE_START * Math.exp(log);
  return {
    scale,
    rate,
    // 문구는 크기를 기준으로 사라진다(가속이 끝에 몰려 있어서 시간 기준이면 작은 채로 사라진다)
    fade: 1 - smoothstep(Math.log(2.2), Math.log(30), Math.log(scale)),
    stars: 1 - smoothstep(0.84, 1, tau),
    climax: tau,
    boost: tau * tau,
    done: time >= T_END,
  };
}

/** 문구의 확대 비율에 맞춘 별의 비행 속도(깊이 단위/초) */
export function flySpeed(rate: number): number {
  return FLY_BASE + FLY_PER_RATE * rate;
}
