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
