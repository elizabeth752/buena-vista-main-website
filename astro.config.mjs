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

   /medication-assisted-treatment
     Live and indexed today, but admissions states there is no methadone
     programme and the wiki says MAT must not be referenced. It is excluded from
     the sitemap as a conservative interim — this does NOT deindex the existing
     page, it simply declines to promote it. Resolve properly by adding noindex
     or unpublishing once someone confirms the position.

   /404
     Never belongs in a sitemap.
*/
const EXCLUDE = [
  '/programs/intensive-outpatient-iop/',
  '/medication-assisted-treatment/',
  '/404/',
];

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDE.some((path) => page === `${SITE}${path}`),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
