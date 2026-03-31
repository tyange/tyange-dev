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
    career: apiContent.career
      ? {
          ...portfolioDraft.career!,
          ...apiContent.career,
          companies: apiContent.career.companies ?? portfolioDraft.career!.companies,
        }
      : portfolioDraft.career!,
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

function isGitHubRepositoryLink(label: string, url: string) {
  return label === "저장소" && url.includes("github.com");
}

function isVisibleProjectLink(label: string) {
  return label !== "서비스";
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 .5C5.649.5.5 5.649.5 12A11.5 11.5 0 0 0 8.36 22.07c.575.106.785-.25.785-.556 0-.274-.01-1-.016-1.963-3.183.692-3.855-1.533-3.855-1.533-.52-1.32-1.27-1.672-1.27-1.672-1.038-.71.078-.696.078-.696 1.148.081 1.751 1.178 1.751 1.178 1.02 1.748 2.675 1.243 3.326.95.104-.739.4-1.243.727-1.528-2.54-.289-5.21-1.27-5.21-5.652 0-1.249.446-2.27 1.177-3.07-.118-.288-.51-1.45.112-3.023 0 0 .96-.307 3.145 1.173a10.92 10.92 0 0 1 5.728 0c2.184-1.48 3.142-1.173 3.142-1.173.624 1.573.232 2.735.114 3.023.733.8 1.175 1.821 1.175 3.07 0 4.393-2.675 5.36-5.223 5.644.41.353.776 1.05.776 2.117 0 1.528-.014 2.76-.014 3.135 0 .31.207.668.79.555A11.503 11.503 0 0 0 23.5 12C23.5 5.649 18.351.5 12 .5Z" />
    </svg>
  );
}

export default async function Home() {
  const [portfolio, posts] = await Promise.allSettled([getPortfolio(), getDevPosts()]);

  const portfolioData = portfolio.status === "fulfilled" ? portfolio.value : null;
  const devPosts = posts.status === "fulfilled" ? posts.value : [];
  const content = mergePortfolioContent(portfolioData?.content);
  const currentItems = content.currently_building ?? [];
  const careerProfile = content.career ?? portfolioDraft.career!;

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
          <div className="max-w-[64rem]">
            <div className="flex items-baseline gap-3 text-black">
              <p className="text-2xl font-bold tracking-[-0.05em]">
                {careerProfile.summary_label}
              </p>
              <p className="text-sm text-black/48">{careerProfile.summary_value}</p>
            </div>
          </div>

          <div className="mt-8 max-w-[64rem]">
            <div className="space-y-10">
              {careerProfile.companies.map((company) => (
                <section key={company.company} className="min-w-0 space-y-2">
                  <h1 className="text-[1.05rem] font-bold tracking-[-0.02em] text-black">
                    {company.company}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-black/48">
                    <span>{company.period}</span>
                    <span>{company.employment_type}</span>
                    <span>{company.role}</span>
                    {company.position ? <span>{company.position}</span> : null}
                  </div>

                  <div className="mt-6 divide-y divide-black/[0.06] pl-5 sm:pl-8">
                    {company.items.map((item) => (
                      <section key={`${company.company}-${item.title}`} className="space-y-2 py-5 first:pt-0 last:pb-0">
                        <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-black">
                          {item.title}
                        </h2>
                        {item.period ? (
                          <p className="text-sm font-medium text-black/48">{item.period}</p>
                        ) : null}
                        <div className="space-y-2 pt-1">
                          {item.bullets.map((bullet) => (
                            <p key={bullet} className="max-w-4xl pl-4 text-sm leading-7 text-black/62">
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
          <div className="divide-y divide-black/[0.06]">
            {content.featured_projects.map((project) => (
              <article
                key={project.slug}
                className="py-5 first:pt-0"
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
                      {project.links.filter((link) => isVisibleProjectLink(link.label)).map((link) => (
                        <a
                          key={`${project.slug}-${link.label}`}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full px-3 py-2 text-xs text-black/64 transition duration-150 hover:bg-black/6 hover:text-black"
                          aria-label={isGitHubRepositoryLink(link.label, link.url) ? "GitHub 저장소" : link.label}
                        >
                          {isGitHubRepositoryLink(link.label, link.url) ? (
                            <>
                              <GitHubIcon />
                              <span className="sr-only">{link.label}</span>
                            </>
                          ) : (
                            link.label
                          )}
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
          <div className="divide-y divide-black/[0.06]">
            {devPosts.length > 0 ? (
              devPosts.map((post) => (
                <article
                  key={post.post_id}
                  className="group cursor-pointer py-5 first:pt-0"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-[1.1rem] font-bold tracking-[-0.04em] text-black transition group-hover:text-black/72">
                      {post.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-7 text-black/54">{post.description}</p>
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
            <div className="divide-y divide-black/[0.06]">
              {currentItems.map((item) => (
                <article
                  key={item.name}
                  className="py-5 first:pt-0"
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
