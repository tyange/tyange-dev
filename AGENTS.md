# SolidStart here is unusually new — verify, don't recall

`@solidjs/start` 2.x는 Vinxi/Nitro 래퍼를 걷어낸 Vite 네이티브 재작성판이라 흔히 아는
"SolidStart(`app.config.ts` + vinxi)" 구조와 다르다. 설정은 전부 `vite.config.ts`
하나에 있고, prerender는 `nitro/vite`의 `nitro()` 플러그인 옵션으로 넘긴다.

`nitro`는 베타 채널(`3.0.YYMMDD-beta`)로 매우 빠르게 나온다 — `package.json`에 고정된
버전을 함부로 내리지 말 것. `3.0.260610-beta`(한때 공식 템플릿 기본값)는
`static`/`nitro.static: true` 조합에서 서버 번들링 단계가
`rolldownOptions.input should not be an html file when building for SSR` 에러로
죽는 버그가 있었다(`.output/public` 프리렌더 자체는 정상 생성되지만 빌드 exit code가
1이 됨). `3.0.260903-beta` 이상에서 확인상 해결됨. `bun run build`가 exit 0인지,
그리고 실제로 `.output/public/`에 예상한 라우트 수만큼 `index.html`이 생겼는지
반드시 둘 다 확인한다 — 한쪽만 보고 판단하지 말 것.

