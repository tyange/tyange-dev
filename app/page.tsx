import { getDevPosts, getPortfolio } from "@/lib/cms-api";
import { siGithub } from "simple-icons";
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

        <section id="work" className="grid gap-10 pb-14 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <SectionLabel title="작업" />
          <div className="divide-y divide-black/[0.06]">
            {content.featured_projects.map((project) => (
              <article key={project.slug} className="py-5 first:pt-0">
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold tracking-[-0.05em] text-black">
                        {project.title}
                      </h3>
                      <p className="text-sm text-black/48">{project.period}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.links
                        .filter((link) => isVisibleProjectLink(link.label))
                        .map((link) => (
                          <a
                            key={`${project.slug}-${link.label}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full px-3 py-2 text-xs text-black/64 transition duration-150 hover:bg-black/6 hover:text-black"
                            aria-label={
                              isGitHubRepositoryLink(link.label, link.url)
                                ? "GitHub 저장소"
                                : link.label
                            }
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
