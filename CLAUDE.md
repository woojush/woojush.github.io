# CLAUDE.md — 프로젝트의 지속적인 source of truth

이 파일은 Claude Code가 이 저장소에서 작업할 때 **가장 먼저 읽고 항상 따르는 기준**이다.
세부 근거는 `docs/01~07`에 있다. 이 파일과 docs가 충돌하면 이 파일이 우선하며, 둘 다 같이 고친다.

## 0. 현재 상태

- **Phase 0 완료** (배포 가능한 최소 기반 검증), **Phase 1 완료·승인됨** (2026-10-10, 디자인 토큰과 사이트 틀).
- **디자인 방향 v2 적용됨** (2026-10-10, `docs/07`): 어두운 기본 테마, 탭 바, 메인 별 입자 장면 히어로. Phase 2 전에 하위 페이지별 디자인을 구체화한다.
- **정보 구조 논의 반영 완료** (2026-10-10): 메뉴 순서 `projects about knowledge writing`(외부 방문자가 projects를 먼저 보도록, home은 메뉴에서 제외), HOME은 NOW + 최근 활동만 유지하되 Selected projects를 Recent보다 위에, ABOUT은 `docs/01` §4.2. 탭 바 디자인은 사용자가 직접 수정할 수 있다(순서·이름은 유지).
- **한국어만 지원**한다. UI 라벨은 영어를 유지한다. 영어 글·UI 작업은 하지 않는다.
- **탭 바 v4 구현됨** (2026-10-10, `tabbar-v4` 브랜치): 사용자 지시로 lifestories.org의 상단 알약을 그대로 따랐다. 평소에는 화면 위 가운데에 떠 있는 작은 알약(가운데 허브)이고, 마우스가 올라가면 스프링으로 늘어나며 글자가 모인다. 글자에 마우스를 올리면 알약 아래쪽에서 은은한 빛이 따라온다. **home은 메뉴에서 뺐고** 이름과 허브가 홈 링크다. 모양은 `src/styles/nav.css`, 값은 `tokens.css`의 탭 바 토큰, 동작은 `src/scripts/nav.ts`. 이 효과는 `docs/07` §3 c·`DESIGN.md`의 승인된 예외다.
- **About 구현됨** (2026-10-10, `about-page` 브랜치): 구성은 Intro → Interests → Why this site → Path(Timeline) → Elsewhere. 문구는 사용자가 직접 쓴 것이다. Intro의 "Robot AI 엔지니어"는 사용자의 표현이며, 사이트 전체의 주제를 한 분야로 제한하지 않는 §1 원칙은 그대로다.
- **메인 인트로 → 홈 화면 구현됨** (2026-10-10): 첫 방문에 문구가 점점 커지고 그 속도에 맞춰 별이 날아온다. 메인 문장이 나타나고 1.8초 뒤(3.8초) 작은 문장이 나타나며, 작은 문장이 다 나타나고 1.3초 뒤(6.0초) 4초 동안 블랙홀에 빨려 들어가듯(별은 선으로 늘어나 휘감김, 확대 300배) 폭발적으로 확대되어 어두운 배경 속으로 사라지면, **같은 페이지(`/`)에서** 프로필(사진·설명)·Now·Projects(active)·Recent가 나타난다. 이동은 없다. 인트로는 움직임 줄이기 설정일 때만 하지 않고, 홈에 올 때마다 한다(누르거나 Enter·Space·Esc로 건너뛴다). 세부는 `docs/07` "메인 인트로 → 홈 화면", 시간표는 `src/scripts/intro-timeline.ts`.
- **Knowledge 구현됨** (2026-10-11): 목록은 topic 경로(`분야/세부분야[/더 세부]`, 최대 3단계)에서 만든 단계별 화면(첫 화면=분야들이 글자와 글 수만 달고 천천히 떠다님 → 누르면 하위 주제가 떠다니는 화면 → … → 끝(하위 없음)에서 글 목록, 주소 `/knowledge/topics/<경로>/`, lifestories.org 참고, 사용자 지시), 글 페이지는 breadcrumb·수식(KaTeX)·코드(Shiki 두 테마)·우측 목차·Related(역링크 자동)·이전/다음. 이를 위해 Phase 2·3의 일부(읽기 환경, 트리, Related)를 Knowledge 한정으로 앞당겼다(사용자 승인). Projects·Writing 상세는 아직 최소 틀이고 `/tags/`·Mermaid·검색은 하지 않았다. 첫 공개 노트는 MML(Mathematics for Machine Learning) 2·3장 정리 17개(`ai/mathematics/linear-algebra` 6, `ai/mathematics/analytic-geometry` 11, 전부 `status: growing`, 2026-10-11)다. 구조는 `docs/01` §4.3, 작성법은 아래 §9.
- **Knowledge 노션 연동 준비** (2026-10-11): 사용자가 노션에서 글을 쓰고 사이트가 가져오는 방식으로 간다(외부 서비스 의존 승인됨, MML만 먼저). 노션에 `Knowledge (woojush.github.io)` 페이지 아래 **Categories**(Name·Slug·Order·Description·Color·Parent↔Children·Notes·Note count)와 **Notes**(Name·Slug·Category↔Notes·Status·Order·Description·Tags·Publish·Prerequisites↔Required by) DB를 만들었고 예시 행만 있다. 기존 MML 노트 17개는 삭제했다(사용자가 노션으로 직접 옮긴다). **동기화 스크립트·GitHub Actions 버튼은 아직 없다**(다음 단계). 그 전까지 Knowledge는 비어 있다.
- **Knowledge 도형 변경** (2026-10-11): 떠다니는 것은 lifestories.org처럼 **이름 칸(색)+글 수 칸**의 직사각 태그이고, 글 수와 무관하게 **크기가 모두 같다**. 색은 `topics.yaml`의 `color`(walnut·moss·slate·clay·sand·plum·stone, 없으면 부모 색, 최상위는 stone), 배경은 별 장면. 미구현: 끌어서 이동, 누르면 별 배경으로 사라지는 전환.
- GitHub·이메일·LinkedIn은 공개 확정, `site.ts`의 `links`에 추가했다(푸터와 About의 Elsewhere가 같이 쓴다).
- 다음은 **하위 페이지별 디자인 설계** 단계(Projects·Writing)이고, 그 뒤에 **Phase 2·3의 남은 부분**(Projects·Writing 상세에 읽기 환경·Related 적용, `/tags/`)이다. 읽기 환경(`ArticleLayout`·prose·KaTeX)과 트리·Related는 Knowledge에서 이미 만들어 두었으니 재사용한다. 사용자 승인 전에는 넘어가지 않는다.
- 사용자는 대부분의 기능·디자인을 Claude가 맥락과 취향을 반영해 먼저 결정하고, 결과물을 보고 사용자가 판단하는 방식을 원한다. 질문은 꼭 필요한 것만 한다.
- 진행 순서와 각 Phase의 완료 기준: `docs/06_implementation_plan.md`
- 한 번에 **한 Phase만** 구현하고, 끝나면 완료 기준별 결과를 보고한 뒤 승인을 기다린다.
- 계획에 없는 기능이 필요해 보이면 구현하지 말고 먼저 제안한다.

