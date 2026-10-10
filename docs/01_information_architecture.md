# 01. Information Architecture

> 상태: v0.2 — 승인됨, 최종 결정 반영 (2026-10-04) · 최초 작성 2026-10-04
> 관련 문서: 02_content_model.md (필드 정의), 04_design_system.md (시각 규칙)

---

## 1. 설계 목표

**구조는 바뀌지 않고, 내용만 쌓이는 사이트.**

5~10년 동안 관심 분야, 학교, 직업이 바뀌어도 사이트의 뼈대(메뉴, URL, 콘텐츠 종류)는 한 번도 갈아엎지 않는 것이 목표다. 이를 위해 다섯 가지 원칙을 둔다.

| # | 원칙 | 이렇게 하면 | 이렇게 안 하면 |
|---|------|------------|---------------|
| 1 | 콘텐츠는 **성격**(Knowledge / Project / Writing)으로만 나눈다 | "Military", "University" 같은 시기별 분류가 필요 없음 | 복학하는 순간 "Military" 카테고리가 과거형이 되고 분류 체계를 다시 짜야 함 |
| 2 | **주제는 분류가 아니라 속성**이다 (frontmatter의 `topic`, `tags`) | Robotics가 주력이 되면 `topic`에 값 하나 추가 | 주제가 폴더/메뉴가 되면 주제 개편 = 사이트 개편 |
| 3 | **URL에 주제를 넣지 않는다** (`/knowledge/projection`) | 글을 다른 주제로 옮겨도 링크가 안 깨짐 | `/knowledge/math/linear-algebra/projection` 구조에서는 주제를 옮기는 순간 URL이 바뀌고 외부 링크가 전부 깨짐 |
| 4 | **"현재의 나"는 한 곳(NOW)에만** 적는다 | 나머지 페이지는 시간이 지나도 낡지 않음 | 현재 상태가 About, Home, 글 곳곳에 흩어지면 갱신 누락이 생기고 사이트가 낡아 보임 |
| 5 | **관계는 한 번만 선언**하고 양방향으로 보인다 | 프로젝트 파일에 "이 지식에서 출발"이라고 쓰면 지식 페이지에는 자동으로 "이걸로 만든 것"이 표시됨 | 양쪽에 손으로 링크를 걸면 한쪽을 빼먹고 관계가 어긋남 |

---

## 2. 사이트맵

내비게이션은 **4개 고정**이며 UI 표기는 소문자, UI 라벨은 영어다: `projects` `about` `knowledge` `writing` (최종 결정, 2026-10-10: 외부 방문자가 projects를 먼저 보도록 첫 번째에 두고, home은 메뉴에서 뺐다. 홈은 사이트 이름과 탭 바 가운데 허브로 간다. 탭 바 디자인은 사용자가 직접 수정할 수 있으며 순서·이름은 유지).

| URL | 메뉴 | 역할 | 내용의 출처 |
|-----|------|------|------------|
| `/` | HOME | 현재의 나 (NOW) + 최근 활동 | `data/now.yaml` + 자동 집계 |
| `/about` | ABOUT | 나는 누구인가, 방향, 타임라인 | `content/about.md` + `data/timeline.yaml` |
| `/knowledge` | KNOWLEDGE | 배운 것의 아카이브 (주제 트리) | `content/knowledge/*.md` |
| `/knowledge/[slug]` | | 지식 문서 1개 | 〃 |
| `/projects` | PROJECTS | 만든 것 목록 | `content/projects/*.md` |
| `/projects/[slug]` | | 프로젝트 case study 1개 | 〃 |
| `/writing` | WRITING | 생각을 적은 글 목록 | `content/writing/*.md` |
| `/writing/[slug]` | | 글 1개 | 〃 |
| `/tags/[tag]` | (메뉴 없음) | 태그 하나로 세 종류 콘텐츠를 가로지르는 목록 | 자동 생성 |
| `/404` | | 길 잃었을 때 | — |

