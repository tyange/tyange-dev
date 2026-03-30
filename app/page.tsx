import { getDevPosts, getPortfolio } from "@/lib/cms-api";
import { portfolioDraft } from "@/lib/portfolio-draft";

function formatPublishedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function Home() {
  const [portfolio, posts] = await Promise.allSettled([getPortfolio(), getDevPosts()]);

  const portfolioData = portfolio.status === "fulfilled" ? portfolio.value : null;
  const devPosts = posts.status === "fulfilled" ? posts.value : [];
  const content = portfolioData?.content ?? portfolioDraft;
  const isPortfolioFallback = portfolio.status !== "fulfilled" || !portfolioData;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(255,255,255,0.55)_36%,_transparent_72%)]" />
      <div className="absolute left-1/2 top-32 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(193,214,201,0.28)] blur-3xl" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
        <header className="flex items-center justify-between border-b border-black/8 pb-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-black/45">
              {content.identity.name}
            </p>
            {isPortfolioFallback ? (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-black/35">
                CMS API에 연결할 수 없어 로컬 초안을 표시하고 있습니다
              </p>
            ) : null}
          </div>
          <nav className="hidden gap-6 font-mono text-[11px] uppercase tracking-[0.24em] text-black/45 sm:flex">
            <a href="#work" className="transition hover:text-black">
              작업
            </a>
            <a href="#writing" className="transition hover:text-black">
              기록
            </a>
            <a href="#about" className="transition hover:text-black">
              소개
            </a>
          </nav>
        </header>

        <section className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.9fr)] lg:items-end">
          <div className="space-y-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/42">
              {content.hero.eyebrow}
            </p>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-balance text-black sm:text-7xl lg:text-[6.5rem]">
                {content.hero.headline}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-black/64 sm:text-lg">
                {content.hero.summary}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={content.hero.primary_cta.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 font-mono text-[12px] uppercase tracking-[0.22em] text-white transition hover:-translate-y-0.5 hover:bg-black/88"
              >
                {content.hero.primary_cta.label}
              </a>
              <a
                href={content.hero.secondary_cta.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white/80 px-6 font-mono text-[12px] uppercase tracking-[0.22em] text-black transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white"
              >
                {content.hero.secondary_cta.label}
              </a>
            </div>
          </div>

          <aside className="grid gap-4 rounded-[2rem] border border-black/8 bg-white/72 p-5 shadow-[0_20px_80px_rgba(17,24,39,0.06)] backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {content.highlight_cards.map((card) => (
                <div key={card.label} className="rounded-[1.5rem] bg-[#f5f1ea] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-black/42">
                    {card.label}
                  </p>
                  <p className="mt-8 text-lg font-medium tracking-[-0.04em] text-black">
                    {card.title}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-[1.5rem] border border-black/6 bg-white p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-black/42">
                원칙
              </p>
              <p className="mt-4 text-2xl font-medium tracking-[-0.05em] text-black">
                {content.guiding_principle}
              </p>
            </div>
          </aside>
        </section>

        <section
          id="work"
          className="grid gap-6 border-t border-black/8 pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]"
        >
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/42">
              주요 작업
            </p>
            <p className="max-w-xs text-sm leading-7 text-black/56">
              CMS API에 저장된 포트폴리오 문서를 기준으로 구성한 프로젝트들입니다.
            </p>
          </div>
          <div className="grid gap-4">
            {content.featured_projects.map((project, index) => (
              <article
                key={project.slug}
                className="group grid gap-5 rounded-[1.75rem] border border-black/8 bg-white/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-black/14 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
              >
                <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-black/36">
                    0{index + 1}
                  </p>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-medium tracking-[-0.05em] text-black">
                        {project.title}
                      </h2>
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-black/42">
                        {project.period}
                      </p>
                    </div>
                    <p className="max-w-3xl text-sm leading-7 text-black/60">
                      {project.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {project.links.map((link) => (
                      <a
                        key={`${project.slug}-${link.label}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-black/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-black/64 transition hover:border-black/18 hover:text-black"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={`${project.slug}-${item}`}
                      className="rounded-full bg-black/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-black/56"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.highlights.map((highlight) => (
                    <p
                      key={`${project.slug}-${highlight}`}
                      className="rounded-[1.25rem] bg-[#faf7f2] px-4 py-4 text-sm leading-7 text-black/60"
                    >
                      {highlight}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="writing"
          className="grid gap-6 border-t border-black/8 pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]"
        >
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/42">
              {content.writing.eyebrow}
            </p>
            <div className="space-y-3">
              <p className="text-3xl font-medium tracking-[-0.05em] text-black">
                {content.writing.title}
              </p>
              <p className="max-w-xs text-sm leading-7 text-black/56">
                {content.writing.description}
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {devPosts.length > 0 ? (
              devPosts.map((post) => (
                <article
                  key={post.post_id}
                  className="rounded-[1.5rem] border border-black/8 bg-white/72 p-5 transition hover:-translate-y-0.5 hover:border-black/14"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium tracking-[-0.04em] text-black">
                        {post.title}
                      </h3>
                      <p className="max-w-2xl text-sm leading-7 text-black/60">
                        {post.description}
                      </p>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-black/42">
                      {formatPublishedAt(post.published_at)}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={`${post.post_id}-${tag.category}-${tag.tag}`}
                        className="rounded-full bg-black/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-black/56"
                      >
                        {tag.category}:{tag.tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-black/12 bg-white/60 p-5 text-sm leading-7 text-black/56">
                CMS API에서 `dev` 태그 글을 아직 찾지 못했습니다.
              </div>
            )}
          </div>
        </section>

        <section
          id="about"
          className="grid gap-8 border-t border-black/8 py-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
        >
          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/42">
              {content.about.eyebrow}
            </p>
            <p className="max-w-3xl text-3xl font-medium tracking-[-0.05em] text-black sm:text-4xl">
              {content.about.headline}
            </p>
            <div className="space-y-4">
              {content.about.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-2xl text-sm leading-8 text-black/60 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="grid gap-4 rounded-[1.75rem] border border-black/8 bg-[#161616] p-6 text-white">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/42">
                할 수 있는 일
              </p>
              <div className="mt-3 space-y-2">
                {content.about.services.map((service) => (
                  <p key={service} className="text-sm leading-7 text-white/74">
                    {service}
                  </p>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/42">
                강점
              </p>
              <div className="mt-3 space-y-2">
                {content.about.strengths.map((strength) => (
                  <p key={strength} className="text-sm leading-7 text-white/74">
                    {strength}
                  </p>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/42">
                연락
              </p>
              <a
                href={`mailto:${content.identity.email}`}
                className="mt-3 inline-block text-lg font-medium tracking-[-0.04em] text-white transition hover:text-white/78"
              >
                {content.identity.email}
              </a>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={content.identity.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/12 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
                >
                  깃허브
                </a>
                <a
                  href={content.identity.blog_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/12 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
                >
                  블로그
                </a>
                {content.identity.velog_url ? (
                  <a
                    href={content.identity.velog_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/12 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
                  >
                    Velog
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
