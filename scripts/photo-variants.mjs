// Cuts the responsive copies of the facility photos from the 2120x1280 masters.
// Run: node scripts/photo-variants.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const DIR = 'Asset/stock photo/Desktop Dimensions/Facility';
const master = n => path.join('assets-masters', DIR, `${n}.png`);
const out = (n, s) => path.join('public', DIR, `${n}-${s}.webp`);

// Portrait 4:5 crops: every photo passed to <ArchPhoto>, directly or through a hero's `image` prop.
const lines = execSync(
  `grep -rhE '<ArchPhoto src="/|^ +image="/Asset' src --include='*.astro'`, { encoding: 'utf8' },
);
const arch = [...new Set([...lines.matchAll(/Facility\/([^"]+)\.webp/g)].map(m => decodeURIComponent(m[1])))];

// Landscape copies for wide or full-width slots.
const wide = {
  'Evening exterior facade with illuminated entrance and curved driveway': [1000, 2120],
  'Sunlit common hall with lounge furniture, tall windows, and open floor plan': [1000, 1800, 2120],
  'Flexible gathering space with movable seating, support columns, and checkerboard flooring': [1000, 1800],
  'Contemporary healthcare building with tower entry and desert landscaping': [1000, 2120],
  'Private bedroom with upholstered bed, reading chair, and large window': [1000, 1800],
  'Residential living room with lounge seating, coffee table, and open kitchen view': [1000, 1800],
  'Central welcome desk with pendant lighting and adjacent activity area': [1000, 1800],
};
// The closing CTA sits under a dark shade, so it can be compressed harder.
const cta = { 'Evening exterior facade with illuminated entrance and curved driveway': [[900, 60], [1600, 62], [2120, 58]] };

const open = n => { if (!fs.existsSync(master(n))) throw new Error(`No master: ${n}`); return sharp(master(n)).flatten({ background: '#EFE7DA' }); };
for (const n of arch) for (const w of [520, 780, 1024])
  await open(n).extract({ left: 548, top: 0, width: 1024, height: 1280 }).resize({ width: w }).webp({ quality: 76, effort: 6 }).toFile(out(n, `v-${w}`));
for (const [n, ws] of Object.entries(wide)) for (const w of ws)
  await open(n).resize({ width: w }).webp({ quality: 74, effort: 6 }).toFile(out(n, `w-${w}`));
for (const [n, ws] of Object.entries(cta)) for (const [w, quality] of ws)
  await open(n).resize({ width: w }).webp({ quality, effort: 6 }).toFile(out(n, `cta-${w}`));
console.log(`${arch.length} portrait photos, ${Object.values(wide).flat().length} landscape copies`);
