// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

// next/font/local이 해주던 폰트 CSS 변수 주입은 이제 src/app.css의 @font-face +
// :root 선언으로 대체됐다(더 이상 <html>에 동적 클래스를 걸 필요가 없다).
//
// 실제로 쓰는 Pretendard 굵기만 <link rel="preload">로 먼저 받는다. 이렇게 안 하면
// 브라우저가 app.css를 받아 파싱한 뒤에야 @font-face URL을 알게 돼서, 그 사이 첫
// 페인트가 시스템 폰트로 나가고 뒤늦게 Pretendard로 바뀌는 게 보인다.
// (?url = Vite가 빌드 시 해시된 실제 자산 경로 문자열로 바꿔줌. app.css의 url()과
//  같은 파일이라 같은 자산으로 dedupe돼 preload가 그대로 재사용된다.)
import pretendardRegular from "./fonts/pretendard/Pretendard-Regular.subset.woff2?url";
import pretendardMedium from "./fonts/pretendard/Pretendard-Medium.subset.woff2?url";
import pretendardSemiBold from "./fonts/pretendard/Pretendard-SemiBold.subset.woff2?url";
import pretendardBold from "./fonts/pretendard/Pretendard-Bold.subset.woff2?url";

const preloadedFonts = [pretendardRegular, pretendardMedium, pretendardSemiBold, pretendardBold];

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
