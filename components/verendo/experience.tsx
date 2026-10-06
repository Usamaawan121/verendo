"use client";

import { useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Clock3,
  Globe2,
  MessageSquare,
  Minus,
  Sparkles,
  Workflow,
} from "lucide-react";
import { config, media } from "@/content/site";
import { processSteps, services } from "@/content/services";
import { ease, Reveal } from "./animation";
import { ButtonLink, Eyebrow, SectionHeading } from "./shared";
import { useMotionLayout } from "./motion-layout";

const unit = (value: number) => Math.min(1, Math.max(0, value));

export function GrowthHero() {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 80, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 80, damping: 20 });
  return (
    <section className="growth-hero container">
      <div className="growth-heading">
        <Reveal>
          <Eyebrow>Digital ambition. Real-world focus.</Eyebrow>
        </Reveal>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          More leads. <br />
          <span>Less busywork.</span>
        </motion.h1>
        <span className="hero-coordinate mono" aria-hidden="true">
          / Verendo — built around your business
        </span>
      </div>
      <div className="growth-hero-grid">
        <div
          className="growth-art growth-art-video"
          onPointerMove={(event) => {
            if (reduced || event.pointerType !== "mouse") return;
            const bounds = event.currentTarget.getBoundingClientRect();
            rotateX.set(
              -((event.clientY - bounds.top) / bounds.height - 0.5) * 7,
            );
            rotateY.set(
              ((event.clientX - bounds.left) / bounds.width - 0.5) * 9,
            );
          }}
          onPointerLeave={() => {
            rotateX.set(0);
            rotateY.set(0);
          }}
        >
          <div className="art-grid" aria-hidden="true" />
          <motion.div className="growth-sculpture" style={{ rotateX, rotateY }}>
            <div className="growth-studio-frame">
              <video
                className="growth-studio-video"
                width={1280}
                height={720}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={media("design/digital-studio-poster.jpg")}
                aria-label="Digital Studio: Verendo website and mobile design showcase"
              >
                <source
                  src={media("design/02-digital-studio.mp4")}
                  type="video/mp4"
                />
              </video>
            </div>
          </motion.div>
          <span className="hero-orbit orbit-one mono">
            <Workflow size={13} />
            AI for Business
          </span>
          <span className="hero-orbit orbit-two mono">
            <Globe2 size={13} />
            Website Development
          </span>
          <span className="hero-orbit orbit-three mono">
            <ArrowUpRight size={13} />
            Digital Marketing
          </span>
          <span className="art-caption mono">
            Three services. One connected direction.
          </span>
        </div>
        <div className="growth-intro">
          <Reveal delay={0.1}>
            <p className="hero-lead">
              Your business has enough moving parts.
              <br />
              Let your digital tools work together.
            </p>
            <p>
              We bring AI, website development and digital marketing into one
              clear plan—helping people find you, choose you and work with you.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="hero-actions">
            <ButtonLink href={config.bookingUrl} light>
              Book a discovery call
            </ButtonLink>
            <ButtonLink href="/services">Explore our services</ButtonLink>
          </Reveal>
          <Reveal delay={0.25} className="hero-market-note">
            <span className="availability-dot" aria-hidden="true" />
            <p>
              For local, small &amp; medium businesses
              <br />
              <span className="mono">United Kingdom · United States · UAE</span>
            </p>
          </Reveal>
        </div>
      </div>
      <a className="hero-scroll mono" href="#business-friction">
        Built for your next step <ArrowDown size={14} />
      </a>
    </section>
  );
}

export function Markets() {
  return (
    <div className="market-strip container">
      <span className="mono">
        Local ambition.
        <br />A wider perspective.
      </span>
      <p>For the next stage of your business.</p>
      <div className="market-codes mono">
        <span>UK</span>
        <span>USA</span>
        <span>UAE</span>
      </div>
    </div>
  );
}

