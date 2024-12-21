import { BiPackage } from "react-icons/bi";
import { defineField, defineType } from "sanity";
import { defineIcon } from "./utils";

export default defineType({
  name: "project",
  title: "Projects",
  description: "Project Schema",
  type: "document",
  icon: () => defineIcon(BiPackage),
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Enter the name of the project",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (rule) => rule.max(60).required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Add a custom slug for the URL or generate one from the name",
      options: { source: "name" },
    }),
    defineField({
      name: "logo",
      title: "Project Logo",
      type: "image",
    }),
    defineField({
      name: "projectUrl",
      title: "Project URL",
      type: "url",
      description: "Leaving this URL blank will add a coming soon to the link.",
    }),
    defineField({
      name: "repository",
      title: "Repository URL",
      type: "url",
      description:
        'Leaving this URL blank will add a "No Repository" message to the link.',
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      description: "Upload a cover image for this project",
      options: {
        hotspot: true,
        metadata: ["lqip"],
      },
      fields: [
        {
          name: "alt",
          title: "Alt",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      description: "Write a full description about this project",
    }),
  ],
});