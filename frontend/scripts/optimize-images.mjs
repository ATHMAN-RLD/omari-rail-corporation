import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const assetsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'assets'
);

const DEFAULT_MAX_WIDTH = 1200;
const WIDE_MAX_WIDTH = 1920;
const WIDE_IMAGES = new Set(['banner-train.jpg', 'page-background.jpg', 'train-image.jpg']);
const SKIP_UNDER_BYTES = 400 * 1024;
const JPEG_QUALITY = 78;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const DRY_RUN = process.argv.includes('--dry');

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function optimize(fileName) {
  const filePath = path.join(assetsDir, fileName);
  const extension = path.extname(fileName).toLowerCase();
  const original = await readFile(filePath);

  if (original.length <= SKIP_UNDER_BYTES) {
    console.log(`skip      ${fileName} (${kb(original.length)}, already small)`);
    return { before: original.length, after: original.length };
  }

  const maxWidth = WIDE_IMAGES.has(fileName) ? WIDE_MAX_WIDTH : DEFAULT_MAX_WIDTH;

  let pipeline = sharp(original)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true });

  pipeline =
    extension === '.png'
      ? pipeline.png({ compressionLevel: 9 })
      : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

  const optimized = await pipeline.toBuffer();

  if (optimized.length >= original.length) {
    console.log(`keep      ${fileName} (${kb(original.length)}, no smaller version found)`);
    return { before: original.length, after: original.length };
  }

  if (!DRY_RUN) {
    await writeFile(filePath, optimized);
  }

  const verb = DRY_RUN ? 'would cut' : 'shrunk';
  console.log(`${verb.padEnd(9)} ${fileName}: ${kb(original.length)} -> ${kb(optimized.length)}`);
  return { before: original.length, after: optimized.length };
}

const files = (await readdir(assetsDir))
  .filter((name) => EXTENSIONS.has(path.extname(name).toLowerCase()))
  .sort();

let totalBefore = 0;
let totalAfter = 0;

for (const fileName of files) {
  const { before, after } = await optimize(fileName);
  totalBefore += before;
  totalAfter += after;
}

console.log(`\nTotal: ${kb(totalBefore)} -> ${kb(totalAfter)}${DRY_RUN ? ' (dry run, nothing written)' : ''}`);  