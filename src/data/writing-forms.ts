// Writing의 형식 4종과 태양계 대응 (2026-10-12 사용자 결정). 형식을 늘리려면 여기에 한 줄을 더하고 content.config.ts의 enum에 값을 더한다.
// 행성은 형식의 성격을 빗댄 것이다: 시=수성(가장 작고 중심에 가까움), 산문=목성(가장 크고 띠가 길게 흐름),
// 에세이=토성(고리가 제자리로 되돌아 돎, 재귀적 자기질문), 책갈피=달(스스로 빛나지 않고 남의 빛을 반사).
// 색: 행성마다 한 색조(hue)를 쓰고 글마다 spread 안에서 은은하게 달라진다(lib/writing.ts의 cardColor). 카드 위 흰 글자의 대비가 모든 글에서 4.5 이상이 되도록 명도를 잡았다(2026-10-12 검증: 시 5.2, 산문 4.9, 에세이 4.9, 책갈피 6.5). 값을 바꾸면 다시 확인한다.
export type FormId = 'poem' | 'prose' | 'essay' | 'bookmark';

export interface WritingForm {
  id: FormId;
  /** 화면에 쓰는 한국어 이름 */
  label: string;
  en: string;
  /** 대응하는 천체 (영어 표기) */
  body: 'Mercury' | 'Jupiter' | 'Saturn' | 'Moon';
  /** 카드 색의 중심 색상(0~360)과 글마다 흔들리는 폭(±도), 채도·명도(%) */
  hue: number;
  spread: number;
  sat: number;
  light: number;
  /** 입구 화면: 궤도 지름(화면 짧은 변 대비 %), 한 바퀴 시간(초), 시작 각도(도) */
  orbit: number;
  period: number;
  phase: number;
}

export const forms: readonly WritingForm[] = [
  { id: 'poem', label: '시', en: 'Poem', body: 'Mercury', hue: 200, spread: 12, sat: 28, light: 34, orbit: 30, period: 70, phase: 200 },
  { id: 'prose', label: '산문', en: 'Prose', body: 'Jupiter', hue: 16, spread: 12, sat: 44, light: 38, orbit: 48, period: 110, phase: 40 },
  { id: 'essay', label: '에세이', en: 'Essay', body: 'Saturn', hue: 44, spread: 10, sat: 40, light: 30, orbit: 66, period: 160, phase: 300 },
  { id: 'bookmark', label: '책갈피', en: 'Bookmark', body: 'Moon', hue: 255, spread: 14, sat: 22, light: 38, orbit: 84, period: 220, phase: 120 },
];

export const formIds = forms.map((f) => f.id);
export const formById = (id: string) => forms.find((f) => f.id === id);
