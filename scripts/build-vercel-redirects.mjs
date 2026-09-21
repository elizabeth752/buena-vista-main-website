/* Generates vercel.json redirects from redirects.csv.

   Why this exists: Astro's `redirects` config on a STATIC build emits an HTML
   page with a meta refresh, not an HTTP 301. Google treats meta refresh as a
   soft redirect and passes signals far less reliably. With 485 rules carrying
   roughly 20,000 clicks a year, that difference is the migration.

   vercel.json redirects are applied at the edge, before the filesystem, so they
   return a real 308 (permanent) and the static page never renders.

   Run:  node scripts/build-vercel-redirects.mjs
   Then: git diff vercel.json
*/
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const csv = readFileSync('redirects.csv', 'utf8').trim().split('\n').slice(1);

const rules = csv.map(line => {
  const [source, destination] = line.split(',');
  return { source: source.trim(), destination: destination.trim() };
});

/* Sources are stored with a trailing slash because that is the form the old
   WordPress site published and the form Google has indexed. `trailingSlash:
   true` makes Vercel normalise the bare form to it first, so both work. */
const seen = new Set();
const redirects = [];
for (const { source, destination } of rules) {
  if (!source.startsWith('/') || !destination.startsWith('/')) continue;
  if (source === destination) continue;
  const key = source.replace(/\/$/, '') || '/';
  if (seen.has(key)) continue;
  seen.add(key);
  redirects.push({ source, destination, permanent: true });
}

/* The retired MAT page predates the migration map. */
if (!seen.has('/medication-assisted-treatment')) {
  redirects.push({
    source: '/medication-assisted-treatment/',
    destination: '/what-we-treat/opioid-addiction/',
    permanent: true,
  });
}

redirects.sort((a, b) => a.source.localeCompare(b.source));

/* This script owns the `redirects` key and NOTHING ELSE. Everything else in
   vercel.json — headers, rewrites, anything added later — is hand-written and
   is carried across from the existing file.

   Learned the hard way on 2026-09-21: an earlier version built the config from
   scratch, so regenerating after a redirect change silently deleted the
   no-store cache headers on /api/ and /thank-you and the /api/lead/ rewrite.
   The build stays green either way, and the form keeps working locally, so
   nothing catches it except reading the diff. */
const existing = existsSync('vercel.json')
  ? JSON.parse(readFileSync('vercel.json', 'utf8'))
  : {};

const config = {
  ...existing,
  $schema: 'https://openapi.vercel.sh/vercel.json',
  trailingSlash: true,
  redirects,
};

writeFileSync('vercel.json', JSON.stringify(config, null, 2) + '\n');
console.log(`vercel.json written: ${redirects.length} redirects`);

if (redirects.length > 1024) {
  console.error(`WARNING: ${redirects.length} exceeds Vercel's 1024 redirect limit.`);
  process.exit(1);
}
