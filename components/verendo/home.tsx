"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  AnimatePresence,
} from "motion/react";
import {
  Check,
  Plus,
  Minus,
  ArrowUpRight,
  Circle,
  Workflow,
  Layers,
  MessageSquare,
  Clock,
  Eye,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  assets,
  companyLogos,
  faqs,
  demoProducts,
  media,
  metrics,
  plans,
  posts,
  projects,
  services,
  steps,
  testimonials,
  yearlyDiscountPercent,
  type Project,
  type Post,
} from "@/content/site";
import {
  Counter,
  ParallaxImage,
  Reveal,
  TextReveal,
  ease,
} from "./animation";
import { VerendoMonogram } from "./monogram";
import {
  ButtonLink,
  ContactCard,
  CTA,
  Eyebrow,
  SectionHeading,
} from "./shared";

function Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="hero">
      <motion.div
        className="hero-media"
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease, delay: 0.25 }}
      >
        <VerendoMonogram className="hero-video" />
        <div className="hero-shade" />
      </motion.div>
      <div className="hero-top">
        <Reveal delay={0.5}>
          <p className="mono hero-services">
            / Web & Software Development
            <br />/ Mobile Apps & UI/UX Design
            <br />/ Marketing & Automation
          </p>
        </Reveal>
        <Reveal delay={0.7}>
          <p className="hero-description">
            We build websites, apps, and software that turn your business ideas
            into clear, useful digital experiences.
          </p>
        </Reveal>
      </div>
      <div className="hero-bottom">
        <div>
          <Reveal delay={0.8}>
            <Eyebrow>Software, design & digital services</Eyebrow>
          </Reveal>
          <TextReveal text="Designed. Built. Delivered." as="h1" />
        </div>
        <Reveal delay={1}>
          <ContactCard />
        </Reveal>
      </div>
    </section>
  );
}
function Logos() {
  return (
    <section className="logo-section container">
      <Reveal>
        <p className="mono muted">Brand and identity inspiration</p>
      </Reveal>
      <div className="company-grid">
        {companyLogos.map(([name, file], i) => (
          <Reveal key={name} delay={i * 0.04}>
            <img src={media(file)} alt={name} loading="lazy" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
const painPoints = [
  { text: "Unclear User Journeys", Icon: Eye, x: -330, y: -150 },
  { text: "Slow Digital Experiences", Icon: Clock, x: 290, y: -215 },
  { text: "Disconnected Systems", Icon: Workflow, x: -340, y: 175 },
  { text: "Inconsistent Design", Icon: MessageSquare, x: 310, y: 150 },
  { text: "Manual Operations", Icon: Layers, x: 0, y: 280 },
];
const painCompactQuery = "(max-width: 809px)";
function subscribeToPainLayout(onChange: () => void) {
  const query = window.matchMedia(painCompactQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getCompactPainLayout = () => window.matchMedia(painCompactQuery).matches;
const getServerPainLayout = () => false;
function PainBadge({
  point,
  index,
  progress,
  compact,
}: {
  point: (typeof painPoints)[number];
  index: number;
  progress: MotionValue<number>;
  compact: boolean;
}) {
  const start = 0.08 + index * 0.145;
  const opacity = useTransform(
    progress,
    [0, start, start + 0.13, start + 0.2],
    [1, 1, 1, 0],
  );
  const scale = useTransform(progress, [0, start, start + 0.2], [1, 1, 1.08]);
  const travelX = useTransform(
    progress,
    [0, start, start + 0.2],
    [point.x, point.x, point.x * 1.04],
  );
  // Mobile CSS scales the parent to 0.5, so its local bounds must be doubled.
  const halfWidth = compact ? "100vw" : "50vw";
  const x = useTransform(
    travelX,
    (value) =>
      `clamp(calc(40px - ${halfWidth}), ${value}px, calc(${halfWidth} - 100% - 40px))`,
  );
  const y = useTransform(
    progress,
    [0, start, start + 0.2],
    [point.y, point.y, point.y * 1.04],
  );
  return (
    <motion.div className="pain-badge" style={{ x, y, scale, opacity }}>
      <point.Icon size={19} />
      {point.text}
    </motion.div>
  );
}
function Pain() {
  const ref = useRef<HTMLElement>(null),
    reduced = useReducedMotion();
  const compact = useSyncExternalStore(
    subscribeToPainLayout,
    getCompactPainLayout,
    getServerPainLayout,
  );
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  return (
    <section
      className={`pain-section ${reduced ? "reduced" : ""}`}
      ref={ref}
      aria-label="The hidden cost of digital friction"
    >
      <div className="pain-sticky">
        <div className="pain-ring" />
        <motion.div
          className="pain-title"
          style={{ opacity: reduced ? 1 : opacity }}
        >
          <TextReveal text="The Hidden Cost of Digital Friction" />
        </motion.div>
        <div className="pain-badges">
          {painPoints.map((p, i) =>
            reduced ? (
              <div className="pain-badge" key={p.text}>
                {p.text}
              </div>
            ) : (
              <PainBadge
                point={p}
                key={p.text}
                index={i}
                progress={scrollYProgress}
                compact={compact}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
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
      className="stack-card"
      style={{
        scale: reduced ? 1 : scale,
        opacity: reduced ? 1 : opacity,
        top: 100 + index * 10,
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
            Selected portfolio work across streaming, web applications, SaaS
            software design, and digital services.
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
function HowItWorks() {
  return (
    <section className="how-section container section-space">
      <SectionHeading
        eyebrow="How it works"
        title="A clear path from idea to digital product"
        description="We bring planning, design, development, and testing together around a clearly agreed project scope."
        center
      />
      <div className="steps-grid">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <div className="step-image">
              <img
                src={media(step.image)}
                alt="Abstract metallic automation sculpture"
                loading="lazy"
              />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </Reveal>
        ))}
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
                    <div style={{ display: "grid", justifyItems: "center", gap: 6 }}>
                      <img
                        src={media(product.image)}
                        alt=""
                        width={48}
                        height={48}
                        loading="lazy"
                      />
                      <span style={{ fontSize: 12, lineHeight: "16px", color: "#a1a1aa" }}>
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
function Services() {
  return (
    <section className="services-section container section-space" id="services">
      <div className="services-intro">
        <SectionHeading
          eyebrow="Services"
          title="Digital Services Built Around You"
          description="We create websites, web and mobile applications, and custom software, supported by thoughtful design, digital marketing, and automation."
        />
      </div>
      <div className="services-list">
        {services.map((s, i) => (
          <Reveal key={s.title}>
            <article className="service-card">
              <div className="service-copy">
                <p className="mono muted">/ 0{i + 1}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul>
                  {s.items.map((item) => (
                    <li className="mono" key={item}>
                      <Plus size={12} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <img
                src={media(s.image)}
                alt="Metallic abstract structure"
                loading="lazy"
              />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
const comparison = [
  [
    "Approach",
    "Business goals first",
    "Approach varies",
    "Depends on hire",
  ],
  [
    "Workflow",
    "Around your users",
    "Scope varies",
    "If expertise exists",
  ],
  ["Speed", "Agreed milestones", "Schedule varies", "Hiring & onboarding"],
  [
    "Optimization",
    "Continuous improvement",
    "Support varies",
    "Limited by bandwidth",
  ],
  [
    "Cost Efficiency",
    "Clear scope and pricing",
    "Contract dependent",
    "Salary + overhead",
  ],
];
function WhyUs() {
  return (
    <section className="why-section section-space">
      <ParallaxImage src={assets.landscape} />
      <div className="why-shade" />
      <div className="container why-content">
        <SectionHeading
          eyebrow="Why us"
          title="Built for Real Business Impact"
          description="Clear requirements, thoughtful interfaces, and maintainable software guide our work from discovery to delivery."
          center
        />
        <div className="comparison-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>
                  <span className="sr-only">Feature</span>
                </th>
                <th>
                  <img src={assets.logo} alt="Verendo" />
                </th>
                <th>Other Agencies</th>
                <th>Hire In House</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={cell} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={cell}>
                        {i === 1 ? <Check size={14} /> : <Minus size={14} />}
                        <span>{cell}</span>
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
function Testimonials() {
  return (
    <section className="testimonials-section section-space">
      <div className="container">
        <Carousel opts={{ align: "start", loop: true }}>
          <div className="section-row">
            <SectionHeading
              eyebrow="Testimonials"
              title="Hear from our satisfied clients"
            />
            <div className="carousel-arrows">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
          <CarouselContent className="testimonial-track">
            {testimonials.map((t) => (
              <CarouselItem className="testimonial-slide" key={t.name}>
                <div className="testimonial-card">
                  <div className="testimonial-copy">
                    <img
                      src={media(t.logo)}
                      className="testimonial-logo"
                      alt={t.role.replace("Founder of ", "")}
                    />
                    <blockquote>{t.quote}</blockquote>
                    <div>
                      <p>{t.name}</p>
                      <span className="mono muted">{t.role}</span>
                    </div>
                  </div>
                  <img
                    src={media(t.image)}
                    alt={t.name}
                    className="testimonial-photo"
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Metrics />
      </div>
    </section>
  );
}
function Pricing() {
  const [period, setPeriod] = useState("monthly");
  return (
    <section className="pricing-section container section-space" id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Flexible plans for your digital goals"
        center
      />
      <Tabs value={period} onValueChange={setPeriod} className="pricing-tabs">
        <TabsList aria-label="Billing period">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">
            Yearly <span className="discount">−{yearlyDiscountPercent}%</span>
          </TabsTrigger>
        </TabsList>
        {["monthly", "yearly"].map((p) => (
          <TabsContent value={p} key={p}>
            <div className="pricing-grid">
              {plans.map((plan, i) => (
                <article
                  className={`pricing-card ${i === 1 ? "popular" : ""}`}
                  key={plan.name}
                >
                  <div className="plan-name">
                    <h3>{plan.name}</h3>
                    {i === 1 && <span className="mono pill">Popular</span>}
                  </div>
                  <p className="plan-description">{plan.description}</p>
                  <div className="plan-price">
                    <AnimatePresence mode="wait">
                      <motion.strong
                        key={period}
                        initial={{ opacity: 0, filter: "blur(5px)", y: 8 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        ${period === "monthly" ? plan.monthly : plan.yearly}
                      </motion.strong>
                    </AnimatePresence>
                    <span>/mo</span>
                  </div>
                  <ButtonLink
                    href={`/contact?plan=${plan.name}&billing=${period}`}
                    light={i === 1}
                  >
                    Choose {plan.name} Plan
                  </ButtonLink>
                  <p className="guarantee">
                    <Circle size={10} />
                    30-day money-back guarantee
                  </p>
                  <ul>
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Check size={16} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
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
      <Hero />
      <Logos />
      <Pain />
      <Work />
      <HowItWorks />
      <Integration />
      <Services />
      <WhyUs />
      <Testimonials />
      <Pricing />
      <Blog />
      <FAQ />
      <CTA />
    </>
  );
}