## 1. 프로젝트 목적

5~10년 동안 쓰는 개인 웹사이트. **Personal Website + Knowledge Garden + Portfolio + Writing.**
Learn → Build → Explain → Reflect 과정을 쌓는 개인 아카이브다.

가장 중요한 것은 현재의 나에게 완벽히 맞는 사이트가 아니라 **오래 쓸 수 있는 구조**다. 따라서:

- 현재 관심사(예: Robotics)를 확정된 전문분야로 가정하지 않는다. AI 분야를 하나로 제한하지 않는다.
- 군 복무를 사이트의 주제로 만들지 않는다.
- 콘텐츠가 적다는 이유로 과도한 UI를 만들지 않는다. 비어 있는 섹션은 **숨긴다.**
- 처음부터 모든 기능을 구현하지 않는다. 확장성과 단순성을 같이 지킨다.

## 2. 정보 구조

메뉴는 **4개 고정**, UI 표기는 **소문자·영어 라벨**: `projects` `about` `knowledge` `writing`. 홈은 메뉴가 아니라 사이트 이름(헤더 왼쪽)과 탭 바 가운데 허브로 간다.
새 메뉴는 `docs/01` 7절 조건(기존 type에 안 담기는 콘텐츠 10개 이상 + 찾기 어려움)을 둘 다 만족할 때만 추가한다.

