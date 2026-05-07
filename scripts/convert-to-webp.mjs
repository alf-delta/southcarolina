/**
 * Converts all PNG/JPG/JPEG files in public/ that don't have a .webp sibling.
 * Run: node scripts/convert-to-webp.mjs
 * Called automatically as "prebuild" script.
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const QUALITY = 85;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

let converted = 0;
let skipped = 0;

for await (const file of walk(PUBLIC_DIR)) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

  const webpPath = join(dirname(file), basename(file, ext) + '.webp');
  try {
    await stat(webpPath);
    skipped++;
    continue; // already has a .webp sibling
  } catch {
    // no .webp sibling — convert
  }

  try {
    await sharp(file).webp({ quality: QUALITY }).toFile(webpPath);
    const rel = file.replace(PUBLIC_DIR, '');
    console.log(`  ✓ ${rel} → ${basename(webpPath)}`);
    converted++;
  } catch (err) {
    console.error(`  ✗ ${file}: ${err.message}`);
  }
}

console.log(`\nDone: ${converted} converted, ${skipped} already had .webp`);
