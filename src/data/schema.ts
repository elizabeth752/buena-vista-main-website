/* Sitewide structured data.

   Two nodes belong on every page and were missing everywhere:

   ORGANISATION  One canonical MedicalOrganization with a stable @id, so the
                 per-page MedicalWebPage / MedicalClinic nodes can reference it
                 instead of each re-declaring a slightly different company.
                 Absolute URLs throughout: Google discards a relative `logo`.

   BREADCRUMBS   Derived from the URL. The pages already render a visible
                 breadcrumb trail; this is the machine-readable twin, and it is
                 what turns the grey URL line in a search result into a path.

   Anything page-specific (FAQPage, BlogPosting, Person) stays on its page. */

export const SITE = 'https://buenavistarecovery.com';
export const ORG_ID = `${SITE}/#organization`;

export const organization = {
  '@type': 'MedicalOrganization',
  '@id': ORG_ID,
  name: 'Buena Vista Health & Recovery Centers',
  alternateName: 'Buena Vista Recovery',
  url: `${SITE}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/Asset/stock%20photo/Logo%20Buena%20Vista.svg`,
  },
  image: `${SITE}/og-default.jpg`,
  telephone: '+1-888-362-5576',
  medicalSpecialty: 'Addiction Medicine',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3033 S Arizona Ave',
    addressLocality: 'Chandler',
    addressRegion: 'AZ',
    postalCode: '85286',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'State',
    name: 'Arizona',
  },
  sameAs: [
    'https://www.facebook.com/people/Buena-Vista-Health/61589704096967/',
    'https://www.instagram.com/buenavista_recovery/',
    'https://www.linkedin.com/company/buena-vista-recovery/',
    'https://www.youtube.com/@buenavistarecovery',
  ],
};

/* Human labels for URL segments. A slug that is not listed is title-cased,
   which is right for the blog and for anything added later. */
const LABELS: Record<string, string> = {
  'about': 'About',
  'team': 'Team',
  'careers': 'Careers',
  'contact': 'Contact',
  'admissions': 'Admissions',
  'blog': 'Blog',
  'dual-diagnosis': 'Dual Diagnosis',
  'for-families': 'For Families',
  'insurance': 'Insurance',
  'ahcccs-medicaid': 'AHCCCS and Medicaid',
  'banner-university-family-care': 'Banner University Family Care',
  'private-pay': 'Private Pay',
  'verify-your-benefits': 'Verify Your Benefits',
  'locations': 'Locations',
  'medical-detox': 'Medical Detox',
  'programs': 'Programs',
  'aftercare': 'Aftercare',
  'intensive-outpatient-iop': 'Intensive Outpatient',
  'referrals': 'Referrals',
  'residential-treatment': 'Residential Treatment',
  'resources': 'Resources',
  'sober-living-arizona': 'Sober Living in Arizona',
  'withdrawal-timelines': 'Withdrawal Timelines',
  'therapies': 'Therapies',
  'what-we-treat': 'What We Treat',
  'alcohol-addiction': 'Alcohol Addiction',
  'benzodiazepine-addiction': 'Benzodiazepine Addiction',
  'opioid-addiction': 'Opioid Addiction',
  'stimulant-addiction': 'Stimulant Addiction',
  'methamphetamine': 'Methamphetamine',
  'who-we-serve': 'Who We Serve',
  'how-long-is-treatment': 'How Long Treatment Takes',
  'sitemap': 'Sitemap',
};

const titleCase = (slug: string) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

/** BreadcrumbList for a pathname, or null on the homepage where it adds nothing. */
export function breadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return null;

  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }];
  let path = '';
  parts.forEach((part, i) => {
    path += `/${part}`;
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: LABELS[part] ?? titleCase(part),
      item: `${SITE}${path}/`,
    });
  });
  return { '@type': 'BreadcrumbList', itemListElement: items };
}
