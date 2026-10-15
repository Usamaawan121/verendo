"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  faqs,
  media,
  metrics,
  posts,
  projects,
  type Project,
  type Post,
} from "@/content/site";
import { Counter, Reveal } from "./animation";
import { useMotionLayout } from "./motion-layout";
import { ButtonLink, ContactCard, CTA, SectionHeading } from "./shared";
import {
  GrowthHero,
  Markets,
  BusinessFriction,
  ProcessSequence,
  ServicePillars,
  WhyVerendo,
  WorkingCommitments,
} from "./experience";

export function ProjectCard({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  return (
    <article className={`project-card ${compact ? "compact" : ""}`}>
      <Link
        href={`/projects/${project.slug}`}
        className="project-visual"
        aria-label={`View ${project.name} case study`}
      >
        <img
          className="project-image"
          src={media(project.image)}
          alt={`${project.name} project visual`}
          loading="lazy"
        />
        <img
          className="project-logo"
          src={media(project.logo)}
          alt={project.name}
        />
        <span className="image-arrow">
          <ArrowUpRight />
        </span>
      </Link>
      <div className="project-copy">
        <div className="project-meta mono">
          <span>{project.year}</span>
          <span>{project.category}</span>
        </div>
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <ButtonLink href={`/projects/${project.slug}`}>
            View Case Study
          </ButtonLink>
        </div>
        <div className="project-stats">
          {project.stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span className="mono">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
function StackCard({
  project,
  index,
  count,
  progress,
}: {
  project: Project;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const { compact } = useMotionLayout();
  const [stickyTop, setStickyTop] = useState(100 + index * 10);
  useEffect(() => {
    const element = card.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // A tall card must scroll completely into view before its bottom pins.
        const preferred = compact ? 78 + index * 6 : 100 + index * 10;
        setStickyTop(
          Math.min(preferred, window.innerHeight - element.offsetHeight - 24),
        );
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, [compact, index]);
  const scale = useTransform(
    progress,
    [index / count, (index + 1) / count],
    [1, index === count - 1 ? 1 : 0.93],
  );
  const opacity = useTransform(
    progress,
    [index / count, (index + 1) / count],
    [1, index === count - 1 ? 1 : 0.5],
  );
  return (
    <motion.div
      ref={card}
      className="stack-card"
      style={{
        scale: reduced ? 1 : scale,
        opacity: reduced ? 1 : opacity,
        top: stickyTop,
      }}
    >
      <ProjectCard project={project} />
    </motion.div>
  );
}
function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return (
    <section className="work-section container section-space" id="works">
      <div className="section-row">
        <SectionHeading
          eyebrow="Our works"
          title="Ideas. Products. Possibilities."
        />
        <Reveal>
          <p className="section-side-copy">
            A selection of website and web-application projects, showing how
            ideas become clear digital experiences.
          </p>
        </Reveal>
      </div>
      <div className="project-stack" ref={ref}>
        {projects.slice(0, 3).map((p, i) => (
          <StackCard
            key={p.slug}
            project={p}
            index={i}
            count={3}
            progress={scrollYProgress}
          />
        ))}
      </div>
      <div className="center-action">
        <ButtonLink href="/projects">See All Case Studies</ButtonLink>
      </div>
    </section>
  );
}
function Integration() {
  const tools = [
    { name: "OpenAI", mark: "openai" },
    { name: "Claude", mark: "claude" },
    { name: "n8n", mark: "n8n" },
    { name: "Make", mark: "make" },
    { name: "WordPress", mark: "wordpress" },
    { name: "Meta Ads", mark: "meta" },
    { name: "Google Ads", mark: "google-ads" },
  ];
  const rows = [tools, [...tools.slice(3), ...tools.slice(0, 3)]];
  return (
    <section className="integration-section section-space">
      <SectionHeading
        eyebrow="The tools behind the work"
        title="Your goals first. Tools second."
        description="We choose platforms for the work your business needs—from automation and AI to websites and ads."
        center
      />
      <div className="integration-mask">
        {rows.map((products, row) => (
          <div
            className={`integration-track ${row ? "reverse" : ""}`}
            key={row}
          >
            {[0, 1].map((copy) => (
              <div
                className="integration-set"
                aria-hidden={row === 1 || copy === 1}
                key={copy}
              >
                {products.map((tool) => (
                  <div
                    className="integration-logo"
                    key={tool.name}
                    role="img"
                    aria-label={`${tool.name} platform`}
                    title={tool.name}
                  >
                    <ToolLogo name={tool.name} mark={tool.mark} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolLogo({ name, mark }: { name: string; mark: string }) {
  return (
    <div className={`tool-brand tool-brand-${mark}`}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        {mark === "openai" && (
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M24 8.5a8 8 0 0 1 13.7 5.7v5.3" />
            <path d="M37.7 19.5a8 8 0 0 1 0 16l-4.6 2.7" />
            <path d="M33.1 38.2a8 8 0 0 1-13.8-5.7v-5.3" />
            <path d="M19.3 27.2a8 8 0 0 1 0-16l4.7-2.7" />
            <path d="m20 11.2 13.1 7.6v10.4L20 36.8" />
            <path d="m37.5 20-13.5 7.8-9-5.2V12.2" />
          </g>
        )}
        {mark === "claude" && (
          <g fill="currentColor">
            <path
              d="M24 3.5 27.2 18 40.5 10l-8 13.2 14.5 3.3-14.5 3.2 8 13.3-13.3-8L24 49.5l-3.2-14.5-13.3 8 8-13.3L1 26.5l14.5-3.3-8-13.2 13.3 8L24 3.5Z"
              transform="translate(0 -2) scale(.96)"
            />
          </g>
        )}
        {mark === "n8n" && (
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          >
            <path d="M14 24h20M17 18l14 12" />
            <circle cx="12" cy="24" r="5" fill="currentColor" stroke="none" />
            <circle cx="36" cy="24" r="5" fill="currentColor" stroke="none" />
            <circle cx="32" cy="36" r="4" fill="currentColor" stroke="none" />
          </g>
        )}
        {mark === "make" && (
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 34 20 14l9 17 10-17" />
            <circle cx="9" cy="34" r="3" fill="currentColor" stroke="none" />
            <circle cx="20" cy="14" r="3" fill="currentColor" stroke="none" />
            <circle cx="29" cy="31" r="3" fill="currentColor" stroke="none" />
            <circle cx="39" cy="14" r="3" fill="currentColor" stroke="none" />
          </g>
        )}
        {mark === "wordpress" && (
          <g>
            <circle
              cx="24"
              cy="24"
              r="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <text
              x="24"
              y="32"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="25"
              fontWeight="700"
              fill="currentColor"
            >
              W
            </text>
          </g>
        )}
        {mark === "meta" && (
          <path
            d="M7 32c4-12 8-18 12-18 6 0 12 20 17 20 3 0 5-5 5-10 0-6-3-10-7-10-6 0-12 20-18 20-4 0-7-5-7-11 0-5 2-9 5-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}
        {mark === "google-ads" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M17 8a8 8 0 0 1 14 0l14 25a8 8 0 0 1-14 8L17 16a8 8 0 0 1 0-8Z"
              fill="#34A853"
            />
            <path
              d="M17 8a8 8 0 0 1 14 0L17 33a8 8 0 0 1-14-8L17 8Z"
              fill="#4285F4"
            />
            <circle cx="10" cy="34" r="8" fill="#FBBC04" />
          </g>
        )}
      </svg>
      <span>{name}</span>
    </div>
  );
}
export function Metrics() {
  return (
    <div className="metrics-grid">
      {metrics.map((m) => (
        <div key={m.label}>
          <strong>
            <Counter value={m.value} suffix={m.suffix} />
          </strong>
          <span className="mono">{m.label}</span>
        </div>
      ))}
    </div>
  );
}
export function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-image">
        <img
          src={media(post.image)}
          alt="Abstract metallic editorial artwork"
          loading="lazy"
        />
        <span className="image-arrow">
          <ArrowUpRight />
        </span>
      </div>
      <div className="blog-meta mono">
        <span>{post.category}</span>
        <span>March 6, 2026</span>
      </div>
      <h3>{post.title}</h3>
    </Link>
  );
}
function Blog() {
  return (
    <section className="blog-section container section-space">
      <div className="section-row">
        <SectionHeading eyebrow="Blog" title="Insights on AI & Automation" />
        <ButtonLink href="/blog">See More</ButtonLink>
      </div>
      <div className="blog-grid">
        {posts.slice(0, 3).map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.1}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
function FAQ() {
  return (
    <section className="faq-section container section-space">
      <div>
        <SectionHeading
          eyebrow="FAQ"
          title="Have questions? Check out the FAQs"
        />
        <ContactCard />
      </div>
      <Accordion type="multiple" defaultValue={["faq-0"]} className="faq-list">
        {faqs.map(([question, answer], i) => (
          <AccordionItem value={`faq-${i}`} key={question}>
            <AccordionTrigger>
              {question}
              <span className="faq-plus">
                <Plus size={17} />
                <Minus size={17} />
              </span>
            </AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
export function Home() {
  return (
    <>
      <GrowthHero />
      <Markets />
      <BusinessFriction />
      <Work />
      <ProcessSequence />
      <Integration />
      <ServicePillars />
      <WhyVerendo />
      <WorkingCommitments />
      <Blog />
      <FAQ />
      <CTA />
    </>
  );
}
