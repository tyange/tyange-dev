// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

// next/font/local이 해주던 폰트 CSS 변수 주입은 이제 src/app.css의 @font-face +
// :root 선언으로 대체됐다(더 이상 <html>에 동적 클래스를 걸 필요가 없다).
//
// 가장 많이 쓰는 두 굵기(400 본문 / 700 제목·헤드라인)만 <link rel="preload">로 먼저
// 받는다. 이렇게 안 하면 브라우저가 app.css를 받아 파싱한 뒤에야 @font-face URL을 알게
// 돼서 폴백 표시 시간이 길어진다. 500/600 등 나머지는 preload 없이 swap으로 들어오되,
// app.css의 메트릭 매칭 "Pretendard fallback" 덕분에 교체가 눈에 안 띈다.
// (?url = Vite가 빌드 시 해시된 실제 자산 경로 문자열로 바꿔줌. app.css의 url()과
//  같은 파일이라 같은 자산으로 dedupe돼 preload가 그대로 재사용된다.)
import pretendardRegular from "./fonts/pretendard/Pretendard-Regular.subset.woff2?url";
import pretendardBold from "./fonts/pretendard/Pretendard-Bold.subset.woff2?url";

const preloadedFonts = [pretendardRegular, pretendardBold];

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="ko" class="h-full antialiased">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          {preloadedFonts.map((href) => (
            <link rel="preload" as="font" type="font/woff2" href={href} crossorigin="anonymous" />
          ))}
          {assets}
        </head>
        <body class="min-h-full flex flex-col">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
