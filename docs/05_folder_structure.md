# 05. Folder Structure & Component Architecture

> 상태: v0.2 — 승인됨, 최종 결정 반영 (2026-10-04) · 최초 작성 2026-10-04
> 브리프 16번의 "6. Component Architecture"는 별도 파일이 없어서 이 문서의 4~5절에 포함했다.

---

## 1. 설계 원칙

1. **콘텐츠와 코드를 폴더 수준에서 분리한다.** `src/content/`와 `src/data/`에는 코드가 없고, 나머지에는 글이 없다.
2. **한 파일은 한 가지 역할만** 한다. 거대한 파일이 생기면 쪼갠다 (기준: 컴포넌트 약 150줄, 페이지 약 100줄).
3. **페이지는 얇게, 로직은 `lib/`에.** 페이지 파일은 "무엇을 가져와서 어떤 컴포넌트에 넘기는가"만 적는다.
4. **스타일은 토큰을 거친다.** 컴포넌트 안에 색상·크기 상수를 직접 쓰지 않는다.
5. **파일 이름만 보고 역할을 알 수 있게** 한다.

---

## 2. 폴더 구조

```text
personal-site/
├─ CLAUDE.md                     ← Claude Code가 가장 먼저 읽는 작업 지침 (4절 참고)
├─ README.md                     ← 실행 방법 / 배포 방법 / 콘텐츠 추가 방법 요약
├─ docs/                         ← 이 설계 문서 6개 (01~06). 구현 후에도 기준 문서로 유지
├─ astro.config.mjs              ← Astro 설정 (site/base, 통합, remark/rehype 플러그인)
├─ package.json  .nvmrc          ← 버전 고정
├─ tsconfig.json                 ← strict 모드, `@/` = src/ 별칭
├─ .github/workflows/deploy.yml  ← GitHub Pages 배포
│
├─ public/                       ← 빌드 없이 그대로 서빙되는 정적 파일
│  ├─ fonts/                     ← Pretendard, JetBrains Mono (self-host)
│  ├─ favicon.svg
│  └─ labs/                      ← 단독 HTML 시각화 (글에서 <Embed>로 삽입)
│     └─ projection/index.html
│
└─ src/
   ├─ content.config.ts          ← 컬렉션 정의 + 스키마(02 문서 그대로)
   │
   ├─ content/                   ← ★ 글. 코드 없음
   │  ├─ knowledge/              ← *.md / *.mdx
   │  ├─ projects/
   │  ├─ writing/
   │  └─ about.md
   │
   ├─ data/                      ← ★ 사이트 단위 데이터. 코드 없음
   │  ├─ now.yaml
   │  ├─ timeline.yaml
   │  ├─ topics.yaml             (선택)
   │  └─ site.ts                 ← 사이트 이름, 소개 한 줄, 외부 링크(GitHub 등), 메뉴 목록
   │
   ├─ assets/                    ← 글에서 참조하는 이미지 (빌드 시 최적화됨)
   │
   ├─ pages/                     ← 라우팅 = 파일 위치. 얇게 유지
   │  ├─ index.astro             ← HOME
   │  ├─ about.astro
   │  ├─ 404.astro
   │  ├─ knowledge/
   │  │  ├─ index.astro          ← 지식 트리
   │  │  └─ [...slug].astro      ← 문서 상세
   │  ├─ projects/
   │  │  ├─ index.astro
   │  │  └─ [...slug].astro
   │  ├─ writing/
   │  │  ├─ index.astro
   │  │  └─ [...slug].astro
   │  └─ tags/
   │     └─ [tag].astro
   │
   ├─ layouts/
   │  ├─ BaseLayout.astro        ← <html>, <head>, 테마 초기화, header/footer, 본문 슬롯
   │  └─ ArticleLayout.astro     ← 글 상세 공통: 제목/메타/TOC/본문/Related/prev-next
   │
   ├─ components/
   │  ├─ layout/                 ← 사이트 뼈대
   │  │  ├─ Header.astro
   │  │  ├─ Footer.astro
   │  │  ├─ Nav.astro
   │  │  └─ ThemeToggle.astro
   │  ├─ content/                ← 콘텐츠 표시용 (데이터를 props로 받음)
   │  │  ├─ EntryRow.astro       ← 목록의 한 행 (날짜/제목/상태)
   │  │  ├─ EntryList.astro      ← EntryRow의 묶음
   │  │  ├─ TopicTree.astro      ← 지식 트리
   │  │  ├─ Related.astro        ← links + backlinks 표시
   │  │  ├─ TagList.astro
   │  │  ├─ TableOfContents.astro
   │  │  ├─ ArticleMeta.astro    ← status / updated / tags 한 줄
   │  │  └─ ProjectHeader.astro  ← repo/demo 링크, status, period
   │  ├─ home/
   │  │  └─ NowBlock.astro
   │  ├─ about/
   │  │  └─ Timeline.astro
   │  └─ mdx/                    ← 글 본문(MDX) 안에서 쓰는 컴포넌트
   │     ├─ Embed.astro          ← iframe 시각화
   │     ├─ Callout.astro
   │     └─ Figure.astro
   │
   ├─ lib/                       ← 순수 로직. 화면 코드 없음
   │  ├─ content.ts              ← 컬렉션 조회 헬퍼 (draft 제외, 정렬, 최근 N개, 태그 집계)
   │  ├─ topics.ts               ← topic 경로 → 트리 변환
   │  ├─ links.ts                ← links 해석 + backlink 계산
   │  └─ format.ts               ← 날짜 포맷 등
   │
   ├─ scripts/                   ← 브라우저에서 도는 아주 작은 스크립트
   │  ├─ theme-init.js           ← 첫 페인트 전 실행(인라인)
   │  ├─ theme-toggle.ts
   │  └─ mermaid-loader.ts       ← mermaid 블록이 있을 때만 지연 로드
   │
   └─ styles/
      ├─ tokens.css              ← 색/서체/간격 토큰
      ├─ base.css
      └─ prose.css               ← 글 본문 타이포그래피
```

