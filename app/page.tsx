import { getDevPosts, getPortfolio, type PortfolioProject } from "@/lib/cms-api";
import { siGithub } from "simple-icons";
import { renderMarkdown } from "@/lib/markdown";
import Image from "next/image";
import Link from "next/link";

function SectionLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold tracking-[-0.05em] text-black">{title}</h2>
      {description ? (
        <p className="max-w-xs text-sm leading-7 text-black/56">{description}</p>
      ) : null}
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
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d={siGithub.path} />
    </svg>
  );
}

function ProjectCardLinks({ project }: { project: PortfolioProject }) {
  return (
    <div className="flex gap-1">
      {project.links
        .filter((link) => isVisibleProjectLink(link.label))
        .map((link) => (
          <a
            key={`${project.slug}-${link.label}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full p-2 text-black/36 transition hover:text-black/64"
            aria-label={isGitHubRepositoryLink(link.label, link.url) ? "GitHub 저장소" : link.label}
          >
            {isGitHubRepositoryLink(link.label, link.url) ? (
              <>
                <GitHubIcon />
                <span className="sr-only">{link.label}</span>
              </>
            ) : (
              <span className="text-xs">{link.label}</span>
            )}
          </a>
        ))}
    </div>
  );
}

export default async function Home() {
  const [portfolio, posts] = await Promise.allSettled([getPortfolio(), getDevPosts()]);

  const portfolioData = portfolio.status === "fulfilled" ? portfolio.value : null;
  const devPosts = posts.status === "fulfilled" ? posts.value : [];
  const content = portfolioData?.content;

  if (!content) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-6 py-16 text-[var(--foreground)] sm:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl space-y-3">
          <h1 className="text-2xl font-bold tracking-[-0.05em] text-black">
            포트폴리오 데이터를 불러오지 못했습니다.
          </h1>
          <p className="text-sm leading-7 text-black/56">
            `tyange-cms-api`의 `/portfolio` 응답을 확인한 뒤 다시 배포해 주세요.
          </p>
        </div>
      </main>
    );
  }

  const careerProfile = content.career;

  // Hero: featured_projects 배열의 첫 프로젝트(= CMS의 1순위)를 풀폭으로 크게 보여준다.
  // 즉 큰 카드는 CMS에서 순서만 바꿔 제어한다(과거의 slug "inert" 고정 방식 대체).
  const hero = content.featured_projects[0] ?? null;
  const heroSlug = hero?.slug;

  const projectMap = new Map(content.featured_projects.map((p) => [p.slug, p]));
  // Hero로 뽑힌 프로젝트는 아래 그룹/폴백에서 중복 렌더되지 않도록 제외한다.
  const pickGrouped = (slug: string) =>
    slug === heroSlug ? undefined : projectMap.get(slug);
  const cms = pickGrouped("tyange-cms");
  const cmsApi = pickGrouped("tyange-cms-api");
  const blogProject = pickGrouped("tyange-blog");
  const devProject = pickGrouped("tyange-dev");
  const dashboardProject = pickGrouped("tyange-dashboard");
  const personalSites = [blogProject, devProject, dashboardProject].filter(
    (p): p is PortfolioProject => p != null,
  );
  const groupedSlugs = new Set([
    "tyange-cms",
    "tyange-cms-api",
    "tyange-blog",
    "tyange-dev",
    "tyange-dashboard",
  ]);
  const otherProjects = content.featured_projects.filter(
    (p) => p.slug !== heroSlug && !groupedSlugs.has(p.slug),
  );

  const introHtml = content.intro?.content ? await renderMarkdown(content.intro.content) : null;
  const introTechStack = content.intro?.tech_stack ?? [];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header>
        <div className="mx-auto flex w-full max-w-6xl items-center px-6 py-5 sm:px-10 lg:px-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[1.05rem] text-black/86">
            <span className="font-medium">{content.identity.name}</span>
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
            <a href={`mailto:${content.identity.email}`} className="transition hover:text-black">
              {content.identity.email}
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-10 lg:px-12">
        {/* ── Intro ── */}
        <section className="w-full pt-16 pb-20">
          {introHtml ? (
            <div
              className="prose prose-neutral max-w-3xl break-keep prose-p:text-[1.625rem] prose-p:font-bold prose-p:leading-[1.45] prose-p:tracking-[-0.03em] prose-p:text-black sm:prose-p:text-[2rem] lg:prose-p:text-[2.25rem]"
              dangerouslySetInnerHTML={{ __html: introHtml }}
            />
          ) : (
            <h1 className="max-w-2xl text-[1.625rem] font-bold leading-[1.45] tracking-[-0.03em] text-black sm:text-[2rem] lg:text-[2.25rem]">
              여기에 인트로 텍스트가 들어갑니다.
            </h1>
          )}

          {introTechStack.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-5">
              {introTechStack.map((item) => (
                <span
                  key={item.name}
                  className="flex items-center gap-2 text-sm text-black/70 transition hover:text-black"
                  title={item.name}
                >
                  {item.icon_url && (
                    <Image
                      src={item.icon_url}
                      alt={item.name}
                      width={20}
                      height={20}
                      className="h-5 w-5 shrink-0 object-contain"
                    />
                  )}
                  <span className="hidden sm:inline">{item.name}</span>
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="pb-12">
          {careerProfile ? (
            <>
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
                          <section
                            key={`${company.company}-${item.title}`}
                            className="space-y-2 py-5 first:pt-0 last:pb-0"
                          >
                            <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-black">
                              {item.title}
                            </h2>
                            {item.period ? (
                              <p className="text-sm font-medium text-black/48">{item.period}</p>
                            ) : null}
                            <div className="space-y-2 pt-1">
                              {item.bullets.map((bullet) => (
                                <p
                                  key={bullet}
                                  className="max-w-4xl pl-4 text-sm leading-7 text-black/62"
                                >
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
            </>
          ) : null}
        </section>

        <section id="work" className="pb-14">
          <h2 className="mb-8 text-2xl font-bold tracking-[-0.05em] text-black">작업</h2>

          <div className="space-y-4">
            {/* Hero: featured_projects[0] — full width */}
            {hero && (
              <article className="rounded-2xl border border-black/6 bg-white/40 p-8 lg:p-10">
                <h3 className="text-3xl font-bold tracking-[-0.06em] text-black">{hero.title}</h3>
                <p className="mt-2 text-sm text-black/48">{hero.period}</p>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-black/62">{hero.summary}</p>

                {hero.highlights.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {hero.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-sm leading-6 text-black/56">
                        <span className="shrink-0 text-black/20">—</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {hero.links
                    .filter((link) => isVisibleProjectLink(link.label))
                    .map((link) => (
                      <a
                        key={`${hero.slug}-${link.label}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm text-black/64 transition hover:bg-black/4 hover:text-black"
                      >
                        {link.label}
                        <span className="text-[0.65rem]">↗</span>
                      </a>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {hero.stack.map((tag) => (
                    <span
                      key={`${hero.slug}-${tag}`}
                      className="rounded-full bg-black/4 px-3 py-1.5 text-xs text-black/48"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            )}

            {/* Two groups below — side by side */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* CMS System Group */}
              {(cms || cmsApi) && (
                <div className="rounded-2xl border border-black/6 bg-white/40 p-7">
                  <div className="mb-5">
                    <h3 className="text-lg font-bold tracking-[-0.03em] text-black">CMS 시스템</h3>
                    <p className="mt-1 text-sm text-black/48">
                      블로그를 구동하는 콘텐츠 관리 시스템
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[cms, cmsApi]
                      .filter((p): p is PortfolioProject => p != null)
                      .map((project) => (
                        <article
                          key={project.slug}
                          className="rounded-xl bg-black/2 p-5 transition-colors duration-200 hover:bg-black/5"
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold tracking-[-0.02em] text-black">
                              {project.title}
                            </h4>
                            <ProjectCardLinks project={project} />
                          </div>
                          <p className="mt-1 text-xs text-black/44">{project.period}</p>
                          <p className="mt-3 text-sm leading-6 text-black/58">{project.summary}</p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {project.stack.map((tag) => (
                              <span
                                key={`${project.slug}-${tag}`}
                                className="rounded-full bg-black/4 px-2.5 py-1 text-[0.6875rem] text-black/44"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </article>
                      ))}
                  </div>
                </div>
              )}

              {/* Personal Sites Group */}
              {personalSites.length > 0 && (
                <div className="rounded-2xl border border-black/6 bg-white/40 p-7">
                  <div className="mb-5">
                    <h3 className="text-lg font-bold tracking-[-0.03em] text-black">개인 사이트</h3>
                    <p className="mt-1 text-sm text-black/48">블로그, 포트폴리오, 운영 대시보드</p>
                  </div>
                  <div className="space-y-3">
                    {personalSites.map((project) => (
                      <article
                        key={project.slug}
                        className="rounded-xl bg-black/2 p-5 transition-colors duration-200 hover:bg-black/5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-bold tracking-[-0.02em] text-black">
                              {project.title}
                            </h4>
                            <p className="mt-1 text-xs text-black/44">{project.period}</p>
                          </div>
                          <ProjectCardLinks project={project} />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.stack.map((tag) => (
                            <span
                              key={`${project.slug}-${tag}`}
                              className="rounded-full bg-black/4 px-2.5 py-1 text-[0.6875rem] text-black/44"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fallback */}
            {otherProjects.length > 0 && (
              <div className="grid gap-4 lg:grid-cols-2">
                {otherProjects.map((project) => (
                  <article
                    key={project.slug}
                    className="flex flex-col rounded-2xl border border-black/6 bg-white/40 p-7"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold tracking-[-0.03em] text-black">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm text-black/48">{project.period}</p>
                      </div>
                      <ProjectCardLinks project={project} />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-black/62">{project.summary}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      {project.stack.map((tag) => (
                        <span
                          key={`${project.slug}-${tag}`}
                          className="rounded-full bg-black/4 px-3 py-1.5 text-xs text-black/48"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section
          id="writing"
          className={`grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] ${devPosts.length > 0 ? "pb-14" : "pb-0"}`}
        >
          <SectionLabel title="기록" />
          <div className="divide-y divide-black/[0.06]">
            {devPosts.length > 0 ? (
              devPosts.map((post) => (
                <div key={post.post_id} className="group cursor-pointer py-5 first:pt-0">
                  <Link className="space-y-1.5" href={`/posts/${post.post_id}`}>
                    <h3 className="text-[1.1rem] font-bold tracking-[-0.04em] text-black transition group-hover:text-black/72">
                      {post.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-7 text-black/54">{post.description}</p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-3 text-sm leading-7 text-black/56">
                CMS API에서 `dev` 태그 글을 아직 찾지 못했습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
