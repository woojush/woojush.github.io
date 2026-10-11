# 02. Content Model

> 상태: v0.2 — 승인됨, 최종 결정 반영 (2026-10-04) · 최초 작성 2026-10-04
> 이 문서는 "어떤 파일에 어떤 필드가 들어가는가"를 정의한다. 구현 시 이 표가 그대로 빌드 시점 검증 스키마(Zod)가 된다.

---

## 1. 큰 그림

콘텐츠는 두 종류다.

| 종류 | 형태 | 예 | 편집 빈도 |
|------|------|----|----------|
| **Entry** (글 단위) | Markdown 파일 1개 = 1 entry | knowledge, project, writing | 계속 늘어남 |
| **Data** (사이트 단위) | YAML 파일 1개 = 사이트의 한 부분 | now, timeline, topics | 가끔 수정 |

```text
src/content/
  knowledge/   *.md   ← type: knowledge
  projects/    *.md   ← type: project
  writing/     *.md   ← type: writing
  about.md            ← About 본문 (singleton)
src/data/
  now.yaml            ← HOME의 NOW
  timeline.yaml       ← ABOUT의 Timeline
  topics.yaml         ← Knowledge 트리의 표시 이름/순서 (선택)
```

`type`은 **파일이 어느 폴더에 있느냐**로 결정된다. frontmatter에 `type:`을 따로 쓰지 않는다. (브리프 10번의 예시 YAML에는 `type`이 있지만, 폴더와 필드가 둘 다 있으면 서로 어긋날 수 있다. 폴더 하나를 진실의 원천으로 삼는 편이 안전하다. → 결정 사항에 포함)

---

## 2. 공통 필드

세 컬렉션 모두에 적용된다.

| 필드 | 필수 | 타입 | 설명 |
|------|:---:|------|------|
| `title` | ✔ | string | 제목 |
| `date` | ✔ | date (`YYYY-MM-DD`) | 최초 작성일. 바뀌지 않음 |
| `updated` | | date | 의미 있는 마지막 수정일. 없으면 `date`를 사용. Knowledge는 이 값으로 "최근 갱신" 정렬 |
| `description` | | string | 목록과 SEO에 쓰이는 한 줄 요약. 없으면 목록에는 생략 |
| `tags` | | string[] | 자유 태그. kebab-case 소문자 (`linear-algebra`) |
| `links` | | object[] | 다른 entry와의 관계 (아래 4절) |
| `draft` | | boolean (기본 false) | true면 프로덕션 빌드(배포)에서 제외, 개발 서버에서만 보임. **저장소는 public이므로 소스에서는 누구나 볼 수 있다 — 비공개 수단이 아니다** |
| `lang` | | `ko` \| `en` | 글의 언어. **기본값 `ko`** (최종 결정). 다국어 라우팅/번역은 구현하지 않음 |

---

## 3. 컬렉션별 필드

### 3.1 knowledge

| 필드 | 필수 | 타입 | 설명 |
|------|:---:|------|------|
| `topic` | ✔ | string (슬래시 경로) | 지식 트리 위치. 예: `mathematics/linear-algebra` |
| `status` | ✔ | `seed` \| `growing` \| `evergreen` | 성숙도. seed = 메모 수준, growing = 작성 중, evergreen = 한동안 안 고쳐도 되는 상태 |
| `order` | | number | 같은 topic 안의 표시 순서(작을수록 앞). 없으면 선행(prerequisite) 관계 → 날짜 오래된 순. 교재 순서로 읽히게 하고 싶을 때만 쓴다 (2026-10-11) |

```yaml
---
title: Projection
topic: mathematics/linear-algebra
tags: [linear-algebra, projection, machine-learning]
date: 2026-09-24
updated: 2026-09-24
status: growing
description: 벡터를 부분공간 위로 내리는 연산과 그 기하학적 의미
---
```

**topic을 경로 문자열로 두는 이유**:

- 폴더로 트리를 만들면 주제 이동 = 파일 이동 = URL 변경이다. 문자열이면 **한 줄 수정으로 이동**하고 URL은 그대로다.
- 깊이 제한이 없어서 `mathematics` 한 단계로 시작했다가 나중에 `mathematics/linear-algebra`로 세분해도 된다. (이미 쓴 글은 그대로 둬도 동작)
- 트리 자체는 어디에도 저장하지 않는다. **모든 문서의 topic을 모아 빌드할 때 계산**한다. 그래서 "트리 정의 파일을 수정하는 것을 깜빡해서 글이 안 보이는" 일이 생기지 않는다.

### 3.2 projects

| 필드 | 필수 | 타입 | 설명 |
|------|:---:|------|------|
| `summary` | ✔ | string | 한 줄 요약 (목록에 표시) |
| `status` | ✔ | `active` \| `paused` \| `done` \| `archived` | 프로젝트 상태 |
| `period` | | `{ start: date, end?: date }` | 진행 기간 |
| `repo` | | URL | GitHub 등 |
| `demo` | | URL | 데모 링크 |
| `featured` | | boolean | true면 HOME의 Selected projects 후보 |
| `cover` | | image path | (선택) 대표 이미지. 없어도 목록은 정상 |

