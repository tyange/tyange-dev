import { getDevPosts, getPortfolio } from "@/lib/cms-api";
import { portfolioDraft } from "@/lib/portfolio-draft";

function mergePortfolioContent(apiContent: (typeof portfolioDraft) | null | undefined) {
  if (!apiContent) {
    return portfolioDraft;
  }

  return {
    ...portfolioDraft,
    ...apiContent,
    identity: apiContent.identity ?? portfolioDraft.identity,
    hero: apiContent.hero ?? portfolioDraft.hero,
    highlight_cards: apiContent.highlight_cards ?? portfolioDraft.highlight_cards,
    metrics: apiContent.metrics ?? portfolioDraft.metrics,
    guiding_principle: apiContent.guiding_principle ?? portfolioDraft.guiding_principle,
    featured_projects: apiContent.featured_projects ?? portfolioDraft.featured_projects,
    about: apiContent.about ?? portfolioDraft.about,
    writing: apiContent.writing ?? portfolioDraft.writing,
    currently_building: apiContent.currently_building ?? portfolioDraft.currently_building,
  };
}

function SectionLabel({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold tracking-[-0.05em] text-black">{title}</h2>
      {description ? <p className="max-w-xs text-sm leading-7 text-black/56">{description}</p> : null}
    </div>
  );
}

function getCareerProfile() {
  type CareerItem = {
    title: string;
    period?: string;
    bullets: string[];
  };

  type CareerCompany = {
    company: string;
    period: string;
    employmentType: string;
    role: string;
    position: string;
    items: CareerItem[];
  };

  const companies: CareerCompany[] = [
      {
        company: "(주)미트박스글로벌",
        period: "2026.01 - 재직 중",
        employmentType: "정규직",
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
        employmentType: "정규직",
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
          {
            title: "운영 서비스 지속 개선",
            bullets: ["실제 운영 서비스 대상, 유저 피드백 기반 지속 개선 중"],
          },
        ],
      },
    ];

  return {
    summaryLabel: "경력",
    summaryValue: "3년 8개월",
    companies,
  };
}

export default async function Home() {
  const [portfolio, posts] = await Promise.allSettled([getPortfolio(), getDevPosts()]);

  const portfolioData = portfolio.status === "fulfilled" ? portfolio.value : null;
  const devPosts = posts.status === "fulfilled" ? posts.value : [];
  const content = mergePortfolioContent(portfolioData?.content);
  const currentItems = content.currently_building ?? [];
  const careerProfile = getCareerProfile();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header>
        <div className="mx-auto flex w-full max-w-6xl items-center px-6 py-5 sm:px-10 lg:px-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[1.05rem] text-black/86">
            <span className="font-medium">유태양</span>
            <span className="text-black/16">|</span>
            <a
              href={content.identity.github_url}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-black"
            >
              GitHub
            </a>
            <span className="text-black/16">|</span>
            <a
              href={`mailto:${content.identity.email}`}
              className="font-medium transition hover:text-black"
            >
              {content.identity.email}
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-10 lg:px-12">
        <section className="pt-3 pb-12">
          <div className="max-w-4xl">
            <div className="flex items-baseline gap-3 text-black">
              <p className="text-2xl font-bold tracking-[-0.05em]">
                {careerProfile.summaryLabel}
              </p>
              <p className="text-sm text-black/48">{careerProfile.summaryValue}</p>
            </div>
          </div>

          <div className="mt-8 max-w-4xl">
            <div className="space-y-12">
              {careerProfile.companies.map((company) => (
                <section key={company.company} className="min-w-0 space-y-2">
                  <h1 className="text-[1.05rem] font-bold tracking-[-0.02em] text-black">
                    {company.company}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-black/48">
                    <span>{company.period}</span>
                    <span>{company.employmentType}</span>
                    <span>{company.role}</span>
                    {company.position ? <span>{company.position}</span> : null}
                  </div>

                  <div className="mt-6 space-y-8 pl-5 sm:pl-8">
                    {company.items.map((item) => (
                      <section key={`${company.company}-${item.title}`} className="space-y-2">
                        <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-black">
                          {item.title}
                        </h2>
                        {item.period ? (
                          <p className="text-sm font-medium text-black/48">{item.period}</p>
                        ) : null}
                        <div className="space-y-2 pt-1">
                          {item.bullets.map((bullet) => (
                            <p key={bullet} className="max-w-3xl pl-4 text-sm leading-7 text-black/62">
                              - {bullet}
                            </p>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section
          id="work"
          className="grid gap-10 pb-14 lg:grid-cols-[15rem_minmax(0,1fr)]"
        >
          <SectionLabel title="작업" />
          <div className="space-y-4">
            {content.featured_projects.map((project) => (
              <article
                key={project.slug}
                className="py-2"
              >
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold tracking-[-0.05em] text-black">
                        {project.title}
                      </h3>
                      <p className="text-sm text-black/48">{project.period}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.links.map((link) => (
                        <a
                          key={`${project.slug}-${link.label}`}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full px-3 py-2 text-xs text-black/64 transition duration-150 hover:bg-black/6 hover:text-black"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                  <p className="max-w-3xl text-sm leading-7 text-black/62">{project.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tag) => (
                      <span
                        key={`${project.slug}-${tag}`}
                        className="inline-flex items-center px-3 py-2 text-xs text-black/52"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="writing"
          className={`grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] ${currentItems.length > 0 ? "pb-14" : "pb-0"}`}
        >
          <SectionLabel title="기록" />
          <div className="space-y-3">
            {devPosts.length > 0 ? (
              devPosts.map((post) => (
                <article
                  key={post.post_id}
                  className="cursor-pointer py-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start gap-4">
                      <span className="pt-1 text-sm text-black/32">•</span>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-[-0.05em] text-black">
                          {post.title}
                        </h3>
                        <p className="max-w-3xl text-sm leading-7 text-black/60">{post.description}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="py-3 text-sm leading-7 text-black/56">
                CMS API에서 `dev` 태그 글을 아직 찾지 못했습니다.
              </div>
            )}
          </div>
        </section>

        {currentItems.length > 0 ? (
          <section className="grid gap-10 pb-0 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <SectionLabel title="현재 작업" />
            <div className="space-y-4">
              {currentItems.map((item) => (
                <article
                  key={item.name}
                  className="py-2"
                >
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-[-0.05em] text-black">{item.name}</h3>
                    <p className="max-w-3xl text-sm leading-7 text-black/60">{item.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.stack.map((stack) => (
                        <span
                          key={`${item.name}-${stack}`}
                          className="inline-flex items-center px-3 py-2 text-xs text-black/52"
                        >
                          {stack}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

      </div>
    </main>
  );
}