### 폴더별 역할 한 줄 요약

| 폴더 | 이 폴더를 고치는 경우 | 이 폴더에 없는 것 |
|------|---------------------|------------------|
| `content/` | 글을 쓰거나 고칠 때 | 컴포넌트, 스타일, 로직 |
| `data/` | NOW·타임라인·사이트 정보를 고칠 때 | 글 본문 |
| `pages/` | 새 URL(라우트)이 필요할 때 | 스타일, 복잡한 로직 |
| `components/` | UI 조각을 만들거나 바꿀 때 | 컬렉션 조회 로직 |
| `lib/` | 데이터를 가공하는 규칙을 바꿀 때 | HTML/JSX |
| `styles/tokens.css` | 룩앤필을 바꿀 때 | 레이아웃 로직 |
| `public/labs/` | 새 인터랙티브 시각화를 추가할 때 | 사이트 코드 |

---

## 3. 데이터 흐름

```text
src/content/*.md ──┐
src/data/*.yaml ───┤
                   ▼
            src/lib/content.ts      ← 조회·정렬·draft 제외·태그 집계
            src/lib/links.ts        ← links 해석 + backlink 계산
            src/lib/topics.ts       ← topic 경로 → 트리
                   │
                   ▼
            src/pages/*.astro       ← "무엇을 가져와서 누구에게 넘길지"만 기술
                   │ props
                   ▼
            src/components/**       ← 받은 데이터를 그리기만 함 (직접 조회하지 않음)
                   │
                   ▼
            정적 HTML (+ 극소량의 JS)
```

**컴포넌트가 컬렉션을 직접 조회하지 않는 이유**: 컴포넌트가 데이터를 받아서 그리기만 하면, `EntryRow`를 Home, 태그 페이지, 지식 트리에서 **같은 모양으로 재사용**할 수 있고, 조회 규칙(예: draft 제외)을 바꿀 때 `lib/content.ts` 한 곳만 고치면 된다. 컴포넌트마다 조회를 하면 규칙이 흩어져서 "어떤 목록에는 초안이 보이는" 문제가 생긴다.

---

## 4. 컴포넌트 아키텍처

### 4.1 계층

```text
Layout 계층      BaseLayout ▸ ArticleLayout        (페이지의 틀)
   ▼
Section 계층     NowBlock, TopicTree, Timeline,     (페이지의 한 구역)
                 Related, TableOfContents
   ▼
Atom 계층        EntryRow, TagList, ArticleMeta,    (더 이상 쪼개지지 않는 조각)
                 ThemeToggle, Nav
   ▼
MDX 계층         Embed, Callout, Figure             (글 본문 안에서만 쓰임)
```

위쪽 계층은 아래쪽 계층을 쓸 수 있지만 **그 반대는 안 된다.** (예: `EntryRow`가 `TopicTree`를 import하지 않는다.)

### 4.2 주요 컴포넌트 명세

