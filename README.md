# saikat.photo

Personal photography site for Saikat Adhikari. Photography, moving image, visual studies. Stockholm.

Built with [Astro](https://astro.build) — static, minimal, no client JS beyond what Astro defaults to.

## Stack

- Astro + TypeScript (strict)
- Plain CSS, system fonts
- `astro:assets` for responsive image generation
- Content Collections for project metadata (coming next)
- Deployed to Cloudflare Pages

## Commands

| Command           | Action                                |
| :---------------- | :------------------------------------ |
| `npm install`     | Install dependencies                  |
| `npm run dev`     | Local dev server at `localhost:4321`  |
| `npm run build`   | Build static site to `./dist/`        |
| `npm run preview` | Preview the production build locally  |

## Image workflow

1. Export from Capture One at long-edge ~2400 px, WebP q80, sRGB.
2. Drop into `src/assets/<project>/`.
3. Reference from the project's frontmatter — `astro:assets` handles AVIF/WebP/srcset.
4. `git push` — Cloudflare Pages auto-deploys.
