"use client";
import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { assets, config, navigation } from "@/content/site";
import { services } from "@/content/services";
import { ParallaxImage, Reveal, TextReveal } from "./animation";
import { VerendoMonogram } from "./monogram";
import { FormGuard } from "./form-guard";
import { submitForm } from "@/lib/submit-form";

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
      <span className="button-pixels" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <i
            key={i}
            style={{
              transitionDelay: `${((i * 5 + Math.floor(i / 6)) % 9) * 0.02}s`,
            }}
          />
        ))}
      </span>
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
    [servicesOpen, setServicesOpen] = useState(false),
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
        {navigation.map((n) =>
          n.href === "/services" ? (
            <div
              className="nav-services"
              key={n.href}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setServicesOpen(false);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setServicesOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setServicesOpen(false);
                  event.currentTarget.querySelector("button")?.focus();
                }
              }}
            >
              <button
                type="button"
                className="services-nav-trigger"
                aria-expanded={servicesOpen}
                aria-controls="services-navigation"
                onClick={() => setServicesOpen((value) => !value)}
              >
                Services <ChevronDown size={14} />
              </button>
              <div
                id="services-navigation"
                className="services-dropdown"
                hidden={!servicesOpen}
              >
                <Link href="/services">
                  All services <ArrowUpRight size={14} />
                </Link>
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    aria-current={
                      path === `/services/${service.slug}` ? "page" : undefined
                    }
                  >
                    {service.title}
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={n.href}
              href={n.href}
              aria-current={path === n.href ? "page" : undefined}
            >
              {n.label}
              <span />
            </Link>
          ),
        )}
      </nav>
      <div className="header-cta">
        <ButtonLink href={config.bookingUrl}>Book a call</ButtonLink>
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
            <div className="mobile-service-links">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  onClick={() => setOpen(false)}
                >
                  {service.title}
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          </nav>
          <ButtonLink href={config.bookingUrl} light>
            Book a discovery call
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
      <span className="contact-symbol" aria-hidden="true">
        <MessageCircle size={30} strokeWidth={1.3} />
      </span>
      <div className="contact-person">
        <p>Talk with Verendo</p>
        <span className="mono">Your next step starts here</span>
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
      <div className="cta-shade" />
      <div className="cta-content">
        <SectionHeading
          eyebrow="Let’s get started"
          title="Your next chapter starts with a conversation."
          description="Tell us where your business is today and where you want to take it. We’ll help you work out a practical next step."
          center
        />
        <Reveal>
          <ButtonLink href={config.bookingUrl} light>
            Book a discovery call
          </ButtonLink>
          <Link href="/contact" className="cta-secondary">
            Prefer to write? Share your project <ArrowUpRight size={15} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Newsletter() {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const [statusKind, setStatusKind] = useState<"" | "success" | "error">("");
  const [guardRevision, setGuardRevision] = useState(0);
  const submitting = useRef(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    const form = e.currentTarget;
    submitting.current = true;
    setBusy(true);
    setMessage("");
    setStatusKind("");
    const data = new FormData(form);
    try {
      const result = await submitForm(
        config.newsletterEndpoint,
        Object.fromEntries(
          [...data.entries()].map(([key, value]) => [key, String(value)]),
        ),
      );
      form.reset();
      setMessage(result);
      setStatusKind("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
      setStatusKind("error");
    } finally {
      submitting.current = false;
      setBusy(false);
      setGuardRevision((value) => value + 1);
    }
  }
  return (
    <form className="newsletter" action={config.newsletterEndpoint} method="post" onSubmit={submit} aria-busy={busy}>
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
          maxLength={254}
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label={
            busy ? "Sending subscription request" : "Subscribe to newsletter"
          }
        >
          <ArrowRight size={20} />
        </button>
      </div>
      <FormGuard action="newsletter" revision={guardRevision} />
      <p
        className="form-status"
        data-state={statusKind || undefined}
        role={statusKind === "error" ? "alert" : "status"}
        aria-live="polite"
        aria-atomic="true"
      >
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
          <h2>
            A better digital future.
            <br />
            Built around you.
          </h2>
          <VerendoMonogram variant="footer" className="footer-video" />
        </div>
        <div className="footer-navigation">
          <span className="mono muted">Navigation</span>
          <nav aria-label="Footer navigation">
            {[
              { label: "Home", href: "/" },
              ...navigation,
              ...services.map((service) => ({
                label: service.title,
                href: `/services/${service.slug}`,
              })),
              { label: "Privacy Policy", href: "/legal/privacy-policy" },
              { label: "Terms and Condition", href: "/legal/terms-conditions" },
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