이 버그는 우리만 겪은 게 아니라 GitHub에 공개적으로 기록된 회귀다:
- 근본 원인 이슈: [`nitrojs/nitro#3843`](https://github.com/nitrojs/nitro/issues/3843)
  "Static preset doesn't work" — Nitro의 Vite 빌더(`src/build/vite/prod.ts`)가
  `nitro.options.static`을 확인 안 하고 서버 번들을 무조건 빌드하려 해서, 서버
  엔트리가 없는 static 프리셋에서 Vite가 `index.html`을 SSR 엔트리로 오인하고
  거부하는 게 원인. Rolldown/Rollup 빌더엔 이미 있던 `if (!nitro.options.static)`
  가드가 Vite 빌더에만 빠져 있었다.
- SolidStart에서의 재현: [`solidjs/solid-start#2288`](https://github.com/solidjs/solid-start/issues/2288)
  — `@solidjs/start 2.0.0` + **`nitro 3.0.260610-beta`**(우리가 처음 걸렸던 바로 그
  버전) + `vite 8.2.1` 조합에서 우리와 정확히 같은 증상(프리렌더는 성공, 그 다음
  "Nitro 환경 빌드" 단계에서만 실패)이 박제돼 있다.
- 같은 근본 원인이 Nuxt에서도 재현됨: [`nuxt/nuxt#36023`](https://github.com/nuxt/nuxt/issues/36023)
  — Nitro 자체 버그이지 SolidStart나 Nuxt 어느 한쪽의 문제가 아니라는 뜻. Nuxt
  쪽 이슈는 "우리 문제 아님, nitrojs/nitro#3843 중복"으로 닫혔다.
- 수정 PR: [`nitrojs/nitro#4509`](https://github.com/nitrojs/nitro/pull/4509)
  "fix(vite): skip server bundle for static presets" — **2026-08-20 머지**.
  `builder.build()` 호출 전에 static 프리셋 여부를 확인하는 가드를 추가하고
  전용 테스트(`test/vite/static-preset.test.ts`)를 신설했다.
- npm 배포 이력(`npm view nitro time`) 확인 결과 `3.0.260610-beta`(6/10 배포) 다음
  베타가 `3.0.260903-beta`(9/3 배포)이고 그 사이엔 배포가 없었다 — PR이 8/20에
  머지됐으니 **9/3 배포판이 수정을 포함한 첫 배포**다. 우리가 실측(빌드 성공/실패)으로
  찾은 버전 경계와 정확히 일치한다.

새 API를 쓰기 전엔 `node_modules/nitro/dist/types/index.d.mts`,
`node_modules/nitro/dist/vite.d.mts`, `node_modules/@solidjs/router/dist/*.d.ts`를
직접 열어 실제 타입을 확인한다. 훈련 데이터에 없는 버전이라 기억에 의존하면 틀린다.

## 데이터 페칭: `query()`에 `"use server"`를 쓰지 않는다

공식 예제(`docs.solidjs.com/solid-router/data-fetching/how-to/preload-data`)도
`"use server"` 없이 `query()`를 쓴다. `"use server"`를 붙이면 그 함수는 RPC로
컴파일되어 브라우저에서 `/_server?id=...&args=...` 같은 GET을 던지는데, 이 사이트는
서버가 없는 순수 정적 배포라 그 경로를 받아줄 곳이 없어 404로 죽는다(클라이언트 사이드
이동에서만 발생 — 최초 전체 페이지 로드는 프리렌더된 HTML이라 문제없다).

**`tyange-cms-api`는 브라우저가 보내는 요청을 원천 차단한다** — `Origin` 헤더가 붙은
요청은 그 값이 무엇이든(자기 도메인 `https://tyange.com`이어도) 403을 반환한다
(`curl -H "Origin: ..." https://tyange.com/api/cms/...`로 직접 확인함). 즉 브라우저가
이 API를 직접 호출하는 방법은 CORS를 맞춰도 존재하지 않는다.

그래서 데이터 흐름은 이렇게 나뉜다:
- `src/lib/home-data.ts`, `src/lib/post-data.ts` — CMS를 실제로 호출하는 순수 함수.
  Node 컨텍스트(빌드/프리렌더)에서만 호출된다 → Origin 헤더가 없어 통과.
- `src/routes/api/home.json.ts`, `src/routes/api/posts/[id].ts` — 그 함수를 감싸는
  파일 기반 API 라우트. `vite.config.ts`의 `nitro.prerender.routes`에 명시해 빌드 시
  nitro가 실제로 이 경로를 요청해 응답을 `.output/public/api/**`에 정적 파일로 굽는다
  (Nitro 자체 기능 — HTML이 아닌 응답은 경로 그대로 저장된다).
- 각 라우트 컴포넌트(`src/routes/index.tsx`, `src/routes/posts/[id].tsx`)의
  `query()`는 `isServer`(from `solid-js/web`)로 분기한다: 서버(자신의 프리렌더)에서는
  위 순수 함수를 직접 호출하고, 브라우저(클라이언트 사이드 이동)에서는 그 결과가 구워진
  정적 파일을 `fetch()`한다 — `tyange-cms-api`를 브라우저가 두드릴 일이 아예 없다.

**`isServer` 분기 안이어도 `getHomeData`/`getPostData`는 반드시 동적 `import()`로
불러온다 — 정적으로 import하면 `if (isServer)`가 있어도 그 모듈(과 그 안의
unified/rehype/shiki 전체)이 클라이언트 번들에 실제로 들어가 브라우저가 그 청크를
다운로드한다(실제로 네트워크 탭에서 확인함 — `isServer`가 빌드 타임에 상수로
치환·제거되지 않는다). `await import("@/lib/post-data")`처럼 동적으로 감싸야
클라이언트에서 그 코드 경로가 실행되지 않아 청크 자체가 요청되지 않는다.**

동적 라우트 API 파일명은 `[id].ts`로 쓴다 — `[id].json.ts`처럼 파라미터 세그먼트에
리터럴 확장자를 붙이면 solid-router 파일 라우팅이 매칭하지 못해 프리렌더가 404로
실패한다(확인됨). URL에 `.json`을 꼭 붙이고 싶으면 정적 라우트(`home.json.ts`처럼
파라미터가 없는 파일)에서만 쓴다.

`shiki`(`@shikijs/rehype`)를 쓸 땐 `engine: createJavaScriptRegexEngine()`
(from `shiki/engine/javascript`)을 넘긴다 — 기본 oniguruma 엔진은 WASM을 fetch로
불러오는데 그 경로가 이런 정적 배포 환경에서 항상 안전한 건 아니다(자세한 근거는
`src/lib/markdown.ts` 주석 참고). `langs`도 실제 쓰는 언어로 좁혀 불필요한 청크를
줄인다.

## 디자인 시스템 적용 후: `.prose`엔 `dark:prose-invert`를 꼭 같이 켠다

`@tyange-labs/design-system`의 `dark-auto.css`로 다크 모드를 넣은 뒤,
`prose prose-neutral`로 렌더되는 CMS 마크다운(인트로, 글 본문)의 `<h1>`/`<li>` 같은
요소가 다크 배경에서 거의 안 보이는 문제가 있었다 — Tailwind Typography의
`prose-neutral` 기본 색(`--tw-prose-headings` 등)은 라이트 전용 고정값이라
`prose-p:text-tl-fg`처럼 특정 태그만 오버라이드해도 나머지 태그는 그대로 남는다.
`dark:prose-invert`를 같이 켜면 Tailwind v4 기본 `dark:`(= `prefers-color-scheme`)
조건에서 전체 프로즈 팔레트가 다크에 맞게 뒤집힌다 — `dark-auto.css`와 트리거
조건이 정확히 같아서 그대로 맞아떨어진다.
