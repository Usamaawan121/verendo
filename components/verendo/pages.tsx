"use client";
import { useRef, useState, type FormEvent } from "react";
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
  assets,
  config,
  media,
  posts,
  projects,
  type Project,
  type Post,
} from "@/content/site";
import { ParallaxImage, Reveal, TextReveal } from "./animation";
import { ServicePillars } from "./experience";
import { services } from "@/content/services";
import { BlogCard, ProjectCard } from "./home";
import {
  ButtonLink,
  ContactCard,
  CTA,
  Eyebrow,
  InnerHero,
  SectionHeading,
} from "./shared";
import { budgetOptions } from "@/lib/form-options";
import { submitForm } from "@/lib/submit-form";
import { FormGuard } from "./form-guard";

export function ProjectsPage() {
  return (
    <>
      <InnerHero
        eyebrow="Projects"
        title="Ideas made tangible."
        description="A selection of website and web-application portfolio projects. Each case study explains the idea, the approach and the work behind the interface."
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
        description="Ideas and practical perspectives on AI, workflows and the digital tools behind everyday business."
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
    title: "Clarity comes first",
    text: "We make the goal, the scope and the next step easy to understand.",
    Icon: Focus,
  },
  {
    title: "People stay central",
    text: "The experience should work for your customers and the people in your team.",
    Icon: Heart,
  },
  {
    title: "The details matter",
    text: "Content, design and implementation should support the same business purpose.",
    Icon: Layers,
  },
  {
    title: "Progress stays practical",
    text: "We focus on useful improvements you can understand, use and build on.",
    Icon: TrendingUp,
  },
];
export function AboutPage() {
  return (
    <>
      <section className="about-introduction container services-page-heading">
        <Eyebrow>About Verendo</Eyebrow>
        <TextReveal text="Digital work. With your business in mind." as="h1" />
        <p>
          Verendo brings AI for Business, Website Development and Digital
          Marketing together for local, small and medium businesses in the UK,
          USA and UAE.
        </p>
      </section>
      <section className="split-section container section-space about-approach">
        <Reveal className="about-art">
          <img
            src={media("design/hero.webp")}
            width={700}
            height={700}
            alt="Connected black and green modules illustrating Verendo's three service pillars"
            loading="lazy"
          />
        </Reveal>
        <div className="split-copy">
          <SectionHeading
            eyebrow="Why we exist"
            title="Your digital should make running a business feel simpler."
            description="Too often, a website, marketing activity and business tools grow in separate directions. We help you look at the whole picture and find the next improvement that makes sense."
          />
          <p>
            That could mean a clearer website, a more focused campaign or a
            useful AI workflow. The starting point is your business—not a
            package we need to sell.
          </p>
        </div>
      </section>
      <section className="values-grid container section-space">
        {values.map((value, i) => (
          <Reveal key={value.title} delay={i * 0.06}>
            <article className="value-card">
              <value.Icon size={30} strokeWidth={1.4} />
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          </Reveal>
        ))}
      </section>
      <section className="about-markets container section-space">
        <SectionHeading
          eyebrow="Who we work with"
          title="Local understanding. A connected way of working."
          description="Our focus is small and medium businesses, without limiting good ideas to a single industry."
        />
        <div>
          {[
            [
              "United Kingdom",
              "For businesses building a clearer presence and more connected customer journeys.",
            ],
            [
              "United States",
              "For local and growing businesses turning their next digital priority into a practical plan.",
            ],
            [
              "United Arab Emirates",
              "For businesses shaping their online presence around the people they want to reach.",
            ],
          ].map(([country, text]) => (
            <article key={country}>
              <span className="mono">Working with businesses in</span>
              <h3>{country}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <p className="market-disclaimer">
          These are the markets we serve remotely, not a list of office
          locations.
        </p>
      </section>
      <ServicePillars />
      <CTA />
    </>
  );
}
export function ContactPage() {
  const query = useSearchParams();
  const requested = services.find(
    (service) => service.slug === query.get("service"),
  );
  const [selectedService, setSelectedService] = useState<string>(
    requested?.slug || "",
  );
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState<"" | "success" | "error">("");
  const [guardRevision, setGuardRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    submitting.current = true;
    setStatus("");
    setStatusKind("");
    setBusy(true);
    const data = new FormData(form);
    const payload = Object.fromEntries(
      [...data.entries()].map(([key, value]) => [key, String(value)]),
    );
    try {
      const message = await submitForm(config.contactEndpoint, payload);
      form.reset();
      setSelectedService("");
      setStatus(message);
      setStatusKind("success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again.");
      setStatusKind("error");
    } finally {
      submitting.current = false;
      setBusy(false);
      setGuardRevision((value) => value + 1);
    }
  }
  return (
    <section className="contact-page container">
      <div className="contact-intro">
        <div className="contact-shade" />
        <div className="contact-intro-content">
          <SectionHeading
            as="h1"
            eyebrow="Let's talk"
            title="What is your next business move?"
            description="Tell us what you want to improve. A website, your marketing or the way your team works—we’ll help you find a sensible starting point."
          />
          <ContactCard />
          <div className="contact-direct">
            <a href={`mailto:${config.email}`}>{config.email}</a>
            <a href={`tel:${config.phone.replaceAll(" ", "")}`}>
              {config.phone}
            </a>
            <span className="mono">UK · USA · UAE</span>
          </div>
        </div>
      </div>
      <Reveal className="contact-form-wrap">
        <form className="contact-form" action={config.contactEndpoint} method="post" onSubmit={submit} aria-busy={busy}>
          <fieldset className="contact-fields" disabled={busy}>
            <label>
              <span className="mono">Your name</span>
              <input
                name="name"
                placeholder="Your full name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
              />
            </label>
            <label>
              <span className="mono">Email</span>
              <input
                name="email"
                placeholder="you@yourbusiness.com"
                required
                maxLength={254}
                type="email"
                autoComplete="email"
              />
            </label>
            <label>
              <span className="mono">Business name</span>
              <input
                name="company"
                placeholder="Your business"
                required
                maxLength={160}
                autoComplete="organization"
              />
            </label>
            <label>
              <span className="mono">What can we help with?</span>
              <select
                name="service"
                required
                value={selectedService}
                onChange={(event) => setSelectedService(event.target.value)}
              >
                <option value="" disabled>
                  Choose a starting point
                </option>
                {services.map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.title}
                  </option>
                ))}
                <option value="not-sure">Help me choose</option>
              </select>
            </label>
            <label>
              <span className="mono">Budget, if you have one</span>
              <select name="budget" defaultValue="">
                <option value="">Select your budget</option>
                {budgetOptions.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mono">Tell us a little about it</span>
              <textarea
                name="message"
                placeholder="What would you like to change, and what would a useful result look like?"
                rows={4}
                required
                minLength={10}
                maxLength={4000}
              />
            </label>
            <p className="form-terms">
              Read how we handle your enquiry in our{" "}
              <Link href="/legal/privacy-policy">Privacy Policy</Link>.
            </p>
            <FormGuard action="contact" revision={guardRevision} />
          </fieldset>
          <button className="button button-light" disabled={busy} type="submit">
            {busy ? "Sending…" : "Send project details"}
            <ArrowUpRight size={16} />
          </button>
          <p
            className="form-status"
            data-state={statusKind || undefined}
            role={statusKind === "error" ? "alert" : "status"}
            aria-live="polite"
            aria-atomic="true"
          >
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
          <TextReveal text={project.challenge} />
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
          <p>{project.approachBody}</p>
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
            <Link href="/contact">Let’s talk about your business.</Link>
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
    "How contact requests work",
    "Submitting the contact form sends your enquiry to Verendo through our email delivery provider. Newsletter submissions send a subscription request to our team. We use the details you provide to respond to your request; we do not sell them.",
  ],
  [
    "Cookies and local storage",
    "This website does not currently include advertising trackers or analytics scripts. Our hosting provider and any external services you choose to use may process technical information under their own policies.",
  ],
  [
    "Third-party services",
    "Our hosting and email providers process the technical information needed to operate this website and deliver enquiries. Cloudflare Turnstile checks form submissions for automated abuse. Booking and social links may take you to another website, where that service’s privacy terms apply.",
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
    "This website describes Verendo’s AI for Business, Website Development and Digital Marketing services. Portfolio and demo concepts illustrate work or design ideas; they do not promise a particular commercial result.",
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
      <p className="mono muted">Last updated: October 7, 2026</p>
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
        <TextReveal text="This page took a different route." as="h1" />
        <p>The page you’re looking for has moved or doesn’t exist.</p>
        <ButtonLink href="/" light>
          Back to Home
        </ButtonLink>
      </div>
    </section>
  );
}
