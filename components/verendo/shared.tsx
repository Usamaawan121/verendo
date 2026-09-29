"use client";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, ArrowRight, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { assets, config, navigation } from "@/content/site";
import { ParallaxImage, Reveal, TextReveal, Video } from "./animation";
import { VerendoMonogram } from "./monogram";

export function ButtonLink({
  href,
  children,
  light = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      className={`button ${light ? "button-light" : ""} ${className}`}
      href={href}
    >
      <span className="button-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <span className="button-icon">
        <ArrowUpRight size={16} />
        <ArrowUpRight size={16} />
      </span>
    </Link>
  );
}
export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`brand ${className}`} aria-label="Verendo home">
      <img src={assets.logo} alt="verendo" width={137} height={36} />
    </Link>
  );
}
export function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false),
    [hidden, setHidden] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 60);
    if (Math.abs(v - (scrollY.getPrevious() ?? 0)) > 1.5)
      setHidden(v > 180 && v > (scrollY.getPrevious() ?? 0));
  });
  return (
    <motion.header
      className={`site-header ${scrolled ? "is-scrolled" : ""}`}
      animate={{ y: hidden && !open ? -85 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={path === n.href ? "page" : undefined}
          >
            {n.label}
            <span />
          </Link>
        ))}
      </nav>
      <div className="header-cta">
        <ButtonLink href="/contact">Get Free Consultation</ButtonLink>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="menu-toggle" aria-label="Open navigation">
            <Menu size={23} />
          </button>
        </SheetTrigger>
        <SheetContent side="top" className="mobile-menu">
          <SheetTitle>
            <Brand />
          </SheetTitle>
          <SheetDescription className="sr-only">
            Explore Verendo
          </SheetDescription>
          <nav aria-label="Mobile navigation">
            {[{ label: "Home", href: "/" }, ...navigation].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
                {n.label}
                <ArrowUpRight />
              </Link>
            ))}
          </nav>
          <ButtonLink href="/contact" light>
            Get Free Consultation
          </ButtonLink>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-dot" />
      {children}
    </p>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
  as = "h2",
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
  as?: "h1" | "h2";
  children?: ReactNode;
}) {
  return (
    <div className={`section-heading ${center ? "center" : ""}`}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <TextReveal text={title} as={as} />
      {description && (
        <Reveal delay={0.12}>
          <p className="section-description">{description}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
export function ContactCard() {
  return (
    <div className="contact-card">
      <Video src={assets.avatar} className="contact-avatar" />
      <div className="contact-person">
        <p>Talk with Clarissa</p>
        <span className="mono">Director of Verendo</span>
        <ButtonLink href={config.bookingUrl} light>
          Book 15-mins call
        </ButtonLink>
      </div>
    </div>
  );
}
export function CTA() {
  return (
    <section className="cta-section">
      <ParallaxImage src={assets.landscape} />
      <div className="cta-shade" />
      <div className="cta-content">
        <SectionHeading
          eyebrow="Let’s get started"
          title="Ready to Refine Your Workflow?"
          description="Share your current process. We’ll help you identify what can be automated and where efficiency can be improved."
          center
        />
        <Reveal>
          <ButtonLink href="/contact" light>
            Get Free Consultation
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export async function submitOrDraft(
  endpoint: string,
  payload: Record<string, string>,
  subject: string,
) {
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok)
      throw new Error(
        "We could not send your request. Please try again or email us.",
      );
    return "Thank you. Your request was sent.";
  }
  const body = Object.entries(payload)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n\n");
  window.location.href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return "Your email app was requested. Review and send the draft there. If it did not open, use the email link above.";
}
function Newsletter() {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const data = new FormData(e.currentTarget);
    try {
      setMessage(
        await submitOrDraft(
          config.newsletterEndpoint,
          { email: String(data.get("email")) },
          "Newsletter subscription request",
        ),
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="newsletter" onSubmit={submit}>
      <label className="mono" htmlFor="newsletter-email">
        Subscribe to our newsletter
      </label>
      <div className="newsletter-input">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label={
            config.newsletterEndpoint
              ? "Subscribe to newsletter"
              : "Open newsletter email draft"
          }
        >
          <ArrowRight size={20} />
        </button>
      </div>
      <p className="form-status" role="status">
        {message}
      </p>
    </form>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main container">
        <div className="footer-brand">
          <h2>Clear. Precise. Automated.</h2>
          <VerendoMonogram variant="footer" className="footer-video" />
        </div>
        <div className="footer-navigation">
          <span className="mono muted">Navigation</span>
          <nav aria-label="Footer navigation">
            {[
              { label: "Home", href: "/" },
              ...navigation,
              { label: "Privacy Policy", href: "/legal/privacy-policy" },
              { label: "Terms and Condition", href: "/legal/terms-conditions" },
              { label: "404", href: "/404" },
            ].map((n) => (
              <Link href={n.href} key={n.href}>
                {n.label}
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-contact">
          <div>
            <span className="mono muted">Socials</span>
            <div className="social-links">
              <a
                href={config.socials.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <span aria-hidden="true">◎</span>
              </a>
              <a
                href={config.socials.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <span aria-hidden="true" style={{ fontWeight: 600 }}>
                  in
                </span>
              </a>
              <a
                href={config.socials.x}
                aria-label="X"
                target="_blank"
                rel="noreferrer"
              >
                𝕏
              </a>
            </div>
          </div>
          <div>
            <span className="mono muted">Email</span>
            <a href={`mailto:${config.email}`}>{config.email}</a>
          </div>
          <div>
            <span className="mono muted">Phone</span>
            <a href={`tel:${config.phone.replaceAll(" ", "")}`}>
              {config.phone}
            </a>
          </div>
          <Newsletter />
        </div>
      </div>
      <div className="footer-bottom container mono">
        <span>© 2026 Verendo. All rights reserved.</span>
        <span>
          Made by{" "}
          <a href="https://veloxthemes.com" target="_blank" rel="noreferrer">
            Velox Themes ↗
          </a>
        </span>
      </div>
    </footer>
  );
}
export function InnerHero({
  eyebrow,
  title,
  description,
  image = assets.innerHero,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="inner-hero">
      <ParallaxImage src={image} />
      <div className="inner-shade" />
      <div className="container">
        <SectionHeading
          as="h1"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </div>
    </section>
  );
}
