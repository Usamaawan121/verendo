"use client";
import Link from "next/link";
import { ArrowUpRight, Check, Plus, Minus } from "lucide-react";
import { services, type Service } from "@/content/services";
import { media } from "@/content/site";
import { Reveal, TextReveal } from "./animation";
import { ButtonLink, CTA, Eyebrow, SectionHeading } from "./shared";
import { ServicePillars, ProcessSequence } from "./experience";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ServicesPage() {
  return (
    <>
      <section className="services-page-heading container">
        <Eyebrow>Our services</Eyebrow>
        <TextReveal
          as="h1"
          text="The right digital support for your next stage."
        />
        <p>
          AI for Business, Website Development and Digital Marketing. Three
          connected services for local, small and medium businesses in the UK,
          USA and UAE.
        </p>
      </section>
      <ServicePillars overview />
      <section className="service-scope-note container">
        <span className="mono">Start where it matters</span>
        <h2>
          You do not need everything.
          <br />
          <span>You need the right next step.</span>
        </h2>
        <p>
          Bring us the challenge. We will help you work out the starting point,
          the scope and how to move forward.
        </p>
        <ButtonLink href="/contact" light>
          Discuss your business
        </ButtonLink>
      </section>
      <ProcessSequence />
      <CTA />
    </>
  );
}

export function ServiceDetail({ service }: { service: Service }) {
  return (
    <>
      <section
        className={`service-detail-hero service-${service.icon} container`}
      >
        <div className="service-detail-copy">
          <Link href="/services" className="back-link">
            ← All services
          </Link>
          <Eyebrow>{service.title}</Eyebrow>
          <TextReveal text={service.headline} as="h1" />
          <p>{service.description}</p>
          <ButtonLink href={`/contact?service=${service.slug}`} light>
            {service.cta}
          </ButtonLink>
          <span className="service-market mono">
            For businesses in the UK · USA · UAE
          </span>
        </div>
        <Reveal className="service-detail-art">
          <div className="art-grid" aria-hidden="true" />
          <img
            src={media(service.image)}
            alt={`Black and green 3D illustration for ${service.title}`}
            width={640}
            height={640}
          />
          <span className="service-art-label mono">{service.tagline}</span>
        </Reveal>
      </section>
      <section className="service-editorial container section-space">
        <Eyebrow>A practical starting point</Eyebrow>
        <h2>{service.intro}</h2>
        <p>{service.introText}</p>
      </section>
      <section className="service-outcomes container section-space">
        <SectionHeading
          eyebrow="What this makes possible"
          title="Built around the work. And the people doing it."
        />
        <div className="service-outcome-grid">
          {service.outcomes.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <article>
                <span className="mono">/ 0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="service-scenarios container section-space">
        <div>
          <SectionHeading
            eyebrow="Where it can help"
            title="Real situations. A useful next step."
          />
          <p className="service-scenario-note">
            These are example use cases. We agree the right approach and
            deliverables for your business during discovery.
          </p>
        </div>
        <div className="scenario-list">
          {service.scenarios.map((item, i) => (
            <Reveal key={item.title}>
              <article>
                <span className="mono">0{i + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="deliverables-section container section-space">
        <div>
          <Eyebrow>What we agree together</Eyebrow>
          <h2>
            Clear scope.
            <br />
            <span>No guessing.</span>
          </h2>
          <p>
            Your proposal sets out the exact work, responsibilities, timing and
            fees before the project begins.
          </p>
        </div>
        <ul>
          {service.deliverables.map((item) => (
            <li key={item}>
              <Check size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="service-faq container section-space">
        <SectionHeading
          eyebrow="A few useful answers"
          title="Before we get started."
        />
        <Accordion type="single" collapsible className="faq-list">
          {service.faq.map(([question, answer], i) => (
            <AccordionItem key={question} value={`question-${i}`}>
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
      <section className="related-services container section-space">
        <SectionHeading
          eyebrow="The bigger picture"
          title="Connect your next step."
        />
        <div>
          {services
            .filter((item) => item.slug !== service.slug)
            .map((item) => (
              <Link href={`/services/${item.slug}`} key={item.slug}>
                <div>
                  <span className="mono">Explore</span>
                  <h3>{item.title}</h3>
                  <p>{item.tagline}</p>
                </div>
                <ArrowUpRight size={28} />
              </Link>
            ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
