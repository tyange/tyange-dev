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
    headline: "차분한 화면 뒤에 단단한 구조를 설계합니다.",
    summary:
      "겉으로는 조용하고 매끈하지만, 안쪽에는 분명한 구조와 운영 흐름이 살아 있는 화면을 만드는 일을 좋아합니다. 최근에는 Nuxt 블로그, Rust 기반 CMS API, 내부 CMS, Solid 대시보드를 하나의 퍼블리싱 흐름으로 연결하는 작업을 이어가고 있습니다.",
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
  guiding_principle:
    "미니멀은 비워 두는 일이 아니라, 느슨한 부분을 끝까지 다듬고 난 뒤에 남는 결과라고 생각합니다.",
  featured_projects: [
    {
      slug: "tyange-blog",
      title: "tyange-blog",
      period: "Nuxt 4 / 콘텐츠 플랫폼",
      summary:
        "마크다운 작성 경험, RSS 생성, 태그 필터링, CMS API 기반 재배포 흐름까지 연결한 개인 블로그입니다. 글을 쓰는 경험과 읽는 경험이 모두 가볍고 자연스럽게 이어지도록 다듬었습니다.",
      stack: ["Nuxt 4", "TypeScript", "Tailwind CSS 4", "Nuxt MDC", "Pinia"],
      highlights: [
        "GitHub Actions를 통해 Lightsail에 배포되고, CMS에서 콘텐츠가 바뀌면 RSS와 정적 결과물이 함께 다시 생성됩니다.",
        "마크다운 본문, 코드 블록, 포스트 메타데이터가 읽는 흐름을 방해하지 않도록 화면 밀도를 조절했습니다.",
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
        "포스트, 인증, 이미지 업로드, RSS 연동, 예산 관리, 알림, 그리고 이 dev 페이지를 위한 포트폴리오 데이터까지 담당하는 Rust 기반 API입니다.",
      stack: ["Rust", "Poem", "SQLx", "SQLite", "JWT"],
      highlights: [
        "콘텐츠 운영 기능과 개인 운영 도구를 하나의 API 안에서 자연스럽게 공존하도록 설계했습니다.",
        "공개 포스트가 바뀌면 블로그 재배포가 이어지도록 후속 흐름까지 고려해 구성했습니다.",
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
        "블로그 운영과 개인 관리 흐름에 맞춘 전용 CMS 클라이언트입니다. 포스트 작성, 이미지 업로드, 태그 관리, 예산 관련 작업이 하나의 관리자 화면 안에서 이어집니다.",
      stack: ["Nuxt 4", "Vue 3", "TypeScript", "Tailwind CSS 4"],
      highlights: [
        "범용 CMS보다는 실제 운영자 한 사람의 동선에 맞춘 좁고 빠른 경험을 목표로 만들었습니다.",
        "포스트 CRUD, 이미지 업로드, 태그 조회, 예산 관리가 한 인터페이스 안에서 자연스럽게 연결됩니다.",
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
        "JWT 기반 관리 기능을 빠르게 다루기 위한 운영 대시보드입니다. 활성 예산, 소비 기록, API 키, 알림, 피드 관리 같은 기능을 가볍게 다룰 수 있게 만들었습니다.",
      stack: ["SolidJS", "TypeScript", "Vite", "CMS API"],
      highlights: [
        "빠른 실행감과 운영 효율을 우선하는 화면으로 구성했고, 배포와 환경 변수 검증까지 포함해 안정성을 챙겼습니다.",
        "CMS와 같은 백엔드 계약을 공유하지만, 실제 사용 맥락은 다른 별도의 작업 화면으로 정리했습니다.",
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
      "제가 만드는 사이드 프로젝트는 단순한 단일 페이지에 머물지 않는 경우가 많습니다. 콘텐츠 API, 내부 CMS, 퍼블릭 블로그, 운영 대시보드가 서로 연결되어 있어야 하고, 그 연결감까지 하나의 경험처럼 느껴져야 한다고 생각합니다.",
      "그래서 저는 컴포넌트 자체보다도 퍼블리싱 흐름, 배포 과정의 마찰, 데이터 계약, 그리고 화면의 리듬을 결정하는 작은 상호작용까지 함께 봅니다.",
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
      "이 섹션은 `/posts/search-with-tags?include=dev` 응답을 그대로 사용합니다. CMS API에 연결되지 않으면 포트폴리오 초안만 우선 표시됩니다.",
  },
};
