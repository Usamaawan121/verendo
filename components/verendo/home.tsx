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
  demoProducts,
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
  const rows = [
    demoProducts,
    [...demoProducts.slice(3), ...demoProducts.slice(0, 3)],
  ];
  return (
    <section className="integration-section section-space">
      <SectionHeading
        eyebrow="Demo Concepts"
        title="Product Ideas, by Verendo"
        description="Six original design concepts exploring CRM, bookings, commerce, analytics and automation. Created for our demo portfolio."
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
                {products.map((product) => (
                  <div
                    className="integration-logo"
                    key={product.name}
                    role="img"
                    aria-label={`${product.name}: ${product.category} demo concept`}
                    title={`${product.name} — ${product.category} (demo concept)`}
                  >
                    <div
                      style={{
                        display: "grid",
                        justifyItems: "center",
                        gap: 6,
                      }}
                    >
                      <img
                        src={media(product.image)}
                        alt=""
                        width={48}
                        height={48}
                        loading="lazy"
                      />
                      <span
                        style={{
                          fontSize: 12,
                          lineHeight: "16px",
                          color: "#a1a1aa",
                        }}
                      >
                        {product.name}
                      </span>
                    </div>
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
