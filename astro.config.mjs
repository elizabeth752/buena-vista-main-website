// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// `site` is required for sitemap generation and for absolute URLs in schema.
// Update it if the production domain ever changes.
const SITE = 'https://buenavistarecovery.com';

/* Pages deliberately kept OUT of the XML sitemap.

   /404
     Never belongs in a sitemap.

   /programs/intensive-outpatient-iop/ was excluded until 2026-09-21, while the
   page carried noindex and existed only as a referral page. The client
   confirmed the IOP is open, so it is indexed like any other program page now.
*/
const EXCLUDE = [
  '/404/',
  /* Post-submission page. Carries noindex; a thank-you page in the index is
     how a competitor counts your conversions. */
  '/thank-you/',
];





/* MIGRATION REDIRECTS LIVE IN vercel.json, NOT HERE.

   Astro's `redirects` on a static build emits an HTML page with a meta refresh
   rather than an HTTP 301, and Google treats that as a soft redirect. With 486
   rules carrying roughly 20,000 clicks a year we need real 308s, so the rules
   are generated into vercel.json and applied at the edge.

   Source of truth: redirects.csv
   Regenerate:      node scripts/build-vercel-redirects.mjs

   Do not add migration redirects to this file. */
export default defineConfig({
  site: SITE,
  /* /medication-assisted-treatment was retired on 2026-09-04. Admissions states
     there is no methadone programme, so the page described a service that does
     not exist. It is redirected rather than deleted outright because the URL was
     live and indexed — anyone holding the link lands on the closest relevant
     page instead of a 404.

     The real 301 now lives in vercel.json, which is where the host can issue a
     proper permanent redirect. This Astro-level entry is kept as a fallback so
     the redirect still works in local dev and anywhere the site is served
     without Vercel's edge config. Keep both. */
  redirects: {
    '/medication-assisted-treatment': '/what-we-treat/opioid-addiction/',
  },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDE.some((path) => page === `${SITE}${path}`),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
