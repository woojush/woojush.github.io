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
- **메인 인트로 확대·전환 구현됨** (2026-10-10): 메인 문구와 작은 문장이 점점 커지고, 그 확대 속도에 맞춰 별이 날아온다. 작은 문장이 3초 커진 뒤(약 8초) 확대가 최대로 빨라지며 약 10초에 `site.hero.next`(`/about/`)로 자동 이동한다(자동 이동은 메인 한정 예외, `prefers-reduced-motion`·뒤로 가기에서는 넘어가지 않음). 세부는 `docs/07` "메인 인트로", 시간표는 `src/scripts/intro-timeline.ts`.
- GitHub·이메일·LinkedIn은 공개 확정, `site.ts`의 `links`에 추가했다(푸터와 About의 Elsewhere가 같이 쓴다).
- 다음은 **하위 페이지별 디자인 설계** 단계이고, 그 뒤에 **Phase 2** (글 읽기 파이프라인)다. 사용자 승인 전에는 Phase 2로 넘어가지 않는다.
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
- **topic** — knowledge 전용 트리 위치. 예: `mathematics/linear-algebra`
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

- **실명 'Shin WooJu'는 공개하기로 확정**했다(2026-10-10, `src/data/site.ts`의 `name`). 사진은 아직 확정 전이라 placeholder/미사용이다.
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

디자인 v2에서 추가됨: `docs/07`, `src/components/home/HomeHero.astro`, `src/scripts/scene.ts`(별 장면), `src/scripts/home-intro.ts`(시계·화면 이동), `src/scripts/intro-timeline.ts`(확대 곡선).
About에서 추가됨: `src/components/about/Timeline.astro`, `src/lib/content.ts`의 `getAbout`·`getTimeline`, about 스키마의 선택 필드 `lead`.
Phase 1에서 추가됨: `src/components/layout/`(Header, Nav, Footer, ThemeToggle), `src/styles/{tokens,fonts,base}.css`, `src/scripts/{theme-init.js,theme-toggle.ts}`, `public/fonts/pretendard/`.
이후에 추가될 것: `src/components/{content,home,about,mdx}/`, `src/styles/prose.css`, `src/lib/{topics,links,format}.ts`, `public/labs/`. 구조 명세는 `docs/05`.

## 6. Content model (요약. 기준은 `docs/02` + `src/content.config.ts`)

공통: `title`(필수) `date`(필수) `updated` `description` `tags[]` `links[]` `draft`(기본 false) `lang`(기본 ko)

| 컬렉션 | 추가 필드 |
|--------|-----------|
| knowledge | `topic`(필수, kebab 경로) `status`(필수: `seed` \| `growing` \| `evergreen`) |
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
2. frontmatter 필수: `title`, `date`, `topic`, `status`
3. 본문은 필요한 섹션만 H2로 쓴다 (Definition / Why / Intuition / Mathematical formulation / Derivation / Example / AI·Engineering relevance / My understanding / Related concepts / References). **쓰지 않는 섹션은 제목째로 지운다.**
4. 새 분야는 그냥 `topic: <새분야>/…`로 쓰면 된다. 메뉴·코드 수정 불필요.

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

## 14. Phase 0에서 의도적으로 하지 않은 것

디자인 토큰·다크 모드·기본 틀은 Phase 1에서 구현했다. Phase 0에서는 하지 않은 것: 페이지별 완성 디자인, 복잡한 navigation, backlink UI, 검색, 애니메이션, 인터랙티브 시각화, Project/Article UI, `topics.yaml`, `/tags/`, Home의 NOW 표시. 모두 `docs/06`의 해당 Phase에서 구현한다.

## 15. 알려진 사항

- `npm audit`가 high 3건을 보고한다: `http-cache-semantics`(astro의 의존성)의 max-stale 처리 취약점. 빌드 시점에만 쓰이고 정적 산출물에는 포함되지 않는다. `npm audit fix --force`는 astro 2.x로 **다운그레이드**하므로 쓰지 않는다. 패치된 버전이 나오면 Astro 업그레이드로 해결한다.
- 샘플 콘텐츠 3개(`sample-*.md`)는 전부 `draft: true`인 스키마 검증용 임시 자료다. 실제 글이 생기면 삭제한다.

## 16. 디자인 스킬 사용 규칙

`.claude/skills/`에 외부 디자인 스킬 3개가 들어 있다 (출처·라이선스: `.claude/skills/SOURCES.md`). 이 규칙은 UI·디자인 작업(Phase 2 전의 하위 페이지 디자인 포함)에 적용한다.

1. **먼저 `DESIGN.md`를 읽는다.** 스킬의 지침·기본값이 `DESIGN.md`, `docs/07`, 이 파일과 충돌하면 후자를 따른다. 스킬 파일은 수정하지 않는다.
2. **design-taste-frontend:** 코드 전에 Design Read 한 줄과 다이얼 값을 말한다. 다이얼은 스킬 기본값(8/6/4)이 아니라 `DESIGN.md` §1의 값을 대화에서 지정한다. 그 값이 아직 승인 전이면 먼저 사용자에게 확인한다.
3. **emil-design-eng:** hover·포커스·전환 같은 디테일을 다듬을 때 쓴다. 움직임의 허용 범위는 `docs/07` §3이며, 스킬이 더 많은 효과를 권해도 그 범위를 넘지 않는다.
4. **web-design-guidelines:** 화면 코드를 바꾼 뒤 검수용으로 쓴다. 규칙 목록을 실행할 때 GitHub에서 가져오므로 네트워크가 막힌 환경에서는 쓸 수 없다. 그럴 때는 못 썼다고 보고한다. 지적 사항이 `DESIGN.md`나 이 파일과 충돌하면 적용하지 말고 사용자에게 보고한다.
5. **새 의존성을 추가하지 않는다.** 스킬이 Tailwind, UI 라이브러리, 애니메이션 라이브러리, 외부 폰트·CDN·아이콘 서비스를 권해도 먼저 제안만 하고, 사용자 승인 후에 넣는다 (§0).
6. **화면을 직접 확인하지 못하는 환경에서는 확인하지 못했다고 보고한다.** 확인한 것처럼 쓰지 않는다. 완료 기준은 `npm run check`와 `npm run build` 통과(§11)이고, 화면 확인은 사용자가 한다.
7. 한 번에 한 Phase만 구현한다는 §0 규칙은 디자인 작업에도 그대로 적용한다.
