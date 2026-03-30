import type { PortfolioDocument } from "@/lib/cms-api";

export const portfolioDraft: PortfolioDocument = {
  slug: "dev",
  version: 1,
  identity: {
    name: "TYANGE",
    role: "Frontend developer",
    location: "Seoul, South Korea",
    availability: "Selective product collaborations",
    email: "usun16@gmail.com",
    github_url: "https://github.com/tyange",
    blog_url: "https://blog.tyange.com",
    velog_url: "https://velog.io/@tyange",
  },
  hero: {
    eyebrow: "Frontend developer / CMS-driven side projects / Seoul",
    headline: "Interfaces with editorial calm and engineering discipline.",
    summary:
      "I build product surfaces, internal tools, and content systems that stay quiet on the outside while carrying a lot of structural intent underneath. Recent work spans a Nuxt blog, a Rust CMS API, an internal CMS, and a Solid dashboard tied together by the same publishing flow.",
    primary_cta: {
      label: "View GitHub",
      url: "https://github.com/tyange",
    },
    secondary_cta: {
      label: "Read the blog",
      url: "https://blog.tyange.com",
    },
  },
  highlight_cards: [
    {
      label: "Focus",
      title: "Frontend systems shaped by content, workflow, and visual restraint",
    },
    {
      label: "Stack",
      title: "Next.js, Nuxt, Solid, Rust, Poem, Tailwind CSS, SQLite",
    },
  ],
  guiding_principle:
    "Minimal is not the absence of detail. It is what remains after every loose edge is tightened.",
  featured_projects: [
    {
      slug: "tyange-blog",
      title: "tyange-blog",
      period: "Nuxt 4 / content platform",
      summary:
        "A personal blog served from Nuxt with markdown-focused authoring, RSS generation, tag filtering, and deployment that rehydrates content from the CMS API on rebuild.",
      stack: ["Nuxt 4", "TypeScript", "Tailwind CSS 4", "Nuxt MDC", "Pinia"],
      highlights: [
        "GitHub Actions deploys the blog to Lightsail and refreshes RSS from CMS-managed content.",
        "The reading surface is tuned around markdown, code blocks, and searchable post metadata.",
      ],
      links: [
        {
          label: "Repository",
          url: "https://github.com/tyange/tyange-blog",
        },
        {
          label: "Live site",
          url: "https://blog.tyange.com",
        },
      ],
    },
    {
      slug: "tyange-cms-api",
      title: "tyange-cms-api",
      period: "Rust / Poem / content infrastructure",
      summary:
        "A Rust API that handles posts, auth, uploads, RSS-triggered workflows, budget tracking, notifications, and the portfolio data that powers this dev page.",
      stack: ["Rust", "Poem", "SQLx", "SQLite", "JWT"],
      highlights: [
        "Combines editorial CMS concerns with personal ops features like budgeting, API keys, and RSS subscriptions.",
        "Designed to trigger downstream blog rebuilds when published content changes.",
      ],
      links: [
        {
          label: "Repository",
          url: "https://github.com/tyange/tyange-cms-api",
        },
      ],
    },
    {
      slug: "tyange-cms",
      title: "tyange-cms",
      period: "Nuxt 4 / internal admin",
      summary:
        "An internal CMS client built for the exact publishing and operations flow behind the blog and admin tools, including post editing, image upload, and budget workflows.",
      stack: ["Nuxt 4", "Vue 3", "TypeScript", "Tailwind CSS 4"],
      highlights: [
        "Google login and admin-only flows are tuned for a narrow operator experience rather than a generic CMS.",
        "The app supports post CRUD, image uploads, tags, and budget management in the same interface.",
      ],
      links: [
        {
          label: "Repository",
          url: "https://github.com/tyange/tyange-cms",
        },
      ],
    },
    {
      slug: "tyange-dashboard",
      title: "tyange-dashboard",
      period: "Solid / operational dashboard",
      summary:
        "A lightweight dashboard for JWT-authenticated admin utilities including active-budget views, spending records, API keys, notifications, and feed management.",
      stack: ["SolidJS", "TypeScript", "Vite", "CMS API"],
      highlights: [
        "Built as a fast operational surface with deployment guardrails and environment validation.",
        "Shares the same backend and auth contracts as the CMS while serving a different day-to-day workflow.",
      ],
      links: [
        {
          label: "Repository",
          url: "https://github.com/tyange/tyange-dashboard",
        },
      ],
    },
  ],
  about: {
    eyebrow: "About",
    headline: "I like work that connects interface quality to the system behind it.",
    paragraphs: [
      "Most of my side projects are not isolated landing pages. They are connected surfaces: a content API, an internal CMS, a public blog, and supporting dashboards that all need to feel coherent.",
      "That makes me care about more than components. I pay attention to publishing flow, deploy friction, data contracts, and the small interaction choices that decide whether an interface feels calm or brittle.",
    ],
    services: [
      "Frontend architecture for product and content surfaces",
      "Design-system aware UI implementation",
      "Internal tools and CMS workflows",
      "API-shaped frontend collaboration",
    ],
    strengths: [
      "Turning rough ideas into structured screen systems",
      "Connecting frontend polish to backend realities",
      "Building personal products end-to-end without losing visual discipline",
    ],
  },
  writing: {
    eyebrow: "Writing",
    title: "Posts tagged with dev",
    description:
      "This section is wired to `/posts/search-with-tags?include=dev`. When the CMS API is not reachable, only the portfolio draft is shown.",
  },
};