| URL | 역할 |
|-----|------|
| `/` | 현재의 나 (NOW) + 최근 활동 (Selected projects 먼저) |
| `/projects/`, `/projects/<slug>/` | 만든 것 (case study). 외부 방문자가 가장 먼저 볼 곳 |
| `/about/` | 소개, 학력/스킬, 방향, Timeline, Links |
| `/knowledge/`, `/knowledge/<slug>/` | What I learned (주제 트리) |
| `/writing/`, `/writing/<slug>/` | What I think |
| `/tags/<tag>/` | (Phase 3, 메뉴 없음) |

콘텐츠 분류 축은 셋이며 서로 역할이 다르다.

- **type** — knowledge / project / writing. **폴더가 결정한다.**
- **topic** — knowledge 전용 트리 위치. 예: `ai/mathematics/linear-algebra`
- **tags** — 느슨한 연결. kebab-case

## 3. 절대 변경하면 안 되는 architecture 원칙

1. **`type`은 frontmatter에 넣지 않는다.** 폴더(`src/content/knowledge|projects|writing/`)가 type이다. 스키마에 type 필드를 만들지 않는다.
2. **`topic`은 URL 생성에 쓰지 않는다.** URL은 파일명(slug)에서만 만든다. topic은 taxonomy/navigation/filtering용 metadata다. `mathematics/linear-algebra` → `mathematics/foundations`로 바꿔도 기존 URL은 바뀌지 않아야 한다.
3. **한 번 공개한 slug는 바꾸지 않는다.** 불가피하면 `astro.config.mjs`의 `redirects`에 옛 URL → 새 URL을 추가한다. slug는 영문 소문자-하이픈.
4. **`src/content/`와 `src/data/`에는 코드가 없고, 나머지에는 글이 없다.** 콘텐츠 파일은 컴포넌트 이름을 몰라야 한다 (MDX의 `<Embed>` 등 mdx 컴포넌트 제외).
5. **페이지/컴포넌트에서 `getCollection`을 직접 호출하지 않는다.** `src/lib/content.ts`를 거친다 (draft 제외 같은 규칙을 한 곳에서 관리).
6. **컴포넌트는 데이터를 받아 그리기만 한다.** 조회·가공 로직은 `src/lib/`에 둔다.
7. **색·서체·간격은 디자인 토큰으로만** 쓴다 (`src/styles/tokens.css`). 컴포넌트에 상수를 직접 쓰지 않는다. 서체는 sans 한 가족(Pretendard 후보)으로 시작하되 토큰으로 관리해 나중에 교체 가능하게 한다.
8. **관계(`links`)는 한쪽에만 선언**하고 반대쪽은 빌드 시 계산한다 (backlink, Phase 3).
9. **`draft`는 "사이트에 배포하지 않을 콘텐츠"일 뿐 비공개가 아니다.** 저장소는 public이다.
10. **다국어 라우팅/번역 시스템을 만들지 않는다.** 글마다 `lang`(`ko`|`en`, 기본 `ko`)만 둔다. 당분간 한국어만 지원하고 UI 라벨은 영어를 유지한다(2026-10-10).
11. 파일 하나가 비대해지면 쪼갠다 (컴포넌트 약 150줄, 페이지 약 100줄 기준).

## 4. 공개 정보 원칙 (저장소가 public이다)

- **실명 'Shin WooJu'는 공개하기로 확정**했다(2026-10-10, `src/data/site.ts`의 `name`). 프로필 사진은 사용자가 `public/images/profile.(jpg|jpeg|png|webp)`로 직접 올린 경우에만 홈에 보인다(올리지 않으면 사진 없이 그린다). Claude가 사진을 만들거나 넣지 않는다.
- GitHub·이메일·LinkedIn은 공개 확정이며 `site.ts`의 `links`에 있다(2026-10-10). `links`가 비면 푸터 링크와 About의 Elsewhere는 숨긴다. About의 "1학년 성적 4.4 / 4.5"도 사용자가 공개를 확인했다.
- 학교와 "AI Engineering student"라는 정체성은 표현해도 된다.
- 군 복무는 필요하면 **현재 상태를 설명하는 정도**로만. 군 생활 자체를 콘텐츠로 만들지 않는다.
- **군 내부 정보, 민감한 개인정보는 콘텐츠·코드·커밋 메시지 어디에도 넣지 않는다.** git 히스토리도 공개되므로 한 번 커밋하면 지워도 남는다.
- 위에서 공개를 확정한 항목(실명, GitHub, 이메일) 외의 새 개인정보를 사이트에 넣기 전에는 반드시 사용자에게 확인한다.