const frictionPoints = [
  {
    text: "Move faster than your competition",
    Icon: MessageSquare,
    left: 24,
    top: 22,
  },
  { text: "Let AI do the heavy work", Icon: Globe2, left: 72, top: 30 },
  {
    text: "Turn clicks into customers",
    Icon: Workflow,
    left: 22,
    top: 70,
  },
  {
    text: "Cut operational costs and boost margins",
    Icon: Clock3,
    left: 73,
    top: 80,
  },
];
function FrictionBadge({
  index,
  progress,
  fixed,
}: {
  index: number;
  progress: MotionValue<number>;
  fixed: boolean;
}) {
  const point = frictionPoints[index];
  const start = 0.08 + index * 0.16;
  const opacity = useTransform(() => unit((progress.get() - start) / 0.12));
  const y = useTransform(
    () => 24 * (1 - unit((progress.get() - start) / 0.14)),
  );
  return (
    <div
      className="friction-position"
      style={
        {
          "--badge-left": `${point.left}%`,
          "--badge-top": `${point.top}%`,
        } as CSSProperties
      }
    >
      {fixed ? (
        <Reveal className="friction-badge">
          <point.Icon size={16} />
          <span>{point.text}</span>
        </Reveal>
      ) : (
        <motion.div className="friction-badge" style={{ opacity, y }}>
          <point.Icon size={16} />
          <span>{point.text}</span>
        </motion.div>
      )}
    </div>
  );
}
export function BusinessFriction() {
  const ref = useRef<HTMLElement>(null);
  const { pinned } = useMotionLayout();
  const fixed = !pinned;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
    trackContentSize: true,
  });
  return (
    <section
      ref={ref}
      id="business-friction"
      className={`friction-section ${fixed ? "sequence-static" : ""}`}
      aria-labelledby="friction-heading"
    >
      <div className="friction-sticky">
        <div className="friction-stage container">
          <div className="friction-heading">
            <Eyebrow>Built for what&apos;s next</Eyebrow>
            <h2 id="friction-heading">
              Smarter tech
              <br />
              <span>unstoppable Growth</span>
            </h2>
          </div>
          <div className="friction-labels">
            {frictionPoints.map((point, index) => (
              <FrictionBadge
                key={point.text}
                index={index}
                progress={scrollYProgress}
                fixed={fixed}
              />
            ))}
          </div>
          <p className="friction-footnote mono">
            Engineered for performance. Built for growth.
          </p>
        </div>
      </div>
    </section>
  );
}

