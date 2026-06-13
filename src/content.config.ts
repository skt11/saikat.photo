import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			year: z.string(),
			location: z.string(),
			description: z.string(),
			cover: image(),
			order: z.number(),
			published: z.boolean().default(true),
			photos: z.array(
				z.object({
					src: image(),
					alt: z.string(),
					caption: z.string().optional(),
				}),
			),
		}),
});

export const collections = { projects };
