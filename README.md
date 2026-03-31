# tyange-dev

`tyange-dev`는 `tyange-cms-api`에서 포트폴리오 문서와 개발 글을 받아 보여주는 개인 개발자 사이트입니다.  
단순 소개 페이지보다, **블로그·CMS·API·대시보드로 이어지는 tyange 운영 흐름의 공개 진입점**을 목표로 합니다.

## 프로젝트 목적

- 포트폴리오와 경력 정보를 하나의 정적 사이트로 제공
- `tyange-cms-api`에 저장된 포트폴리오 문서와 `dev` 태그 글을 공개 화면에 반영
- 개인 프로젝트 전반의 구조와 맥락을 한 화면에서 읽히도록 정리

## 현재 제공 기능

- 포트폴리오 초안 데이터 기반 기본 렌더링
- CMS API 포트폴리오 문서 병합 표시
- `dev` 태그 글 목록 조회
- 주요 프로젝트, 경력, 현재 작업 섹션 노출
- 정적 export 기반 배포

## 기술 스택

- Runtime / Package Manager: Bun
- Framework: Next.js 16 (App Router, TypeScript)
- UI: React 19, Tailwind CSS 4
- Data Source: `tyange-cms-api`
- Deployment: GitHub Actions + static export

## 환경 변수 예시

`.env.local`

```env
NEXT_PUBLIC_TYANGE_CMS_API_BASE=https://tyange.com/api/cms
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

정적 export 결과물은 `out/` 디렉터리에 생성됩니다.

## 배포

배포 워크플로는 `.github/workflows/main.yml`에 있습니다.

필수 GitHub Actions secrets:

- `HOST`
- `USER_NAME`
- `PRIVATE_SSH_KEY`

필수 GitHub Actions variables:

- `DEPLOY_PATH`

선택 GitHub Actions variable:

- `NEXT_PUBLIC_TYANGE_CMS_API_BASE`

