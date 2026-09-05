# tyange-dev

`tyange-dev`는 `tyange-cms-api`에서 포트폴리오 문서와 개발 글을 받아 보여주는 개인 개발자 사이트입니다.  
단순 소개 페이지보다, **블로그·CMS·API·대시보드로 이어지는 tyange 운영 흐름의 공개 진입점**을 목표로 합니다.

## 프로젝트 목적

- 포트폴리오와 경력 정보를 하나의 정적 사이트로 제공
- `tyange-cms-api`에 저장된 포트폴리오 문서와 `dev` 태그 글을 공개 화면에 반영
- 개인 프로젝트 전반의 구조와 맥락을 한 화면에서 읽히도록 정리

## 현재 제공 기능

- CMS API 포트폴리오 문서(`intro`, `career`, `featured_projects`)를 단일 페이지에 Bento Grid로 렌더링
- `dev` 태그 글 목록 조회 및 상세 페이지 (`/posts/[post_id]`)
- Intro 섹션 마크다운 렌더링 (raw HTML + sanitize)
- 작업 섹션 4그룹(inert / CMS 시스템 / 개인 사이트 / 기타) 카드 레이아웃
- GitHub 저장소 링크 자동 인식 및 아이콘 처리
- `Promise.allSettled`로 포트폴리오/글 API 조회를 독립 실패 처리 (한쪽이 죽어도 나머지는 렌더)
- 정적 export 기반 배포

## 기술 스택

- Runtime / Package Manager: **Bun**
- Framework: **SolidStart 2** (`@solidjs/start`, Vite 네이티브, `nitro` 프리셋 `static`으로 순수 정적 export)
- UI: Solid 1.x, Tailwind CSS 4
- Markdown: **unified 파이프라인** (`remark-parse` + `remark-gfm` → `rehype-raw` + `rehype-sanitize` + `rehype-shiki`) — CMS에 저장된 마크다운 본문을 raw HTML 허용 + XSS 방지 상태로 렌더. `query()`의 `"use server"` 경계 안에서만 실행해 클라이언트 번들에 섞여 들어가지 않는다
- Icons: `simple-icons` (GitHub SVG 인라인)
- Fonts: Pretendard subset (woff2) + Monaspace Neon, `font-display: swap`
- Data Source: `tyange-cms-api`
- Deployment: GitHub Actions + static export(SCP)

## 환경 변수 예시

`.env.local`

```env
CMS_API_BASE_URL=https://tyange.com/api/cms
```

## 로컬 개발

```bash
bun install
bun dev
```

기본 개발 서버는 `http://localhost:3000`에서 실행됩니다.

## 정적 빌드

```bash
bun run build
```

정적 export 결과물은 `.output/public/` 디렉터리에 생성됩니다.

## 배포

배포 워크플로는 `.github/workflows/main.yml`에 있습니다.

필수 GitHub Actions secrets:

- `HOST`
- `USER_NAME`
- `PRIVATE_SSH_KEY`

필수 GitHub Actions variables:

- `DEPLOY_PATH`

선택 GitHub Actions variable:

- `CMS_API_BASE_URL`

## 주요 설계 결정

- **정적 export(nitro `static` 프리셋)**: 포트폴리오 콘텐츠는 빌드 시점에만 확정되면 충분하므로 Node 서버를 두지 않고 순수 SSG로 처리한다. `vite.config.ts`가 빌드 시점에 `dev` 태그 글 id를 CMS에서 가져와 프리렌더 대상 라우트로 명시하고(`crawlLinks`도 안전망으로 병행), 각 라우트 컴포넌트는 `query()` + `createAsync()`로 그 데이터를 받는다.
- **`Promise.allSettled`로 장애 격리**: 포트폴리오 API와 `dev` 태그 글 조회를 독립적으로 수행해, 하나가 실패해도 나머지 섹션은 정상 렌더한다.
- **unified 마크다운 파이프라인**: CMS 본문에 raw HTML(예: 커스텀 div, 임베드)을 허용하기 위해 `rehype-raw`를 통과시키되, 직후 `rehype-sanitize`로 XSS 차단한다. 코드 하이라이트는 `shiki`로 서버에서 미리 렌더해 클라이언트 JS를 늘리지 않는다.
- **Bento Grid 레이아웃**: "작업" 섹션은 hero(`featured_projects[0]`, CMS에서 순서로 제어) + 2×N 그리드(CMS 시스템, 개인 사이트, 기타)로 구성해 중요도에 따른 시각적 우선순위를 준다.
- **폰트 최적화**: Pretendard는 한국어 subset만 woff2로 번들하고 `font-display: swap`으로 첫 텍스트 페인트 지연을 막는다. `next/font/local`이 하던 등록을 `src/app.css`의 수동 `@font-face`로 대체했다.