| 컴포넌트 | 입력(props) | 하는 일 | 하지 않는 일 |
|----------|------------|---------|-------------|
| `BaseLayout` | `title`, `description` | head, 테마 초기화, 헤더/푸터, 본문 슬롯 | 콘텐츠 조회 |
| `ArticleLayout` | entry 메타, 헤딩 목록, backlinks | 제목/메타/TOC/본문/Related/이전·다음 배치 | 본문 렌더링 규칙 (prose.css 담당) |
| `EntryRow` | `title`, `href`, `date`, `trailing`(상태·kind 텍스트) | 한 행 그리기 | 어떤 컬렉션인지 알기 |
| `TopicTree` | topic 트리(노드 배열) | 2단계 트리 렌더링 | topic 경로 파싱 (`lib/topics.ts` 담당) |
| `NowBlock` | `items`, `updated` | 정의 목록 렌더링 | YAML 읽기 |
| `Related` | 관계 목록(`rel`, `type`, `title`, `href`) | `rel`별로 묶어 표시. 비면 렌더링하지 않음 | 관계 계산 |
| `TableOfContents` | 헤딩 배열 | 목차 + 현재 섹션 강조 | |
| `Embed` | `src`, `title`, `height`, `caption?` | iframe + 프레임 + 캡션 | 시각화 내용 |
| `ThemeToggle` | 없음 | dark↔light 전환 (2026-10-10 이후, system 없음) | |

### 4.3 이름 규칙

- 컴포넌트 파일: `PascalCase.astro`. 폴더 이름은 역할(layout/content/home/about/mdx).
- 값/함수: `camelCase`. 타입: `PascalCase`.
- CSS 클래스는 컴포넌트 범위(scoped) 스타일을 기본으로 하고, 전역 스타일은 `styles/`에만 둔다.
- 새 컴포넌트를 만들기 전에 `components/` 하위를 먼저 확인해 중복을 피한다. (CLAUDE.md에 명시)

---

## 5. `CLAUDE.md` 설계

Claude Code로 앞으로 수정하기 쉽게 만드는 핵심 파일이다. 구현 1단계에서 작성하며, 포함할 내용은 다음과 같다.

| 항목 | 내용 | 이것이 주는 효과 |
|------|------|-----------------|
| 프로젝트 한 줄 설명 | 이 사이트의 목적과 3개 type | 작업을 시작할 때마다 맥락을 다시 설명하지 않아도 됨 |
| 폴더 지도 | 위 2절의 요약표 | "어디에 무엇을 넣는가"를 추측하지 않음 |
| 절대 규칙 | ① `content/`에는 코드를 넣지 않는다 ② 색/크기는 토큰만 사용 ③ 컴포넌트에서 컬렉션 직접 조회 금지 ④ 새 메뉴 추가 금지(01 문서 7절 조건 충족 시에만) ⑤ 한 번 공개한 slug 변경 금지 | 흔한 실수를 구조적으로 차단 |
| 작업 레시피 | 6절의 "자주 하는 작업" 표 | 반복 작업을 정해진 절차로 처리 |
| 명령어 | `npm run dev`, `npm run build`, `npm run check` | |
| 검증 규칙 | 변경 후 `npm run build`가 통과해야 완료 | 스키마 검증이 곧 회귀 테스트 역할 |
| 설계 문서 링크 | `docs/01~06` | 결정의 근거를 되돌아볼 수 있음 |

---

## 6. 자주 하는 작업의 절차 (이 구조가 쉬운 이유)

| 하고 싶은 일 | 하는 일 | 건드리지 않는 것 |
|--------------|---------|-----------------|
| 새 지식 문서 쓰기 | `src/content/knowledge/<slug>.md` 만들고 frontmatter 채우기 | 코드 전체 → 트리, 태그 페이지, Home 최근 목록에 자동 반영 |
| NOW 바꾸기 | `src/data/now.yaml` 수정 | 코드 전체 |
| NOW에 `Reading` 행 추가 | `now.yaml`의 `items`에 항목 추가 | 코드 전체 (행이 데이터이므로) |
| 새 분야(Robotics) 시작 | 글에 `topic: robotics/…` 작성 | 메뉴, 코드, 다른 글 |
| 시각화를 글에 넣기 | `public/labs/<slug>/index.html` 추가 → 글(.mdx)에 `<Embed src="/labs/<slug>/" …/>` | 사이트 코드 |
| 포인트 색 바꾸기 | `styles/tokens.css`의 `--accent` 한 줄 | 컴포넌트 |
| 글 간 연결 추가 | 한쪽 frontmatter의 `links`에 한 줄 | 반대쪽 글 |
| 프로젝트를 Home에 노출 | 프로젝트 frontmatter에 `featured: true` | Home 페이지 코드 |
| Mermaid 다이어그램 추가 | 본문에 ```` ```mermaid ```` 블록 | 설정 |
| 새 필드 추가 | `content.config.ts`에 선택 필드 한 줄 | 기존 글 |

---

## 7. 이 구조에서 의도적으로 하지 않는 것

- `components/ui/` 같은 범용 디자인 시스템 라이브러리 폴더 (컴포넌트 수가 적을 때는 과잉)
- 상태 관리 라이브러리
- CSS 프레임워크 (토큰 + 컴포넌트 범위 CSS로 충분)
- 별도의 `utils/` 잡동사니 폴더 (`lib/`에 역할별 파일로 둔다)
- monorepo 구성