```yaml
---
title: Projection Visualizer
summary: 벡터 투영을 직접 조작하며 확인하는 인터랙티브 도구
status: active
period: { start: 2026-10-01 }
repo: https://github.com/<user>/projection-visualizer
tags: [python, visualization, mathematics]
date: 2026-10-01
featured: true
links:
  - { type: knowledge, slug: projection, rel: builds-on }
---
```

기술 스택은 별도 필드를 두지 않고 `tags`에 함께 넣는다. 필드가 적을수록 쓰기 쉽고, 태그 페이지에서 "python" 하나로 knowledge·project·writing을 함께 볼 수 있다.

### 3.3 writing

| 필드 | 필수 | 타입 | 설명 |
|------|:---:|------|------|
| `kind` | ✔ | `technical` \| `essay` \| `career` \| `learning` \| `reflection` | 글의 성격 |

`kind`는 열린 목록이 아니라 **스키마에 적힌 enum**이다. 새 kind가 필요하면 스키마 한 줄을 추가한다. 오타(`reflexion`)는 빌드가 막아준다.

---

## 4. 관계 (`links`)

```yaml
links:
  - type: knowledge        # knowledge | project | writing
    slug: projection       # 대상 파일명(확장자 제외)
    rel: builds-on         # 선택. 생략하면 related
```

| `rel` 값 | 의미 | 대상 페이지에 표시되는 문구 (자동) |
|----------|------|-------------------------------|
| `related` (기본) | 일반 관련 | Related |
| `prerequisite` | 이걸 먼저 알아야 함 | Prerequisite → (반대쪽) Leads to |
| `builds-on` | 이 지식을 바탕으로 만듦 | Built (반대쪽) / Learned from (이쪽) |
| `explains` | 이 대상을 설명하는 글 | Explained in (반대쪽) |

핵심 규칙: **관계는 한쪽에만 선언한다. 반대쪽 표시는 빌드 시 계산한다(backlink).**

빌드는 다음을 검사한다.

- `slug`가 실제로 존재하는지 → 오타가 있으면 **빌드 실패**, 어떤 파일의 어떤 링크인지 에러에 표시
- `type`과 `slug`의 조합이 맞는지 (knowledge에 없는 slug를 `type: knowledge`로 지정)

> 구체적 효과: 6개월 뒤 파일 이름을 `projection.md` → `orthogonal-projection.md`로 바꿨다면, 이 이름을 가리키던 모든 `links`가 **빌드 단계에서 에러로 나타난다.** 사이트가 올라간 뒤에 깨진 링크를 발견하는 일이 없다.

---

## 5. Data 파일

### 5.1 `now.yaml`

```yaml
updated: 2026-10-04
items:
  - label: Learning
    text: Linear Algebra → Least Squares → Machine Learning
  - label: Building
    text: Personal Knowledge System
  - label: Exploring
    text: (자유롭게)
  - label: Thinking
    text: What does it mean to become an AI Engineer?
```

- `items`는 배열이므로 행을 추가·삭제·이름 변경해도 코드 수정이 없다. (예: 1년 뒤 `Reading` 행을 추가)
- `updated`는 Home의 "updated …" 표시에 사용된다. NOW를 고칠 때 이 날짜도 같이 고친다. (자동화는 이후 단계에서 고려)
- 과거의 NOW는 지우지 않고 **git 히스토리에 남는다.** 별도 아카이브 기능은 만들지 않는다. (나중에 `/now/archive`가 필요하면 git 로그에서 생성 가능)

### 5.2 `timeline.yaml`

```yaml
entries:
  - period: "2026"
    title: 수학 · 프로그래밍 · AI 기초 (군 복무 중)
    items: [Mathematics, Programming, AI fundamentals]
  - period: "2028"
    title: 대학 복학
    items: [AI Engineering, Projects, Research]
  - period: "2030+"
    title: AI Engineering career
```

> v0.2 변경: 최상위를 배열이 아니라 `entries:` 객체로 감쌌다. Astro의 data 컬렉션(glob 로더)은 파일 하나를 객체 하나로 읽기 때문이다.

- 항목 순서 = 표시 순서. `items`는 선택.
- `period`는 문자열이다 (`2030+`, `2026.10 – 2028.02` 같은 표기를 허용하기 위해).

### 5.3 `topics.yaml` (선택)

```yaml
mathematics:
  title: Mathematics
  order: 1
mathematics/linear-algebra:
  title: Linear Algebra
  order: 1
```

- 이 파일이 **없거나 비어 있어도** 트리는 동작한다. 있으면 표시 이름·순서·설명만 덮어쓴다.
- 등록되지 않은 topic이 문서에 쓰이면 경로 문자열(`linear-algebra`)을 자동 변환(`Linear Algebra`)하여 표시한다.

