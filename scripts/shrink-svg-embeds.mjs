// Shrinks the raster payload embedded inside the accreditation SVGs.
//
// These logos were exported from Figma as SVG wrappers around a full-size PNG
// (psychology_today 1.svg carried a 2172x724 PNG for a 124x40 slot: 1.3 MB on
// the homepage). The <image> element keeps its width/height attributes, so the
// pattern transform that scales it into the visible box is untouched and the
// rendered output is identical. Only the embedded bitmap is replaced.
//
// Target: about 4x the on-screen size, enough for retina without the waste.
// Regenerate: node scripts/shrink-svg-embeds.mjs

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join('public', 'Asset', 'Accreditations');

// Longest edge of the embedded bitmap after resize, keyed by file.
const TARGET_LONG_EDGE = {
  'psychology_today 1.svg': 496,
  'BBB.svg': 244,
  'The Joint Commission.svg': 200,
  'Legit.svg': 292,
  'NAATP.svg': 531,
};

const IMAGE_RE = /(<image\b[^>]*?\bwidth=")(\d+)("[^>]*?\bheight=")(\d+)("[^>]*?xlink:href="data:image\/png;base64,)([A-Za-z0-9+/=]+)(")/g;

let totalBefore = 0;
let totalAfter = 0;

for (const [file, longEdge] of Object.entries(TARGET_LONG_EDGE)) {
  const svgPath = path.join(DIR, file);
  const original = fs.readFileSync(svgPath, 'utf8');
  const matches = [...original.matchAll(IMAGE_RE)];
  if (matches.length !== 1) {
    throw new Error(`${file}: expected exactly one embedded PNG, found ${matches.length}`);
  }

  const [whole, pre, w, mid, h, mid2, b64, post] = matches[0];
  const png = Buffer.from(b64, 'base64');
  const meta = await sharp(png).metadata();

  // Scale so the longest edge hits the target, but never upscale.
  const scale = Math.min(1, longEdge / Math.max(meta.width, meta.height));
  const outW = Math.max(1, Math.round(meta.width * scale));
  const outH = Math.max(1, Math.round(meta.height * scale));

  const resized = await sharp(png)
    .resize({ width: outW, height: outH, fit: 'fill', kernel: 'lanczos3' })
    .png({ palette: true, quality: 92, compressionLevel: 9, effort: 10 })
    .toBuffer();

  const replacement = `${pre}${w}${mid}${h}${mid2}${resized.toString('base64')}${post}`;
  const updated = original.replace(whole, replacement);
  fs.writeFileSync(svgPath, updated, 'utf8');

  totalBefore += original.length;
  totalAfter += updated.length;
  console.log(
    `${file}: embedded ${meta.width}x${meta.height} -> ${outW}x${outH}, ` +
    `${(original.length / 1024).toFixed(0)}KB -> ${(updated.length / 1024).toFixed(0)}KB`
  );
}

console.log(
  `\nTOTAL ${(totalBefore / 1024).toFixed(0)}KB -> ${(totalAfter / 1024).toFixed(0)}KB`
);