## 5. 폴더 구조

```text
CLAUDE.md                      이 파일
README.md                      실행/배포 요약
docs/                          설계 문서 01~07
astro.config.mjs               site/base/통합 설정
.github/workflows/deploy.yml   GitHub Pages 배포
.claude/skills/                외부 디자인 스킬 사본 (§16, 출처: SOURCES.md)
public/                        정적 파일 (favicon, 이후 fonts, labs/)
src/
  content.config.ts            컬렉션 + 스키마 (기준: docs/02)
  content/knowledge|projects|writing/   *.md / *.mdx   ← 글
  content/about.md             About 본문 (singleton)
  data/now.yaml                HOME의 NOW
  data/timeline.yaml           About의 Timeline (최상위는 `entries:`)
  data/site.ts                 사이트 이름/태그라인/메뉴
  layouts/BaseLayout.astro     최소 틀 (Phase 1에서 확장)
  lib/content.ts               컬렉션 조회 헬퍼
  pages/                       라우팅. 얇게 유지
```

디자인 v2에서 추가됨: `docs/07`, `src/components/home/`(HomeHero 인트로, HomeProfile, HomeNow, HomeList), `src/scripts/scene.ts`(별 장면), `src/scripts/home-intro.ts`(시계·상태 전환), `src/scripts/intro-timeline.ts`(확대 곡선), `src/lib/{profile,format}.ts`.
About에서 추가됨: `src/components/about/Timeline.astro`, `src/lib/content.ts`의 `getAbout`·`getTimeline`, about 스키마의 선택 필드 `lead`.
Phase 1에서 추가됨: `src/components/layout/`(Header, Nav, Footer, ThemeToggle), `src/styles/{tokens,fonts,base}.css`, `src/scripts/{theme-init.js,theme-toggle.ts}`, `public/fonts/pretendard/`.
Knowledge에서 추가됨: `src/layouts/ArticleLayout.astro`, `src/components/{knowledge,content,mdx}/`(TopicRow·EntryRow / TableOfContents·Related·PrevNext / Callout·Figure·Embed), `src/styles/{prose,katex}.css`, `src/lib/{topics,links}.ts`, `src/lib/rehype-{heading-anchors,math-errors}.mjs`, `src/data/topics.yaml`, `public/fonts/katex/`.
이후에 추가될 것: `public/labs/`, `/tags/`. 구조 명세는 `docs/05`.

## 6. Content model (요약. 기준은 `docs/02` + `src/content.config.ts`)

공통: `title`(필수) `date`(필수) `updated` `description` `tags[]` `links[]` `draft`(기본 false) `lang`(기본 ko)

| 컬렉션 | 추가 필드 |
|--------|-----------|
| knowledge | `topic`(필수, kebab 경로) `status`(필수: `seed` \| `growing` \| `evergreen`) `order`(선택, 같은 topic 안의 순서) |
| projects | `summary`(필수) `status`(필수: `active`\|`paused`\|`done`\|`archived`) `period{start,end?}` `repo` `demo` `featured` |
| writing | `kind`(필수: `technical`\|`essay`\|`career`\|`learning`\|`reflection`) |

- `links`: `{ type: knowledge|project|writing, slug, rel?: related|prerequisite|builds-on|explains }`
- **knowledge `status`는 색상 코드가 아니다.** 텍스트로만 표시한다.
- 스키마를 어기면 `npm run build`가 파일·필드를 짚어 실패한다. 이것이 회귀 테스트 역할을 한다.
- 선택 필드/enum 값 추가는 기존 글에 영향이 없다. **필수 필드 추가는 지양**하고, 필요하면 선택 + 기본값으로 한다.

## 7. Naming convention

- 콘텐츠 파일명 = slug: 영문 소문자-하이픈 (`projection.md`). 한글 파일명 금지.
- tags: kebab-case 소문자 (`linear-algebra`). topic: kebab-case 슬래시 경로.
- 컴포넌트: `PascalCase.astro`, 값/함수: `camelCase`, 타입: `PascalCase`.
- import는 `@/` 별칭(= `src/`)을 쓴다.
- 내부 링크는 trailing slash로 통일한다 (`/about/`). `trailingSlash: 'always'`.

