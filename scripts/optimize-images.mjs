import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

// Every raster asset actually referenced from src/. Unreferenced files in
// public/ are left alone; this only touches what ships to a visitor.
const refs = execSync(
  `grep -rhoE '/Asset/[^}"'"'"']*\\.(png|jpg|jpeg)' src/ | sort -u`,
  { encoding: 'utf8' }
).trim().split('\n');

let before = 0, after = 0;
const dims = {};
for (const ref of refs) {
  const rel = decodeURIComponent(ref);
  const src = path.join('public', rel);
  if (!fs.existsSync(src)) { console.log('MISSING', rel); continue; }
  const out = src.replace(/\.(png|jpe?g)$/i, '.webp');

  const meta = await sharp(src).metadata();
  // Cap at 1600px: the widest slot on the site is a full-bleed hero inside a
  // 1280px container, so anything above this is downloaded and thrown away.
  const width = Math.min(meta.width, 1600);
  await sharp(src).resize({ width, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 }).toFile(out);

  const o = fs.statSync(src).size, n = fs.statSync(out).size;
  before += o; after += n;
  const om = await sharp(out).metadata();
  dims[ref.replace(/\.(png|jpe?g)$/i, '.webp')] = [om.width, om.height];
  console.log(`${(o/1024/1024).toFixed(2)}MB -> ${(n/1024).toFixed(0)}KB  ${path.basename(rel)}`);
}
fs.writeFileSync('/private/tmp/claude-502/-Users-eli/015e72ed-f1ad-4926-b04c-90ff482cb8b2/scratchpad/dims.json', JSON.stringify(dims, null, 1));
console.log(`\nTOTAL  ${(before/1024/1024).toFixed(1)} MB -> ${(after/1024/1024).toFixed(2)} MB  (${(100-after/before*100).toFixed(1)}% smaller)`);
