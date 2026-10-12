// Content collections. 스키마의 기준 문서는 docs/02_content_model.md 이다.
//
// 원칙
// - `type`은 frontmatter 필드가 아니다. 폴더(= 컬렉션)가 type을 결정한다.
// - `topic`은 taxonomy/navigation/filtering용 metadata일 뿐, URL 생성에 쓰지 않는다.
//   URL은 파일명(slug)에서만 만들어진다 → topic을 바꿔도 URL은 바뀌지 않는다.
// - 필수 필드는 최소로, 나머지는 선택 필드로 둔다.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// kebab-case 소문자 (예: linear-algebra)
const kebab = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case 소문자여야 한다 (예: linear-algebra)');

// 슬래시 경로 (예: mathematics/linear-algebra)
const topicPath = z
  .string()
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/,
    'topic은 kebab-case 경로여야 한다 (예: mathematics/linear-algebra)',
  );

// 다른 entry와의 관계. 한쪽에만 선언하고 반대쪽(backlink)은 빌드 시 계산한다 (Phase 3).
const link = z.object({
  type: z.enum(['knowledge', 'project', 'writing']),
  slug: z.string(),
  rel: z.enum(['related', 'prerequisite', 'builds-on', 'explains']).default('related'),
});

// 세 컬렉션 공통 필드
const common = {
  title: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  description: z.string().optional(),
  tags: z.array(kebab).default([]),
  links: z.array(link).default([]),
  // draft: 배포(프로덕션 빌드)에 포함하지 않는다. 저장소는 public이므로 "비공개"가 아니다.
  draft: z.boolean().default(false),
  // 글의 언어. 기본 한국어. 다국어 라우팅/번역은 구현하지 않는다.
  lang: z.enum(['ko', 'en']).default('ko'),
};

const contentPattern = '**/*.{md,mdx}';

const knowledge = defineCollection({
  loader: glob({ pattern: contentPattern, base: './src/content/knowledge' }),
  schema: z.object({
    ...common,
    topic: topicPath,
    // 색상 코드로 쓰지 않는다. 텍스트로만 표시한다.
    status: z.enum(['seed', 'growing', 'evergreen']),
    // 같은 topic 안에서의 표시 순서(작을수록 앞). 없으면 선행 관계 → 날짜순. 교재 순서로 읽히게 하고 싶을 때만 쓴다.
    order: z.number().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: contentPattern, base: './src/content/projects' }),
  schema: z.object({
    ...common,
    summary: z.string(),
    status: z.enum(['active', 'paused', 'done', 'archived']),
    period: z
      .object({
        start: z.coerce.date(),
        end: z.coerce.date().optional(),
      })
      .optional(),
    repo: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
    // `cover`(대표 이미지)는 이미지 처리를 다루는 Phase 5에서 추가한다.
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: contentPattern, base: './src/content/writing' }),
  schema: z.object({
    ...common,
    // 글의 형식 4종(2026-10-11 사용자 결정, 블로그 글을 보고 도출): 시 / 산문 / 에세이 / 책갈피. 값·행성 대응은 src/data/writing-forms.ts
    form: z.enum(['poem', 'prose', 'essay', 'bookmark']),
  }),
});

// About 본문 (singleton). 파일은 src/content/about.md 한 개.
const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    // 페이지 제목 아래 한 줄 소개 (선택)
    lead: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

// 사이트 단위 데이터 (src/data/*.yaml). 코드가 아니라 데이터다.
const now = defineCollection({
  loader: glob({ pattern: 'now.yaml', base: './src/data' }),
  schema: z.object({
    updated: z.coerce.date(),
    items: z.array(z.object({ label: z.string(), text: z.string() })),
  }),
});

const timeline = defineCollection({
  loader: glob({ pattern: 'timeline.yaml', base: './src/data' }),
  schema: z.object({
    entries: z.array(
      z.object({
        period: z.string(),
        title: z.string(),
        items: z.array(z.string()).optional(),
      }),
    ),
  }),
});

// Knowledge 목록의 소개 문구와 topic 표시 이름·순서. 등록하지 않은 topic도 동작한다(경로를 보기 좋게 바꿔 표시).
const topics = defineCollection({
  loader: glob({ pattern: 'topics.yaml', base: './src/data' }),
  schema: z.object({
    lead: z.string().optional(),
    topics: z
      .array(
        z.object({
          path: topicPath,
          name: z.string(),
          description: z.string().optional(),
          // 떠다니는 태그 색. 비우면 부모의 색을 따르고, 최상위가 비면 stone
          color: z.enum(['walnut', 'moss', 'slate', 'clay', 'sand', 'plum', 'stone']).optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { knowledge, projects, writing, about, now, timeline, topics };