## 8. 디자인 원칙 (기준: `docs/07` 우선, 그다음 `docs/04`)

**2026-10-10 방향 변경 (사용자 승인·적용됨):** 어두운 테마 기본(dark ↔ light, system 없음), 상단 탭 바 + View Transitions, 메인 한정 별 입자 장면·문구 등장. 아래 목록은 이에 맞게 완화됐다: 모션은 `docs/07` §3의 허용 범위만 쓴다. 카드 그리드·장식 그림자/그라디언트·CTA 히어로·eyebrow 라벨 금지는 유지.

Minimal · Technical · Editorial · Calm · Personal · Typography-driven · 여백 많음.

- 금지: 장식 그림자·그라디언트, 카드 그리드, SaaS/스타트업 랜딩 느낌(히어로+CTA, 아이콘 3열, 통계 블록), 불필요한 애니메이션.
- 목록은 카드가 아니라 **행**(`날짜 | 제목 | 상태`).
- 위계는 크기·굵기·여백으로. 포인트 색 하나는 링크·포커스·선택에만.
- 본문 최대폭 약 680px, 왼쪽 정렬. 모션은 120~160ms의 색/밑줄 전환만, `prefers-reduced-motion` 존중.
- 빈 상태는 안내 문구 없이 **숨긴다.**

## 9. 콘텐츠 작성 방법

