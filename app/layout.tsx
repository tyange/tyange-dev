import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const monaspace = localFont({
  variable: "--font-monaspace",
  display: "swap",
  src: [
    {
      path: "./fonts/monaspace-neon/monaspace-neon-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const pretendard = localFont({
  variable: "--font-pretendard",
  display: "swap",
  src: [
    {
      path: "./fonts/pretendard/Pretendard-Thin.subset.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/pretendard/Pretendard-ExtraLight.subset.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/pretendard/Pretendard-Light.subset.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/pretendard/Pretendard-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/pretendard/Pretendard-Medium.subset.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/pretendard/Pretendard-SemiBold.subset.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/pretendard/Pretendard-Bold.subset.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/pretendard/Pretendard-ExtraBold.subset.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/pretendard/Pretendard-Black.subset.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "유태양 | Frontend Developer",
  description: "차분한 인터페이스와 구조적인 프론트엔드 작업을 담은 개발자 포트폴리오.",
};

const rootClassName = [pretendard.variable, monaspace.variable].filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${rootClassName} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