---

## 6. 본문 작성 가이드 (스키마가 아니라 관례)

### 6.1 Knowledge 문서의 권장 섹션

브리프 7번의 10개 섹션을 **선택 목록**으로 쓴다. 강제 항목은 없다.

| 섹션 | 쓰는 경우 | 비고 |
|------|----------|------|
| Definition | 정의가 명확한 개념 | 한두 문장 |
| Why | 왜 필요한지 | 이 개념이 없으면 어떤 문제가 안 풀리는가 |
| Intuition | 직관 | 그림/예시 |
| Mathematical formulation | 수식이 있을 때 | LaTeX |
| Derivation / Background | 유도가 중요할 때 | 접어두기(details) 가능 |
| Example | 숫자 예제 | |
| AI / Engineering relevance | ML과 연결될 때 | 이 사이트에서 Knowledge와 Project를 잇는 핵심 섹션 |
| My understanding | 내 말로 다시 쓰기 | **status가 growing 이상이면 권장** |
| Related concepts | 자동 Related와 별개로 본문에서 설명이 필요할 때 | |
| References | 출처 | |

**본인 노트 형식 매핑 (2026-10-11):** 위 목록은 아래 흐름으로 쓰는 것을 기본으로 한다 — *왜 필요한가*(Why) → *핵심 아이디어*(Intuition) → *정의·성질*(Definition, Mathematical formulation, Derivation) → *예시*(Example) → *막히는 지점*(`<Callout kind="stuck">`, MDX). 개념마다 같은 틀을 쓰면 나중에 다시 펼쳐 볼 때 찾기 쉽다.

관례:

- **topic 정하기:** 글 1편에 topic 하나, `분야/세부분야` 2단계. 분야는 학문 분과(mathematics, computer-science, machine-learning, robotics, neuroscience…), 세부분야는 교재 목차·분과 단위(linear-algebra, probability…). 시기·프로젝트·군 복무 같은 기준은 쓰지 않는다. 판별 질문: "이 개념을 어느 분과(교재의 어느 장)에서 배웠나?" 여러 분야에 걸치면 배운 곳 한 군데에 두고 다른 분야와는 `links`·`tags`로 잇는다.
- **쓰지 않는 섹션은 제목째로 지운다.** 빈 섹션 제목을 남기지 않는다. seed 단계의 글은 Definition과 My understanding 두 개뿐이어도 정상이다.
- 섹션 제목은 H2(`##`)만 쓴다. 우측 목차(TOC)는 H2·H3로 만들어지므로 제목 이름이 곧 목차 이름이 된다.

### 6.2 Project 문서 (case study)

권장 섹션: Overview · Problem · Motivation · Architecture · Implementation · What I learned · What failed · Future improvements. (GitHub·Demo 링크는 frontmatter의 `repo`, `demo`가 헤더에 표시되므로 본문에 쓰지 않는다.)

### 6.3 Writing

섹션 규칙 없음. 자유 형식. `kind`만 지정.

### 6.4 본문에서 쓸 수 있는 요소

| 요소 | 쓰는 법 | 비고 |
|------|---------|------|
| 수식 | `$...$` 인라인, `$$...$$` 블록 | KaTeX |
| 코드 | ```` ```python ```` | 빌드 시 문법 강조 |
| 다이어그램 | ```` ```mermaid ```` | |
| 이미지 | 같은 폴더/`src/assets`에서 상대 경로 | |
| 인터랙티브 | `<Embed src="/labs/projection/" />` (MDX 파일에서) | 03, 05 문서 참고 |

기본 확장자는 `.md`. MDX(`.mdx`)는 컴포넌트(`<Embed>`)를 쓸 때만 쓴다. 두 확장자는 같은 컬렉션에 섞여도 된다.

---

## 7. 변경 정책 (스키마가 진화하는 방법)

| 변경 | 영향 | 대응 |
|------|------|------|
| 선택 필드 추가 | 기존 글 영향 없음 | 스키마에 한 줄 추가 |
| enum 값 추가 (`kind: tutorial`) | 기존 글 영향 없음 | 스키마에 한 줄 추가 |
| 필수 필드 추가 | 기존 글이 모두 빌드 실패 | **가능하면 선택 필드 + 기본값**으로 추가. 필수가 꼭 필요하면 일괄 치환 스크립트 한 번 |
| 필드 이름 변경 | 기존 글이 모두 실패 | 일괄 치환 + 스키마 수정 (실패 목록이 빌드 에러로 나오므로 누락 없음) |
| 새 컬렉션(type) 추가 | 01 문서의 확장 규칙 충족 시 | 폴더 + 스키마 + 목록 페이지 |

**콘텐츠 파일은 어떤 컴포넌트 이름도 알지 못한다**(MDX의 `<Embed>` 제외). 디자인을 전면 개편해도 `content/`는 한 줄도 바뀌지 않는 것이 이 모델의 목표다.