### 새 Knowledge 추가
1. `src/content/knowledge/<slug>.md` 생성
2. frontmatter 필수: `title`, `date`, `topic`, `status`. 선택: `description`(목록의 한 줄 설명), `updated`, `tags`, `order`, `links`
3. **topic**은 글 1편에 하나, `분야/세부분야[/묶음]`(예: `ai/mathematics/linear-algebra`; 분야 → 세부분야 → 글 순으로 세 걸음에 걸쳐 보이고 묶음은 글 목록의 소제목). 판별 질문: "이 개념을 어느 분과(교재의 어느 장)에서 배웠나?" 여러 분야에 걸치면 배운 곳에 두고 `links`·`tags`로 잇는다. 시기·프로젝트·군 복무로 나누지 않는다.
4. 본문은 필요한 섹션만 H2로 쓴다. 기본 흐름: 왜 필요한가 → 핵심 아이디어 → 정의·성질 → 예시 → 막히는 지점 (`docs/02` §6.1). **쓰지 않는 섹션은 제목째로 지운다.**
5. 수식은 `$…$`(인라인)·`$$…$$`(블록), 코드는 ``` 펜스(언어 이름 필수). 잘못된 TeX는 빌드가 멈춘다. 선행 개념은 `links`에 `rel: prerequisite`로 한 줄(그 글이 목록에서 앞에 오고 Related에 나타난다). 교재 순서대로 보이게 하고 싶으면 `order`.
6. Callout·Figure·Embed는 `.mdx`에서만(상대 경로 import: `../../components/mdx/Callout.astro`). 새 분야는 그냥 `topic: <새분야>/…`로 쓰면 된다. 메뉴·코드 수정 불필요. 표시 이름·순서만 `src/data/topics.yaml`(선택).

- **제목(H2~H4)에는 수식을 넣지 않는다.** 목차와 앵커 id가 수식의 MathML·TeX 원문까지 글자로 읽어 깨져 보인다. 제목에 기호가 필요하면 유니코드(ℝⁿ, Aᵀ)로 쓴다.
- 인라인 수식 `$…$` 안에 `$`를 중첩하지 않는다(`\text{…}` 안 수식, `\fbox{…}` 안 수식은 `\(…\)`를 쓰거나 `\boxed{…}`로).

### 새 Project 추가
1. `src/content/projects/<slug>.md` 생성
2. 필수: `title`, `date`, `summary`, `status`. 선택: `period`, `repo`, `demo`, `featured`, `tags`
3. 본문은 case study. 필요한 것만 (Overview / Problem / Motivation / Architecture / Implementation / What I learned / What failed / Future improvements). GitHub·Demo는 frontmatter에 쓴다.

### 새 Writing 추가
1. `src/content/writing/<slug>.md` 생성
2. 필수: `title`, `date`, `kind`. 본문 형식은 자유.
- Knowledge = 배운 것, Writing = 내 생각. 판별 질문: "틀릴 수 있는 의견을 담고 있는가?" 그렇다면 Writing.

### 글 사이 연결
한쪽 frontmatter에 `links` 한 줄만 추가한다. 반대쪽 표시는 자동(Phase 3부터).

### NOW 수정
`src/data/now.yaml`의 `items`를 고치고 `updated` 날짜도 같이 고친다. 행은 데이터이므로 추가/삭제/이름 변경에 코드 수정이 필요 없다.

### Timeline 수정
`src/data/timeline.yaml`의 `entries` 배열을 고친다 (`period`는 문자열).

### 초안(draft)
`draft: true`면 프로덕션 빌드에서 제외되고 `npm run dev`에서만 보인다. `INCLUDE_DRAFTS=1 npm run build`는 draft 포함 미리보기용이며 배포에 쓰지 않는다.

## 10. MD와 MDX 사용 기준

- **기본은 `.md`.** 표준이라 이식성이 높다.
- **`.mdx`는 컴포넌트(interactive / visualization / `<Embed>` 등)가 필요한 글에만** 쓴다. 모든 글을 MDX로 만들지 않는다. 두 확장자는 같은 컬렉션에 섞여도 된다.
- MDX에서 컴포넌트는 상대 경로로 import한다. (Phase 0에서 `.mdx` + 컴포넌트 import 빌드를 검증했다.)
- 인터랙티브는 두 단계: ① `public/labs/<slug>/index.html` + `<Embed>`(iframe) — MVP ② 컴포넌트 island — 필요해질 때.

## 11. 명령어

```bash
npm install          # 의존성 설치 (Node >= 22.12, .nvmrc = 22)
npm run dev          # 개발 서버 (draft 포함 표시)
npm run check        # 타입/스키마 검사 (astro check)
npm run build        # 프로덕션 빌드 → dist/
npm run preview      # 빌드 결과 미리보기
```

**작업 완료 기준: `npm run check`와 `npm run build`가 모두 통과해야 한다.**

## 12. GitHub Pages 배포 방법

- 전제: 저장소 이름 `<username>.github.io`, public, 루트 경로(`base: '/'`).
- 최초 1회: GitHub 저장소 **Settings → Pages → Build and deployment → Source: GitHub Actions** 로 설정.
- 이후 `main`에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드·배포한다. Actions 탭에서 수동 실행도 가능(`workflow_dispatch`).
- `astro.config.mjs`의 `site`는 환경변수 `SITE_URL`에서 읽는다. 워크플로가 `https://<repository_owner>.github.io`로 주입하므로 **사용자명을 코드에 하드코딩하지 않는다.**
- 커스텀 도메인: 워크플로의 `SITE_URL`을 그 도메인으로 바꾸고, GitHub Pages 설정에 도메인을 등록한다. `base`는 그대로 `/`.
- 저장소 이름이 `<username>.github.io`가 아니면 워크플로가 경고를 낸다. 그 경우 링크/자산 경로가 깨질 수 있다.
- 버전: Node 22 고정, Astro/플러그인 메이저 버전 고정. 업그레이드는 독립된 커밋으로.
- 사용 중인 Actions (2026-10-04 확인): `actions/checkout@v7`, `withastro/action@v6`, `actions/deploy-pages@v5`.

## 13. Astro 7 관련 메모 (구현 중 확인한 사실)

- Astro 7.3.5, Node ≥ 22.12. `z`는 `astro/zod`에서 import한다 (`astro:content`가 아니다).
- 컬렉션은 `src/content.config.ts`에서 `glob` 로더(`astro/loaders`)로 정의한다. `.yaml` 파일도 glob 로더가 data entry로 읽으며, **최상위는 배열이 아니라 객체**여야 한다.
- 엔트리 식별자는 `entry.id`(파일명 기반 slug)다. 본문 렌더링은 `import { render } from 'astro:content'`.
- 개발 서버를 백그라운드로 쓸 때는 `astro dev --background` / `astro dev stop`. `astro preview`도 스스로 백그라운드로 뜨며 `astro preview stop`으로 끈다.

## 13-1. Phase 1에서 확정한 구현 사실