**메뉴가 없는 페이지(`/tags/*`)가 있는 이유**: 태그는 "다양한 관점으로 콘텐츠를 연결"하는 수단이므로 페이지는 필요하지만, 메뉴 항목으로 올릴 만큼 독립적인 영역은 아니다. 글 하단의 태그를 눌렀을 때만 도달한다.

---

## 3. 세 개의 축: type · topic · tags

콘텐츠 하나는 세 가지 질문에 각각 답한다. 질문이 다르므로 값이 바뀌는 속도도 다르다.

| 축 | 답하는 질문 | 값의 예 | 누가/어떻게 정함 | 바뀌는 속도 |
|----|------------|---------|-----------------|------------|
| **type** | 이건 어떤 *종류*의 글인가? | knowledge / project / writing | 파일이 놓인 컬렉션(폴더)이 곧 type | **거의 안 바뀜** (사이트의 뼈대) |
| **topic** | *지식 트리*의 어디에 꽂히나? (knowledge 전용) | `mathematics/linear-algebra` | frontmatter `topic` | 가끔 (분야 개편 시) |
| **tags** | 어떤 *다른 글과 느슨하게 엮이나*? | `projection`, `visualization` | frontmatter `tags` | 자주, 자유롭게 |

**왜 topic을 knowledge에만 두나?** Knowledge만 "교과서 목차"처럼 트리 구조가 필요하다. Project와 Writing은 시간순 목록이면 충분하고, 주제로 묶고 싶으면 tags로 충분하다. 트리를 세 군데에 만들면 관리할 것이 세 배가 된다.

---

## 4. 페이지별 구조

### 4.1 HOME

```
┌─────────────────────────────────────────────────────┐
│ WooJu          projects  about  knowledge  writing ◐ │   ← header
├─────────────────────────────────────────────────────┤
│                                                     │
│ WooJu                                               │
│ 한두 문장의 현재 정체성                               │
│                                                     │
│ Now                                  updated 2026-10 │
│   Learning    Linear Algebra → Least Squares → ML   │
│   Building    Personal Knowledge System             │
│   Exploring   (자유 문장)                             │
│   Thinking    (자유 문장)                             │
│                                                     │
│ Selected projects                                   │
│   Projection Visualizer — 한 줄 요약          active │
│                                                     │
│ Recent knowledge                                    │
│   2026-09-24  Projection                    growing │
│   2026-09-10  Orthogonality                    seed │
│                                                     │
│ Recent writing                                      │
│   2026-09-30  (제목)                       reflection │
│                                                     │
└─────────────────────────────────────────────────────┘
```

규칙:

- **NOW만 손으로 편집**한다 (`data/now.yaml`). 나머지(Selected projects, Recent …)는 자동 집계. HOME은 NOW + 최근 활동만 유지한다(2026-10-10 확정).
- **표시 순서: NOW → Selected projects → Recent knowledge → Recent writing.** 외부 방문자에게 만든 것이 먼저 보여야 하기 때문이다(2026-10-10 결정).
- NOW는 `Learning / Building / Exploring / Thinking` 4행으로 시작하되, **행 목록 자체가 데이터**라서 행을 추가/삭제/이름 변경해도 코드를 건드리지 않는다.
- `Selected projects`는 프로젝트 파일의 `featured: true`로 선택한다 (최대 3개 표시).
- 콘텐츠가 아직 없는 섹션은 **섹션 전체를 숨긴다**. 빈 상자나 "Coming soon"을 두지 않는다. (초기에는 NOW와 소개만 보이는 것이 정상)
- 히어로 이미지, CTA 버튼, 통계 숫자, 카드 그리드는 쓰지 않는다.

### 4.2 ABOUT

```
About
  (lead)                    제목 아래 한 줄 소개 (frontmatter `lead`)
  Intro                     이름, 학교·전공, 목표, 현재 상태 (제목 없이 본문 첫 문단)
  Interests                 관심사 묶음 (확정이 아니라 "현재 관심")
  Why this site             이 사이트의 철학
  Path                      data/timeline.yaml (방향이 보이는 이정표)
  Elsewhere                 GitHub, 이메일, LinkedIn (site.ts의 links, 비어 있으면 숨김)
```

