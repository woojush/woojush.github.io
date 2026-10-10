# .claude/skills: 외부 스킬 사본

이 폴더의 스킬은 외부에서 받은 사본이며, **수정하지 않았다.** 업데이트가 필요하면 원본에서 다시 받아 별도 커밋으로 교체한다.
쓰는 방법과 규칙은 `CLAUDE.md` §16에 있다. 규칙과 스킬의 지침이 충돌하면 `CLAUDE.md`와 `DESIGN.md`가 이긴다.

| 스킬 | 원본 | 받은 커밋 | 라이선스 |
|------|------|-----------|----------|
| `design-taste-frontend` | https://github.com/Leonxlnx/taste-skill (`skills/taste-skill/SKILL.md`) | `717446e07a78` | MIT. `design-taste-frontend/LICENSE`에 원본 사본 |
| `emil-design-eng` | https://github.com/emilkowalski/skills (`skills/emil-design-eng/SKILL.md`) | `e8a175de22ae` | MIT. `emil-design-eng/LICENSE`에 원본 사본 |
| `web-design-guidelines` | https://github.com/vercel-labs/agent-skills (`skills/web-design-guidelines/SKILL.md`) | `063bee94c3f4` | 원본 README는 MIT로 표기. 원본 저장소에 LICENSE 파일은 없음 |

받은 날짜: 2026-10-10.

`web-design-guidelines`는 실행할 때마다 `raw.githubusercontent.com/vercel-labs/web-interface-guidelines`의 규칙 목록을 가져와 적용한다. 그 목록은 이 폴더에 들어 있지 않고, 원본이 바뀌면 검수 기준도 바뀐다.