export function PixelArtwork({
  image,
  className = "",
}: {
  image: string;
  className?: string;
}) {
  return (
    <div className={`pixel-artwork ${className}`} aria-hidden="true">
      <img src={media(image)} alt="" width={600} height={600} loading="lazy" />
      <div className="artwork-pixels">
        {Array.from({ length: 36 }, (_, i) => (
          <span
            key={i}
            style={{
              animationDelay: `${((i * 7 + Math.floor(i / 6) * 3) % 13) * 0.027}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ProcessSequence() {
  const ref = useRef<HTMLElement>(null);
  const { pinned } = useMotionLayout();
  const fixed = !pinned;
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
    trackContentSize: true,
  });
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setActive(
      Math.min(
        processSteps.length - 1,
        Math.max(0, Math.floor(value * processSteps.length)),
      ),
    ),
  );
  return (
    <section
      className="process-section"
      id="how-we-work"
      aria-labelledby="process-heading"
    >
      <div className="container section-space process-intro">
        <SectionHeading
          eyebrow="How we work"
          title="A clear path. From first conversation to next chapter."
          description="Four considered steps, with your business at the centre of each one."
          center
        />
        <h2 id="process-heading" className="sr-only">
          Our four-step process
        </h2>
      </div>
      <section
        ref={ref}
        className={`process-sequence ${fixed ? "sequence-static" : ""}`}
        aria-label="Project delivery stages"
      >
        {fixed ? (
          <div className="process-mobile container">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} className="process-mobile-card">
                <span className="process-number mono">/ 0{index + 1}</span>
                <PixelArtwork image={step.image} />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <span className="process-detail mono">{step.detail}</span>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="process-sticky">
            <div className="process-stage container" aria-hidden="true">
              <div className="process-count">
                <span className="process-number mono">/ 0{active + 1}</span>
                <div className="process-progress" aria-hidden="true">
                  {processSteps.map((step, i) => (
                    <span
                      key={step.title}
                      className={i === active ? "active" : ""}
                    />
                  ))}
                </div>
                <span className="mono muted">Scroll to explore</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="process-art"
                  initial={{ opacity: 0, rotate: -4, scale: 0.96 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <PixelArtwork image={processSteps[active].image} />
                </motion.div>
              </AnimatePresence>
              <div className="process-copy">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -34 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <span className="mono process-detail">
                      {processSteps[active].detail}
                    </span>
                    <h3>{processSteps[active].title}</h3>
                    <p>{processSteps[active].text}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="sr-only">
              {processSteps.map((step, i) => (
                <div key={step.title}>
                  <h3>
                    Step {i + 1}: {step.title}
                  </h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </section>
  );
}

const connected = [
  "One plan across AI, your website and marketing",
  "Priorities shaped around your business",
  "A clear scope before work begins",
  "Reviewable progress and useful feedback",
  "Practical handover for your team",
  "Support options agreed before launch",
];
const disconnected = [
  "Separate tasks without a shared direction",
  "New tools before the problem is clear",
  "Unclear responsibilities and next steps",
  "Updates that are hard to evaluate",
  "Knowledge that stays outside your team",
  "No plan for what happens afterwards",
];
export function WhyVerendo() {
  const ref = useRef<HTMLElement>(null);
  const { pinned, compact } = useMotionLayout();
  const fixed = !pinned;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
    trackContentSize: true,
  });
  // Keep these on one JS progress value: independently accelerated native
  // opacity timelines can use different ranges inside a sticky container.
  const titleOpacity = useTransform(
    () => 1 - unit((scrollYProgress.get() - 0.16) / 0.18),
  );
  const titleY = useTransform(
    () => -30 * unit((scrollYProgress.get() - 0.18) / 0.18),
  );
  const cardOpacity = useTransform(() =>
    unit((scrollYProgress.get() - 0.24) / 0.18),
  );
  const cardY = useTransform(
    () => 36 * (1 - unit((scrollYProgress.get() - 0.24) / 0.18)),
  );
  // Phones show the same comparison as a two-card sequence, so neither card
  // needs to be squeezed or clipped to fit a single viewport.
  const firstOpacity = useTransform(() =>
    compact ? 1 - unit((scrollYProgress.get() - 0.64) / 0.1) : 1,
  );
  const firstScale = useTransform(() =>
    compact ? 1 - 0.035 * unit((scrollYProgress.get() - 0.64) / 0.1) : 1,
  );
  const secondOpacity = useTransform(() =>
    compact ? unit((scrollYProgress.get() - 0.64) / 0.1) : 1,
  );
  const secondY = useTransform(() =>
    compact ? 28 * (1 - unit((scrollYProgress.get() - 0.64) / 0.1)) : 0,
  );
  return (
    <section
      ref={ref}
      className={`difference-section ${fixed ? "sequence-static" : ""}`}
      aria-labelledby="difference-heading"
    >
      <div className="difference-sticky container">
        <motion.div
          className="difference-heading"
          style={
            fixed ? { opacity: 1, y: 0 } : { opacity: titleOpacity, y: titleY }
          }
        >
          <Eyebrow>Why Verendo</Eyebrow>
          <h2 id="difference-heading">
            Connected thinking.
            <br />
            <span>A clearer way forward.</span>
          </h2>
        </motion.div>
        <motion.div
          className="difference-cards"
          style={
            fixed ? { opacity: 1, y: 0 } : { opacity: cardOpacity, y: cardY }
          }
        >
          <motion.article
            className="difference-card difference-verendo"
            style={
              fixed
                ? { opacity: 1, scale: 1 }
                : { opacity: firstOpacity, scale: firstScale }
            }
          >
            <div className="difference-card-title">
              <span className="difference-brand">
                Verendo<span>↗</span>
              </span>
              <span className="mono">A connected approach</span>
            </div>
            <ul>
              {connected.map((text) => (
                <li key={text}>
                  <Check size={15} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </motion.article>
          <motion.article
            className="difference-card difference-other"
            style={
              fixed
                ? { opacity: 1, y: 0 }
                : { opacity: secondOpacity, y: secondY }
            }
          >
            <div className="difference-card-title">
              <h3>Disconnected work</h3>
              <span className="mono">What we help you move beyond</span>
            </div>
            <ul>
              {disconnected.map((text) => (
                <li key={text}>
                  <Minus size={15} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </motion.article>
          <p className="difference-caption">
            The value is in how the pieces work together.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function ServicePillars({ overview = false }: { overview?: boolean }) {
  return (
    <section
      className={`pillar-section container section-space ${overview ? "pillar-overview" : ""}`}
      id="services"
    >
      {!overview && (
        <div className="section-row">
          <SectionHeading
            eyebrow="What we do"
            title="Three services. Built around your next step."
            description="Start with the need that matters most. We will help you connect the rest."
          />
          <span className="mono pillar-count">/ 01 — 03</span>
        </div>
      )}
      <div className="pillar-grid">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={index * 0.07}>
            <article className={`pillar-card pillar-${service.icon}`}>
              <div className="pillar-card-top">
                <span className="mono">/ 0{index + 1}</span>
                <ArrowUpRight size={21} />
              </div>
              <div className="pillar-art">
                <img
                  src={media(service.image)}
                  width={420}
                  height={420}
                  alt=""
                  loading="lazy"
                />
              </div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>
                    <span />
                    {item}
                  </li>
                ))}
              </ul>
              <Link className="text-link" href={`/services/${service.slug}`}>
                Explore {service.title}
                <ArrowUpRight size={17} />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function WorkingCommitments() {
  return (
    <section className="commitments-section container section-space">
      <SectionHeading
        eyebrow="Working together"
        title="Good work starts with a clear understanding."
        description="A few things you should be able to expect from the people building your next step."
      />
      <div className="commitments-grid">
        {[
          {
            Icon: MessageSquare,
            title: "Plain-spoken communication",
            text: "Clear explanations, useful updates and room for your questions. You should always know what we are working towards.",
          },
          {
            Icon: Workflow,
            title: "A scope that makes sense",
            text: "We agree the deliverables, responsibilities and costs before starting. Changes are discussed before they become extra work.",
          },
          {
            Icon: Sparkles,
            title: "Progress you can understand",
            text: "We review the work against the goals we set together, so the next decision is grounded in something useful.",
          },
        ].map((item) => (
          <Reveal key={item.title}>
            <article>
              <item.Icon size={25} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
