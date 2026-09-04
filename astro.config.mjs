// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// `site` is required for sitemap generation and for absolute URLs in schema.
// Update it if the production domain ever changes.
const SITE = 'https://buenavistarecovery.com';

/* Pages deliberately kept OUT of the XML sitemap.

   /programs/intensive-outpatient-iop/
     Carries noindex. Admissions states we do not run an IOP; the page exists as
     an honest referral page only. Including it would invite indexing of a
     service we do not offer.

   /404
     Never belongs in a sitemap.
*/
const EXCLUDE = [
  '/programs/intensive-outpatient-iop/',
  '/404/',
];

export default defineConfig({
  site: SITE,
  /* /medication-assisted-treatment was retired on 2026-09-04. Admissions states
     there is no methadone programme, so the page described a service that does
     not exist. It is redirected rather than deleted outright because the URL was
     live and indexed — anyone holding the link lands on the closest relevant
     page instead of a 404.

     NOTE: Astro's static output implements this as a meta-refresh, not a true
     301. Add a real 301 at the host (Vercel/Netlify/CloudFront) when the hosting
     config is known, and this entry can then be removed. */
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
