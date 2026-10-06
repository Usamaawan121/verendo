"use client";
import { MotionConfig } from "motion/react";
import { posts, projects } from "@/content/site";
import { services } from "@/content/services";
import { ServiceDetail, ServicesPage } from "./service-pages";
import { SmoothScroll } from "./animation";
import { Footer, Header } from "./shared";
import { Home } from "./home";
import {
  AboutPage,
  BlogDetail,
  BlogPage,
  ContactPage,
  LegalPage,
  NotFoundPage,
  ProjectDetail,
  ProjectsPage,
} from "./pages";
export function Site({ path }: { path: string }) {
  const project = projects.find((p) => path === `/projects/${p.slug}`);
  const post = posts.find((p) => path === `/blog/${p.slug}`);
  const service = services.find((item) => path === `/services/${item.slug}`);
  const page =
    path === "/" ? (
      <Home />
    ) : path === "/services" ? (
      <ServicesPage />
    ) : service ? (
      <ServiceDetail service={service} />
    ) : path === "/projects" ? (
      <ProjectsPage />
    ) : path === "/about" ? (
      <AboutPage />
    ) : path === "/blog" ? (
      <BlogPage />
    ) : path === "/contact" ? (
      <ContactPage />
    ) : project ? (
      <ProjectDetail project={project} />
    ) : post ? (
      <BlogDetail post={post} />
    ) : path === "/legal/privacy-policy" ? (
      <LegalPage type="privacy" />
    ) : path === "/legal/terms-conditions" ? (
      <LegalPage type="terms" />
    ) : (
      <NotFoundPage />
    );
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header key={path} path={path} />
      <main id="main">{page}</main>
      <Footer />
    </MotionConfig>
  );
}