구성은 2026-10-10에 사용자가 승인한 안으로 바꿨다. 이전 안(Who I am / Education·Skills / How I learn / What I build / Career direction / Philosophy)은 이력서에 가까워서, "이 사이트를 만든 사람이 누구이고 무엇을 쌓아가는 중인지"를 1분 안에 보여준다는 역할에 맞춰 줄였다. 학력·스킬은 projects와 knowledge가 증거로 대신한다.

규칙:

- About은 **연 1~2회** 고치는 페이지다. 자주 바뀌는 내용은 NOW로 보낸다.
- Timeline은 시간 축의 *방향*을 보여준다. 군 복무는 타임라인의 한 항목일 뿐, 사이트의 주제가 아니다. (브리프 17번 항목 준수)
- 스킬 막대그래프·퍼센트 같은 시각화는 하지 않는다. 상세 이력서도 두지 않는다.
- Elsewhere는 푸터 링크와 같은 데이터(`site.ts`의 `links`)를 쓴다.

### 4.3 KNOWLEDGE

**목록 페이지 (`/knowledge`)**: frontmatter의 `topic` 경로로부터 **트리를 자동 생성**한다.

```
Knowledge

Mathematics
  Linear Algebra
    Projection                          growing   2026-09-24
    Orthogonality                       seed      2026-09-10
  Probability
    ...
Computer Science
  ...
```

- 문서가 0개인 topic은 표시하지 않는다 (콘텐츠가 적을 때 빈 트리가 보이는 것을 방지).
- 표시 이름/순서는 `data/topics.yaml`에서 지정한다. 등록되지 않은 topic도 동작하며, 경로 문자열을 보기 좋게 변환해 표시한다. → **새 분야를 추가할 때 "등록" 절차가 필수가 아니다.**
- 트리 UI는 2단계까지 렌더링한다. 3단계 이상 경로가 와도 깨지지 않고 2단계 아래에 평평하게 모인다.

**문서 페이지 (`/knowledge/[slug]`)**:

```
Mathematics / Linear Algebra            ← topic 경로 (breadcrumb)
Projection
growing · updated 2026-09-24 · #linear-algebra #projection

[본문 + 우측 sticky 목차(TOC)]

Related                                 ← links 선언 + 자동 backlink
  Prerequisite   Orthogonality
  Built          Projection Visualizer  (project)
  Explained in   (writing 제목)
```

- `status` (seed / growing / evergreen)는 지식 정원(garden)의 성숙도 표시다. 처음부터 완성된 글을 요구하지 않기 위한 장치다.

### 4.4 PROJECTS

- **목록**: 제목, 한 줄 요약, status, 기간을 한 줄 행(row)으로. 카드 그리드 사용 안 함.
- **상세**: case study 본문. 상단에 GitHub / Demo 링크. 하단에 "Learned from"(knowledge), "Written about"(writing)이 backlink로 자동 표시.
- 프로젝트 본문의 섹션(Problem, Architecture, What failed …)은 필요한 것만 쓴다. **"What failed"를 쓸 수 있는 자리를 항상 열어두는 것**이 이 사이트의 성격에 맞다.

### 4.5 WRITING

- **목록**: 최신순, 제목 + 날짜 + `kind`(technical / essay / career / learning / reflection) 텍스트.
- MVP에서는 kind 필터 페이지를 만들지 않는다. 글이 20~30편을 넘어 목록에서 찾기 어려워질 때 추가한다.
- Knowledge와의 구분: **Knowledge는 "배운 것(What I learned)", Writing은 "내 생각(What I think)"**. 헷갈릴 때의 판별 질문은 *"이 글은 틀릴 수 있는 의견을 담고 있는가?"* 담고 있으면 Writing.

---

## 5. 관계 모델: Learn → Build → Explain → Reflect

브리프의 흐름을 사이트의 실제 표면(페이지)과 연결하면 다음과 같다.

