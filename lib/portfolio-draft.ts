import type { PortfolioDocument } from "@/lib/cms-api";

export const portfolioDraft: PortfolioDocument = {
  slug: "dev",
  version: 1,
  identity: {
    name: "TYANGE",
    role: "프론트엔드 개발자",
    location: "서울, 대한민국",
    availability: "브랜딩과 제품 완성도가 중요한 작업을 선별해 진행합니다",
    email: "usun16@gmail.com",
    github_url: "https://github.com/tyange",
    blog_url: "https://blog.tyange.com",
    velog_url: "https://velog.io/@tyange",
  },
  hero: {
    eyebrow: "프론트엔드 개발자 / CMS 중심 사이드 프로젝트 / 서울",
    headline: "보이는 것 너머의 구조를 오래 다듬습니다.",
    summary:
      "블로그, CMS, API, 대시보드를 하나의 운영 흐름으로 연결하는 프론트엔드 작업을 합니다.",
    primary_cta: {
      label: "GitHub 보기",
      url: "https://github.com/tyange",
    },
    secondary_cta: {
      label: "블로그 보기",
      url: "https://blog.tyange.com",
    },
  },
  highlight_cards: [
    {
      label: "집중 영역",
      title: "콘텐츠 구조와 운영 흐름까지 포함한 프론트엔드 시스템 설계",
    },
    {
      label: "기술 스택",
      title: "Next.js, Nuxt, Solid, Rust, Poem, Tailwind CSS, SQLite",
    },
  ],
  metrics: [
    {
      value: "2",
      unit: "개사",
      description: "프론트엔드 개발자로 재직한 이력",
    },
    {
      value: "3+",
      unit: "년",
      description: "서비스 UI와 내부 도구를 설계하고 구현한 시간",
    },
  ],
  guiding_principle:
    "미니멀은 비워 두는 일이 아니라, 느슨한 부분을 끝까지 다듬고 난 뒤에 남는 결과라고 생각합니다.",
  featured_projects: [
    {
      slug: "tyange-blog",
      title: "tyange-blog",
      period: "Nuxt 4 / 콘텐츠 플랫폼",
      summary:
        "마크다운 발행, RSS, 태그 필터링, CMS 연동 재배포까지 이어지는 개인 블로그입니다.",
      stack: ["Nuxt 4", "TypeScript", "Tailwind CSS 4", "Nuxt MDC", "Pinia"],
      highlights: [
        "마크다운 포스트, 코드 블록, 태그 필터, RSS 피드를 직접 구성했습니다.",
        "CMS 변경 후 블로그 재배포와 RSS 갱신이 이어지도록 운영 흐름을 연결했습니다.",
      ],
      links: [
        {
          label: "저장소",
          url: "https://github.com/tyange/tyange-blog",
        },
        {
          label: "서비스",
          url: "https://blog.tyange.com",
        },
      ],
    },
    {
      slug: "tyange-cms-api",
      title: "tyange-cms-api",
      period: "Rust / Poem / 콘텐츠 인프라",
      summary:
        "포스트, 인증, 업로드, 알림, 예산, 포트폴리오 문서를 다루는 Rust API입니다.",
      stack: ["Rust", "Poem", "SQLx", "SQLite", "JWT"],
      highlights: [
        "JWT 인증, 이미지 업로드, 포스트 CRUD, 포트폴리오 CRUD를 직접 구현했습니다.",
        "RSS poller, Web Push, 예산 API, API Key 기반 호출 흐름을 함께 운영합니다.",
      ],
      links: [
        {
          label: "저장소",
          url: "https://github.com/tyange/tyange-cms-api",
        },
      ],
    },
    {
      slug: "tyange-cms",
      title: "tyange-cms",
      period: "Nuxt 4 / 내부 CMS",
      summary:
        "블로그 운영과 개인 관리 작업을 한 화면에서 처리하는 전용 CMS입니다.",
      stack: ["Nuxt 4", "Vue 3", "TypeScript", "Tailwind CSS 4"],
      highlights: [
        "Google 로그인, 관리자 로그인, 포스트 CRUD, 이미지 업로드를 구현했습니다.",
        "태그 조회, 예산 관리, 카드 사용내역 엑셀 업로드 흐름을 연결했습니다.",
      ],
      links: [
        {
          label: "저장소",
          url: "https://github.com/tyange/tyange-cms",
        },
      ],
    },
    {
      slug: "tyange-dashboard",
      title: "tyange-dashboard",
      period: "Solid / 운영 대시보드",
      summary:
        "PWA와 Web Push를 실험하기 위해 만든 Solid 기반 대시보드로, 실제로 브라우저에서 Web Push를 수신할 수 있도록 구성했습니다.",
      stack: ["SolidJS", "TypeScript", "Vite", "CMS API"],
      highlights: [
        "PWA, Service Worker, Web Push 구독/해제, RSS 구독 관리 화면을 구현했습니다.",
        "Google 로그인, 예산 대시보드, 소비 기록, API Key 관리 화면을 연결했습니다.",
      ],
      links: [
        {
          label: "저장소",
          url: "https://github.com/tyange/tyange-dashboard",
        },
      ],
    },
  ],
  about: {
    eyebrow: "소개",
    headline: "화면의 완성도와 그 뒤의 구조가 함께 좋아지는 일을 선호합니다.",
    paragraphs: [
      "단일 페이지보다 연결된 제품 흐름을 선호합니다. 블로그, CMS, API, 대시보드가 하나의 운영 경험처럼 이어져야 한다고 생각합니다.",
      "화면 구현뿐 아니라 데이터 계약, 배포 흐름, 실제 운영 동선까지 같이 설계하는 편입니다.",
    ],
    services: [
      "제품 화면과 콘텐츠 화면을 위한 프론트엔드 아키텍처 설계",
      "디자인 시스템을 고려한 UI 구현",
      "내부 툴 및 CMS 운영 화면 제작",
      "API 계약을 중심으로 한 프론트엔드 협업",
    ],
    strengths: [
      "거친 아이디어를 구조적인 화면 체계로 정리하는 일",
      "프론트엔드 완성도를 백엔드 현실과 연결하는 일",
      "개인 프로젝트를 처음부터 끝까지 밀도 있게 완성하는 일",
    ],
  },
  writing: {
    eyebrow: "기록",
    title: "dev 태그가 붙은 글",
    description:
      "`/posts/search-with-tags?include=dev` 응답을 그대로 표시합니다.",
  },
  career: {
    summary_label: "경력",
    summary_value: "3년 8개월",
    companies: [
      {
        company: "(주)미트박스글로벌",
        period: "2026.01 - 재직 중",
        employment_type: "정규직",
        role: "프론트엔드 개발",
        position: "",
        items: [
          {
            title: "레거시 구조 현대화",
            bullets: [
              "기존 화면 구조와 스타일 체계를 점진적으로 정리하며, 더 나은 유지보수와 확장이 가능하도록 모던한 프론트엔드 방식으로 개선했습니다.",
              "공용 컴포넌트 분리, 스타일 구조 재정비, API 응답 기준 화면 개편을 통해 레거시 의존도를 줄이는 작업을 이어가고 있습니다.",
              "관련기술: Vue3, Nuxt, TypeScript, React, Vite",
            ],
          },
          {
            title: "AI 활용 협업",
            bullets: [
              "AI에게 작업을 맡길 때 파일별 변경 사항, 필드 매핑, 현재 동작과 예외 상황을 먼저 구조화해 전달하는 방식으로 협업 효율을 높이고 있습니다.",
              "Claude Code에 Figma, Playwright, Atlassian MCP를 연결해 디자인 확인, 코드 작성, 브라우저 검증, 이슈 문서화까지 하나의 흐름으로 처리하는 작업 방식을 구축했습니다.",
              "새로운 도구를 빠르게 업무에 적용하고, 프롬프트를 구조적으로 정리해 전달하는 방식으로 구현 시간과 시행착오를 줄이는 데 강점이 있습니다.",
              "관련기술: Claude Code, Figma MCP, Playwright MCP, Atlassian MCP, 프롬프트 설계",
            ],
          },
        ],
      },
      {
        company: "(주)오토위니",
        period: "2022.08 - 2025.12",
        employment_type: "정규직",
        role: "프론트엔드 개발",
        position: "주임",
        items: [
          {
            title: "단독 프론트엔드 운영",
            bullets: ["팀원 전원 퇴사 후 혼자서 서비스(React SPA) 유지보수 및 신규 기능 개발"],
          },
          {
            title: "레거시 현대화 프로젝트",
            bullets: [
              "Spring + JSP에서 Vue3(차량 검색), Nuxt(경매 시스템)로 마이그레이션 수행",
              "CRA + JS에서 Vite + TS 전환으로 빌드 속도 대폭 개선",
              "jQuery 바닐라 JS 리팩토링",
              "관련기술: Vue3, Nuxt, React, JavaScript, TypeScript, CRA, Vite, Spring, JSP",
            ],
          },
          {
            title: "팀 생산성 개선",
            bullets: [
              "Vite 도입으로 개발 환경 개선",
              "TypeScript 전환으로 안정성 확보",
              "Jenkins CI / CD 파이프라인 구성",
              "관련기술: Vite, TypeScript, Jenkins",
            ],
          },
        ],
      },
    ],
  },
};
