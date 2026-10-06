import { notFound, redirect } from "next/navigation";
import { Site } from "@/components/verendo/site";
import { posts, projects } from "@/content/site";
import { services } from "@/content/services";
const routes = [
  "/services",
  ...services.map((service) => `/services/${service.slug}`),
  "/projects",
  "/about",
  "/blog",
  "/contact",
  "/404",
  "/legal/privacy-policy",
  "/legal/terms-conditions",
  ...projects.map((p) => `/projects/${p.slug}`),
  ...posts.map((p) => `/blog/${p.slug}`),
];
function pathFromSegments(slug: string[]) {
  return (
    "/" +
    slug
      .map((segment) => {
        // Preserve compatibility with encoded legacy links, without throwing on '%'.
        try {
          return decodeURIComponent(segment);
        } catch {
          return segment;
        }
      })
      .join("/")
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = pathFromSegments(slug);
  const content =
    services.find((service) => path === `/services/${service.slug}`) ||
    projects.find((p) => path === `/projects/${p.slug}`) ||
    posts.find((p) => path === `/blog/${p.slug}`);
  const label =
    content?.title || (slug.at(-1) || "Verendo").replaceAll("-", " ");
  return {
    title: `${label.charAt(0).toUpperCase() + label.slice(1)} — Verendo`,
    description: services.find(
      (service) => path === `/services/${service.slug}`,
    )?.description,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = pathFromSegments(slug);
  const previousProject = projects.find(
    (project) => path === `/projects/${project.legacySlug}`,
  );
  if (previousProject) redirect(`/projects/${previousProject.slug}`);
  if (!routes.includes(path)) notFound();
  return <Site path={path} />;
}