| 단계 | 하는 일 | 사이트에서의 결과물 | 연결은 어떻게 선언하나 |
|------|---------|--------------------|----------------------|
| Learn | 공부 | **Knowledge** 문서 | (출발점) |
| Build | 만들기 | **Project** case study | 프로젝트 frontmatter의 `links`에 출발점 knowledge를 적음 |
| Explain | 설명하기 | **Writing** (kind: technical) | 글 frontmatter의 `links`에 대상을 적음 |
| Reflect | 돌아보기 | **Writing** (kind: reflection) + NOW의 *Thinking* | 필요하면 `links`, 아니면 독립 |

### 구체적 예: Projection 하나가 세 군데로 퍼지는 과정

1. **Learn** — `content/knowledge/projection.md` 작성. `topic: mathematics/linear-algebra`.
2. **Build** — `content/projects/projection-visualizer.md` 작성. frontmatter에 `links: [{type: knowledge, slug: projection, rel: builds-on}]`를 한 줄 추가.
   → **결과**: `/knowledge/projection` 페이지 하단 Related에 "Built: Projection Visualizer"가 **자동으로** 나타난다. knowledge 파일은 수정하지 않았다.
3. **Explain** — `content/writing/why-projection-matters.md` 작성. `links`에 knowledge와 project를 적음.
   → **결과**: Knowledge 페이지와 Project 페이지 양쪽 하단에 이 글이 자동 표시된다.
4. **Reflect** — NOW의 *Thinking*을 갱신하고, 필요하면 reflection 글을 쓴다.

이 구조에서 사용자가 하는 일은 "파일 3개 작성 + links 한두 줄"이 전부이고, 양방향 표시는 빌드 시 계산된다. (구현 방식은 02, 05 문서 참고)

---

## 6. URL 정책

| 규칙 | 내용 | 이유 |
|------|------|------|
| slug는 파일명 | `projection.md` → `/knowledge/projection` | 파일명 = URL이라 추적이 쉬움 |
| slug는 영문 소문자-하이픈 | 한글 slug 사용 안 함 | 공유 시 percent-encoding으로 URL이 길고 깨져 보이는 것을 방지 |
| 한 번 공개한 slug는 바꾸지 않는다 | 불가피하면 Astro `redirects` 설정에 옛 URL → 새 URL을 추가 | 외부에서 건 링크 보존 |
| 폴더/주제는 URL에 반영하지 않는다 | 위 원칙 3 | topic 개편에 안전 |
| trailing slash 정책은 구현 시 하나로 통일 | | SEO 중복 방지 |

---

## 7. 확장 규칙 (언제 구조를 바꾸는가)

**새 메뉴를 추가하는 조건** — 아래를 *모두* 만족할 때만:

1. 기존 세 type(Knowledge / Project / Writing)에 담기지 않는 콘텐츠가 **10개 이상** 실제로 쌓였고,
2. 방문자(미래의 나 포함)가 기존 메뉴에서 그것을 **찾기 어렵다**고 느낄 때.

예: 읽은 책 기록이 쌓이면 먼저 Writing의 `kind: learning`이나 tag로 시작해 보고, 위 조건을 넘으면 그때 type을 추가한다.

**새 분야가 생길 때(예: Robotics)**: 메뉴 변경 없음. `topic: robotics/...` 문서를 쓰기 시작하면 Knowledge 트리에 자동으로 나타난다. 필요하면 `topics.yaml`에 표시 이름과 순서만 추가.

**분야를 버릴 때**: 문서는 그대로 두고, `topics.yaml`에서 순서만 내리거나 그냥 둔다. 삭제할 필요가 없다.

---

## 8. 하지 않는 것

- 메뉴 6개 이상, 드롭다운 메뉴
- 시기/상황(군 복무, 학부, 취업)별 최상위 분류
- 하나의 글을 여러 type에 동시에 속하게 하는 것 (type은 정확히 하나)
- Home의 자동 슬라이더, 방문자 수, 통계 위젯
- 콘텐츠가 없는데 미리 만들어 두는 빈 섹션/빈 페이지
