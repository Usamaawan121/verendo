"use client";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Layers,
  Focus,
  Heart,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assets,
  config,
  media,
  posts,
  projects,
  team,
  type Project,
  type Post,
} from "@/content/site";
import { ParallaxImage, Reveal, TextReveal } from "./animation";
import { BlogCard, Metrics, ProjectCard } from "./home";
import {
  ButtonLink,
  ContactCard,
  CTA,
  Eyebrow,
  InnerHero,
  SectionHeading,
  submitOrDraft,
} from "./shared";

export function ProjectsPage() {
  return (
    <>
      <InnerHero
        eyebrow="Projects"
        title="Software, Apps & Digital Experiences"
        description="Explore portfolio projects in streaming systems, web applications, SaaS software design, and digital-service websites."
      />
      <section className="projects-list container">
        {projects.map((p) => (
          <Reveal key={p.slug}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </section>
      <CTA />
    </>
  );
}
export function BlogPage() {
  return (
    <>
      <InnerHero
        eyebrow="Blog"
        title="Insights on AI & Automation"
        description="Expert perspectives on AI automation, workflow design, and the systems behind high-performing businesses."
      />
      <section className="blog-grid blog-index container section-space">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.08}>
            <BlogCard post={p} />
          </Reveal>
        ))}
      </section>
    </>
  );
}
const values = [
  {
    title: "Clarity Over Complexity",
    text: "We simplify complex workflows into clear, structured systems.",
    Icon: Focus,
  },
  {
    title: "Human-Centered Automation",
    text: "Automation should support how teams actually work.",
    Icon: Heart,
  },
  {
    title: "Thoughtful Execution",
    text: "Every system is carefully designed for reliability and efficiency.",
    Icon: Layers,
  },
  {
    title: "Long-Term Development",
    text: "We create automation that grows with the business.",
    Icon: TrendingUp,
  },
];
export function AboutPage() {
  return (
    <>
      <InnerHero
        eyebrow="About us"
        title="The Minds Behind the Automation"
        description="Ideas, strategies, and practical guides to help businesses streamline operations and grow with AI."
        image={assets.aboutHero}
      />
      <section className="split-section container section-space">
        <Reveal className="split-image">
          <img
            src={assets.approach}
            alt="Verendo colleagues planning a software product together"
            loading="lazy"
          />
        </Reveal>
        <div className="split-copy">
          <SectionHeading
            eyebrow="Our approach"
            title="Designing Software Around Restaurant Operations"
            description="The Tummly portfolio project connects trial requests, restaurant account setup, and location management through one software design."
          />
          <p>Our focus was to:</p>
          <ul className="check-list">
            {[
              "Restaurant SaaS Software Design",
              "Account and Location Workflows",
              "Connected Frontend and API",
            ].map((t) => (
              <li key={t}>
                <Check size={16} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="split-section reverse container section-space">
        <Reveal className="split-image">
          <img
            src={assets.results}
            alt="Verendo colleagues reviewing a product interface"
            loading="lazy"
          />
        </Reveal>
        <div className="split-copy">
          <SectionHeading
            eyebrow="Project focus"
            title="Connecting Product Design with Software Architecture"
            description="Tummly brings the interface, API, and data model together around restaurant onboarding and operations. The case study focuses on clear user journeys and maintainable software."
          />
          <div className="project-stats">
            <div>
              <strong>React</strong>
              <span className="mono">Frontend application</span>
            </div>
            <div>
              <strong>.NET</strong>
              <span className="mono">API architecture</span>
            </div>
          </div>
        </div>
      </section>
      <section className="values-grid container section-space">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.08}>
            <article className="value-card">
              <v.Icon size={30} strokeWidth={1} />
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          </Reveal>
        ))}
      </section>
      <section className="achievement-section">
        <ParallaxImage src={assets.achievements} />
        <div className="container">
          <Metrics />
        </div>
      </section>
      <section className="founder-section container section-space">
        <Reveal className="founder-image">
          <img src={assets.founder} alt="Bagus William" loading="lazy" />
        </Reveal>
        <div>
          <TextReveal text="Our goal is simple: build thoughtful systems that help businesses run more clearly and scale with confidence." />
          <p>Bagus William</p>
          <span className="mono muted">CEO & Co-founder of Verendo</span>
        </div>
      </section>
      <section className="team-section container section-space">
        <SectionHeading
          eyebrow="Our team"
          title="The People Behind Verendo"
          description="A team of builders, thinkers, and system designers turning complex workflows into clear automation."
          center
        />
        <div className="team-grid">
          {team.map(([name, role, front, back], i) => (
            <Reveal key={name} delay={(i % 3) * 0.1}>
              <article className="team-card" tabIndex={0}>
                <div className="team-image">
                  <img src={media(front)} alt={name} loading="lazy" />
                  <img
                    className="team-alternate"
                    src={media(back)}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <h3>{name}</h3>
                <span className="mono muted">{role}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
export function ContactPage() {
  const [budget, setBudget] = useState(""),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  const query = useSearchParams();
  const selectedPlan = query.get("plan")
    ? `${query.get("plan")} — ${query.get("billing") || "monthly"}`
    : "";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    if (!budget) {
      setStatus("Please choose a budget range.");
      return;
    }
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(
      [...data.entries()].map(([k, v]) => [k, String(v)]),
    );
    payload.budget = budget;
    if (selectedPlan) payload.plan = selectedPlan;
    try {
      setStatus(
        await submitOrDraft(
          config.contactEndpoint,
          payload,
          "Let’s talk about your workflow",
        ),
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="contact-page container">
      <div className="contact-intro">
        <ParallaxImage src={assets.landscape} />
        <div className="contact-shade" />
        <div className="contact-intro-content">
          <SectionHeading
            as="h1"
            eyebrow="Contact us"
            title="Let’s talk about your workflow"
            description="Share a few details about your business and what you’re looking to automate. Our team will review your message and get back to you shortly."
          />
          <ContactCard />
        </div>
      </div>
      <Reveal className="contact-form-wrap">
        <form className="contact-form" onSubmit={submit}>
          {selectedPlan && (
            <p className="selected-plan">Interested in {selectedPlan}</p>
          )}
          <label>
            <span className="mono">Full name</span>
            <input
              name="name"
              placeholder="John Smith"
              required
              autoComplete="name"
            />
          </label>
          <label>
            <span className="mono">Email</span>
            <input
              name="email"
              placeholder="john@company.com"
              required
              type="email"
              autoComplete="email"
            />
          </label>
          <label>
            <span className="mono">Company name</span>
            <input
              name="company"
              placeholder="Your company"
              required
              autoComplete="organization"
            />
          </label>
          <div className="form-field">
            <label className="mono" htmlFor="budget-select">
              Budget
            </label>
            <Select
              name="budget"
              value={budget}
              onValueChange={setBudget}
              required
            >
              <SelectTrigger
                id="budget-select"
                aria-label="Budget"
                className="budget-select"
              >
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent position="popper">
                {["$1K–$5K", "$5K–$10K", "$10K–$20K", "$20K+"].map((b) => (
                  <SelectItem value={b} key={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label>
            <span className="mono">Message</span>
            <textarea
              name="message"
              placeholder="Tell us about your workflow…"
              rows={4}
              required
            />
          </label>
          <p className="form-terms">
            By submitting you agree to our{" "}
            <Link href="/legal/terms-conditions">Terms of Service</Link> and{" "}
            <Link href="/legal/privacy-policy">Privacy Policy</Link>
          </p>
          <button className="button button-light" disabled={busy} type="submit">
            {busy
              ? "Sending…"
              : config.contactEndpoint
                ? "Submit"
                : "Open email draft"}
            <ArrowUpRight size={16} />
          </button>
          <p className="form-status" role="status">
            {status}
          </p>
        </form>
      </Reveal>
    </section>
  );
}
export function ProjectDetail({ project }: { project: Project }) {
  return (
    <>
      <section className="project-detail-hero container">
        <div className="project-detail-heading">
          <img src={media(project.logo)} alt={project.name} />
          <TextReveal text={project.title} as="h1" />
          <p>{project.description}</p>
          <div className="project-detail-info">
            <div>
              <span className="mono muted">Year</span>
              <p>{project.year}</p>
            </div>
            <div>
              <span className="mono muted">Industry</span>
              <p>{project.category}</p>
            </div>
            <div>
              <span className="mono muted">Services</span>
              {project.focus.map((f) => (
                <p key={f}>{f}</p>
              ))}
            </div>
          </div>
        </div>
        <Reveal className="detail-cover">
          <img src={media(project.image)} alt={project.imageAlt} />
        </Reveal>
      </section>
      <section className="challenge-section">
        <ParallaxImage src={assets.landscape} />
        <div className="challenge-content container">
          <Eyebrow>Challenges</Eyebrow>
          <TextReveal
            text={project.challenge}
          />
        </div>
      </section>
      <section className="split-section container section-space">
        <Reveal className="split-image">
          <img
            src={media(project.image)}
            alt={project.imageAlt}
            loading="lazy"
          />
        </Reveal>
        <div className="split-copy">
          <SectionHeading
            eyebrow="Our approach"
            title={project.approachTitle}
            description={project.approachDescription}
          />
          <p>
            {project.approachBody}
          </p>
          <ul className="check-list">
            {project.focus.map((f) => (
              <li key={f}>
                <Check size={16} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="split-section reverse container section-space">
        <Reveal className="split-image">
          <img
            src={media(project.image)}
            alt={project.imageAlt}
            loading="lazy"
          />
        </Reveal>
        <div className="split-copy">
          <SectionHeading
            eyebrow="Project focus"
            title={project.resultsTitle}
            description={project.resultsDescription}
          />
          <div className="project-stats">
            {project.stats.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span className="mono">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container section-space">
        <div className="section-row">
          <h2>More Projects</h2>
          <ButtonLink href="/projects">See More</ButtonLink>
        </div>
        <div className="related-projects">
          {projects
            .filter((p) => p.slug !== project.slug)
            .map((p) => (
              <ProjectCard key={p.slug} project={p} compact />
            ))}
        </div>
      </section>
    </>
  );
}
export function BlogDetail({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <>
      <section className="article-hero container">
        <Link href="/blog" className="back-link">
          ← All articles
        </Link>
        <div className="article-meta mono">
          <span>{post.category}</span>
          <span>March 6, 2026</span>
        </div>
        <TextReveal as="h1" text={post.title} />
        <div className="article-cover">
          <img src={media(post.image)} alt="Editorial abstract sculpture" />
        </div>
      </section>
      <section className="article-layout container">
        <aside>
          <span className="mono muted">In this article</span>
          <nav>
            {post.sections.map(([title], i) => (
              <a key={title} href={`#section-${i + 1}`}>
                {title}
              </a>
            ))}
          </nav>
          <button onClick={share} className="button">
            <Copy size={14} />
            {copied ? "Link copied" : "Copy article link"}
          </button>
        </aside>
        <article className="article-body">
          <p className="article-lead">{post.intro}</p>
          {post.sections.map(([heading, body], i) => (
            <section id={`section-${i + 1}`} key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
          <blockquote>
            Clear systems give people more time to focus on the work that
            matters.
          </blockquote>
          <p>
            Want to explore what this could look like for your team?{" "}
            <Link href="/contact">Let’s talk about your workflow.</Link>
          </p>
        </article>
      </section>
      <section className="container section-space">
        <div className="section-row">
          <h2>More Insights</h2>
          <ButtonLink href="/blog">See More</ButtonLink>
        </div>
        <div className="blog-grid">
          {posts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 3)
            .map((p) => (
              <BlogCard post={p} key={p.slug} />
            ))}
        </div>
      </section>
    </>
  );
}
const privacy = [
  [
    "Information you provide",
    "When you contact us, you may choose to share your name, email address, company, budget, and project details. We use this information to respond to your inquiry.",
  ],
  [
    "How this template handles information",
    "This editable site opens an email draft by default. It does not send contact or newsletter information to a server unless the site owner configures an endpoint. Your email application handles a draft once you choose to open it.",
  ],
  [
    "Cookies and local storage",
    "This reconstruction does not install advertising trackers or analytics. A hosting provider or services configured by the owner may have their own data practices.",
  ],
  [
    "Third-party services",
    "Booking and social links may take you to another website. The privacy terms of that service apply when you use it.",
  ],
  [
    "Your choices",
    "Contact us to ask about information you have provided or to request that we stop contacting you.",
  ],
  [
    "Contact",
    "For questions about this policy, email the address listed in the footer.",
  ],
];
const terms = [
  [
    "Using this website",
    "This website provides information about automation services. The example projects, metrics, prices, and testimonials are template content and must be replaced or verified by the site owner.",
  ],
  [
    "Service agreements",
    "The website does not process purchases or create a service agreement. Project scope, fees, timelines, and support are agreed separately before work begins.",
  ],
  [
    "Website content",
    "Text, images, video, and design assets may be subject to their respective creators’ rights. Use the site only as permitted by the applicable permissions and agreements.",
  ],
  [
    "External links",
    "Links to other services are provided for convenience. Those services have their own terms and are operated independently.",
  ],
  [
    "Availability",
    "The site owner may update content, features, and availability. Contact the owner if you encounter a problem or need clarification.",
  ],
  [
    "Contact",
    "Questions about these terms can be sent to the email address in the footer.",
  ],
];
export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const title = type === "privacy" ? "Privacy Policy" : "Terms & Conditions";
  return (
    <section className="legal-page container">
      <Eyebrow>Legal</Eyebrow>
      <TextReveal as="h1" text={title} />
      <p className="mono muted">Last updated: September 26, 2026</p>
      <div className="legal-content">
        {(type === "privacy" ? privacy : terms).map(([heading, body], i) => (
          <section key={heading}>
            <h2>
              {i + 1}. {heading}
            </h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
    </section>
  );
}
export function NotFoundPage() {
  return (
    <section className="not-found">
      <ParallaxImage src={assets.innerHero} />
      <div className="not-found-content">
        <span className="error-number">404</span>
        <TextReveal text="Looks like you’re off the workflow." as="h1" />
        <p>The page you’re looking for has moved or doesn’t exist.</p>
        <ButtonLink href="/" light>
          Back to Home
        </ButtonLink>
      </div>
    </section>
  );
}