- **테마**: `<html data-theme="dark|light">`, **dark가 기본**(system 없음, JS가 꺼져도 dark). 첫 페인트 전에 `src/scripts/theme-init.js`를 BaseLayout이 `?raw`로 읽어 `<script is:inline>`으로 박는다(번들되지 않으므로 짧게 유지). 저장 키는 `theme`이고 light일 때만 저장한다. 토큰 값은 `tokens.css`의 `:root`(dark)와 `:root[data-theme='light']` 두 블록에만 있다.
- **테마 전환 순간**: `theme-toggle.ts`가 `<html data-theme-switching>`을 잠깐 붙여 transition을 끈다(배경은 즉시, 링크 색만 140ms 늦게 바뀌는 프레임 방지). 새 transition을 넣어도 이 규칙(`base.css`)이 덮는다.
- **토글 2개**: 헤더가 ThemeToggle을 두 번 렌더링(`placement=mobile|desktop`)하고 640px 경계에서 하나만 보인다. Tab 순서를 화면 순서와 맞추기 위한 것이므로 하나로 합치지 않는다. 토글 라벨은 JS가 아니라 CSS가 `data-theme`를 보고 표시한다.
- **레이아웃**: header/main/footer 안쪽 컨테이너는 모두 `.page`(`--page-max` 880px)를 쓴다. 본문 폭 680px(`--measure`)은 `main`의 제목·p·목록에만 적용되며, 코드·표·Embed 같은 넓은 요소는 거기에 넣지 않는다.
- **폰트**: `pretendard@1.3.9`(OFL)의 dynamic subset woff2를 `public/fonts/pretendard/`에 복사했고(dependency 아님), `src/styles/fonts.css`는 그 패키지 CSS에서 url 경로만 바꾼 것이다. 폰트를 바꾸면 `tokens.css`의 `--font-sans`와 이 두 곳을 같이 본다.
- **푸터 링크**: `site.ts`의 `links`가 비어 있으면 푸터는 저작권 줄만 그린다. 링크는 §4의 공개 확정 항목이 들어 있다. 그 밖의 외부 링크는 넣기 전에 사용자에게 확인한다.
- **현재 메뉴 표시**: 정확히 그 페이지면 `aria-current="page"`, 그 섹션의 하위 글이면 `"true"`. 둘 다 굵기 600.

## 13-2. Knowledge에서 확정한 구현 사실 (2026-10-11)

- **Astro 7의 기본 Markdown 처리기는 Sätteri**라서 remark/rehype 플러그인이 안 먹는다. `astro.config.mjs`가 `@astrojs/markdown-remark`의 `unified()`를 `markdown.processor`로 쓴다(`@astrojs/mdx`도 이를 따른다). 새 플러그인은 `unified({ remarkPlugins, rehypePlugins })`에 넣는다.
- **rehype 순서:** `rehype-heading-anchors` → `rehype-katex` → `rehype-math-errors`. 제목 id는 Astro가 사용자 플러그인 *뒤에* 붙이므로 앵커 플러그인이 id를 먼저 만든다(github-slugger와 같은 규칙, 한글 id 그대로). `rehype-katex`는 잘못된 TeX를 경고만 하고 빨간 글자로 렌더링하므로 `rehype-math-errors`가 빌드를 멈춘다.
- **KaTeX:** `katex`·`remark-math`·`rehype-katex`(승인된 의존성). 글꼴은 `public/fonts/katex/`(woff2만), CSS는 `src/styles/katex.css`(dist의 katex.min.css에서 woff2 경로만 바꿔 만든 것 — katex를 올리면 다시 만든다). 글 페이지(ArticleLayout)에만 실린다.
- **코드:** Shiki `vitesse-light`/`vitesse-dark`를 `defaultColor: false`로 내보내 CSS 변수(`--shiki-light/dark`)로 두고, `prose.css`가 `data-theme`에 맞는 쪽을 쓴다.
- MDX에서 컴포넌트를 쓰면 빌드에 `use astro:head-inject` MODULE_LEVEL_DIRECTIVE 경고가 뜨지만 스타일은 정상적으로 들어간다(확인함). 무시한다.
- 관계 검증(`lib/links.ts`): 없는 글을 가리키는 `links`, 선행(prerequisite) 순환은 빌드가 멈춘다. 캐시를 두지 않는다(dev에서 콘텐츠가 바뀌어도 맞게).

