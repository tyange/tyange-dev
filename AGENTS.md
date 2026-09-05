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
