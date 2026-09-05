// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

// next/font/local이 해주던 폰트 CSS 변수 주입은 이제 src/app.css의 @font-face +
// :root 선언으로 대체됐다(더 이상 <html>에 동적 클래스를 걸 필요가 없다).
export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="ko" class="h-full antialiased">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