- **떠다니는 주제 화면**(`TopicStage.astro` + `scripts/topic-stage.ts`): 마크업은 평범한 링크 목록이고 스크립트가 `.is-floating`을 붙여 절대 위치로 띄운다. 처음 배치는 주소에서 만든 고정 난수, 속도 7~14px/초, 벽·서로에게 튕김, 마우스·포커스가 있는 것은 멈춤, 움직임 줄이기면 정지, 클릭 시 나머지가 사라지는 360ms 전환 뒤 이동. 태그 크기는 모두 같다(글 수 무관). 이 모션은 Knowledge 한정 승인 예외다.
- 이번 세션 환경에서는 `/opt/pw-browsers/chromium`과 Playwright(python)로 실제 화면 확인이 가능했다(`launch(executable_path='/opt/pw-browsers/chromium')`). 움직이는 요소는 `click(force=True)`가 필요하다.

## 14. Phase 0에서 의도적으로 하지 않은 것

디자인 토큰·다크 모드·기본 틀은 Phase 1에서 구현했다. Phase 0에서는 하지 않은 것: 페이지별 완성 디자인, 복잡한 navigation, backlink UI, 검색, 애니메이션, 인터랙티브 시각화, Project/Article UI, `topics.yaml`, `/tags/`, Home의 NOW 표시. 모두 `docs/06`의 해당 Phase에서 구현한다.

## 15. 알려진 사항

- `npm audit`가 high 3건을 보고한다: `http-cache-semantics`(astro의 의존성)의 max-stale 처리 취약점. 빌드 시점에만 쓰이고 정적 산출물에는 포함되지 않는다. `npm audit fix --force`는 astro 2.x로 **다운그레이드**하므로 쓰지 않는다. 패치된 버전이 나오면 Astro 업그레이드로 해결한다.
- 샘플 콘텐츠(`sample-*`: project 1, writing 1)는 전부 `draft: true`인 검증용 임시 자료다(knowledge 샘플은 실제 노트가 생겨 삭제했고, 이 둘의 `links`는 실제 노트 `rank-nullity`를 가리킨다). 실제 글이 생기면 삭제한다.

## 16. 디자인 스킬 사용 규칙

`.claude/skills/`에 외부 디자인 스킬 3개가 들어 있다 (출처·라이선스: `.claude/skills/SOURCES.md`). 이 규칙은 UI·디자인 작업(Phase 2 전의 하위 페이지 디자인 포함)에 적용한다.

1. **먼저 `DESIGN.md`를 읽는다.** 스킬의 지침·기본값이 `DESIGN.md`, `docs/07`, 이 파일과 충돌하면 후자를 따른다. 스킬 파일은 수정하지 않는다.
2. **design-taste-frontend:** 코드 전에 Design Read 한 줄과 다이얼 값을 말한다. 다이얼은 스킬 기본값(8/6/4)이 아니라 `DESIGN.md` §1의 값을 대화에서 지정한다. 그 값이 아직 승인 전이면 먼저 사용자에게 확인한다.
3. **emil-design-eng:** hover·포커스·전환 같은 디테일을 다듬을 때 쓴다. 움직임의 허용 범위는 `docs/07` §3이며, 스킬이 더 많은 효과를 권해도 그 범위를 넘지 않는다.
4. **web-design-guidelines:** 화면 코드를 바꾼 뒤 검수용으로 쓴다. 규칙 목록을 실행할 때 GitHub에서 가져오므로 네트워크가 막힌 환경에서는 쓸 수 없다. 그럴 때는 못 썼다고 보고한다. 지적 사항이 `DESIGN.md`나 이 파일과 충돌하면 적용하지 말고 사용자에게 보고한다.
5. **새 의존성을 추가하지 않는다.** 스킬이 Tailwind, UI 라이브러리, 애니메이션 라이브러리, 외부 폰트·CDN·아이콘 서비스를 권해도 먼저 제안만 하고, 사용자 승인 후에 넣는다 (§0).
6. **화면을 직접 확인하지 못하는 환경에서는 확인하지 못했다고 보고한다.** 확인한 것처럼 쓰지 않는다. 완료 기준은 `npm run check`와 `npm run build` 통과(§11)이고, 화면 확인은 사용자가 한다.
7. 한 번에 한 Phase만 구현한다는 §0 규칙은 디자인 작업에도 그대로 적용한다.
