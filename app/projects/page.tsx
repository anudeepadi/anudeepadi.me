import { Metadata } from "next";
import { projectsQuery } from "@/lib/sanity.query";
import type { ProjectType } from "@/types";
import EmptyState from "../components/shared/EmptyState";
import { Slide } from "../animation/Slide";
import { sanityFetch } from "@/lib/sanity.client";
import PageHeading from "../components/shared/PageHeading";
import EnhancedProjectCard from "../components/pages/EnhancedProjectCard";

export const metadata: Metadata = {
  title: "Project | Anudeep Adiraju",
  metadataBase: new URL("https://anudeepadi.me/projects"),
  description: "Explore projects built by Anudeep Adiraju",
  openGraph: {
    title: "Projects | Anudeep Adiraju",
    url: "https://anudeepadi.me/projects",
    description: "Explore projects built by Anudeep Adiraju",
    images:
      "https://res.cloudinary.com/",
  },
};

export default async function Project() {
  const projects: ProjectType[] = await sanityFetch({
    query: projectsQuery,
    tags: ["project"],
  });

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <PageHeading
        title="Projects"
        description="I've worked on tons of little projects over the years but these are the ones that I'm most proud of. Many of them are open-source, so if you see something that piques your interest, check out the code and contribute if you have ideas on how it can be improved."
      />

      <Slide delay={0.1}>
        {projects.length > 0 ? (
          <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mb-12">
            {projects.map((project) => (
              <EnhancedProjectCard
                key={project._id}
                project={project}
              />
            ))}
          </section>
        ) : (
          <EmptyState value="Projects" />
        )}
      </Slide>
    </main>
  );
}
