# personal-site

Personal Website + Knowledge Garden + Portfolio + Writing. (Astro 7 · GitHub Pages)

작업 기준은 [`CLAUDE.md`](./CLAUDE.md), 설계 문서는 [`docs/`](./docs).

## 로컬 실행

```bash
nvm use            # Node 22 (.nvmrc), 최소 22.12
npm install
npm run dev        # http://localhost:4321  (draft 콘텐츠도 보임)
npm run check      # 타입/스키마 검사
npm run build      # dist/ 생성 (draft 제외)
npm run preview    # 빌드 결과 확인
```

## 배포 (GitHub Pages)

1. 저장소 이름을 `<username>.github.io`로 만들고 public으로 둔다.
2. `Settings → Pages → Source`를 **GitHub Actions**로 설정한다.
3. `main`에 push하면 `.github/workflows/deploy.yml`이 빌드·배포한다.

## 글 추가

`src/content/{knowledge,projects,writing}/<slug>.md`를 만든다. 필드와 규칙은 `CLAUDE.md` 9절.
