#!/usr/bin/env node
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, basename, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const LONG_EDGE = 2400;
const QUALITY = 82;

const root = dirname(fileURLToPath(import.meta.url)) + "/..";

const [, , sourceDir, slug] = process.argv;
if (!sourceDir || !slug) {
	console.error("usage: node scripts/import-photos.mjs <sourceDir> <slug>");
	process.exit(1);
}

const destDir = join(root, "src/assets", slug);
await mkdir(destDir, { recursive: true });

const sanitize = (name) =>
	name
		.toLowerCase()
		.replace(/\.(jpe?g|png|tiff?|webp)$/i, "")
		.replace(/[^a-z0-9_.-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

const entries = await readdir(sourceDir, { withFileTypes: true });
const photos = entries
	.filter((e) => e.isFile() && /\.(jpe?g)$/i.test(e.name))
	.map((e) => e.name)
	.sort();

console.log(`Importing ${photos.length} photo(s) from ${sourceDir} → ${destDir}`);

let totalIn = 0;
let totalOut = 0;
const written = [];

for (const file of photos) {
	const src = join(sourceDir, file);
	const out = join(destDir, sanitize(basename(file, extname(file))) + ".webp");
	const inSize = (await stat(src)).size;
	const image = sharp(src, { failOn: "none" }).rotate();
	const meta = await image.metadata();
	const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
	const resizer = longEdge > LONG_EDGE
		? image.resize({ width: meta.width >= meta.height ? LONG_EDGE : null, height: meta.height > meta.width ? LONG_EDGE : null, fit: "inside", withoutEnlargement: true })
		: image;
	await resizer.webp({ quality: QUALITY, effort: 5 }).withMetadata({ icc: "srgb" }).toFile(out);
	const outSize = (await stat(out)).size;
	totalIn += inSize;
	totalOut += outSize;
	written.push(out);
	console.log(`  ${file}  ${(inSize / 1e6).toFixed(1)}M → ${(outSize / 1e6).toFixed(2)}M  ${out.replace(root + "/", "")}`);
}

console.log();
console.log(`Total: ${photos.length} files, ${(totalIn / 1e6).toFixed(0)}M in → ${(totalOut / 1e6).toFixed(1)}M out`);
