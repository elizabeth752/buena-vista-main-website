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
  /* Social profiles plus the third-party listings that describe the same
     organisation. sameAs is how a search engine ties this site to the entity
     it already knows from LegitScript, Psychology Today and the Joint
     Commission provider locator, so the verification pages belong here as much
     as the social ones do. */
  sameAs: [
    'https://www.facebook.com/buenavistarecovery',
    'https://www.instagram.com/buenavistarecovery/',
    'https://www.linkedin.com/company/buena-vista-recovery/',
    'https://www.youtube.com/@buenavistarecovery',
    'https://co.pinterest.com/buenavistahealth/',
    'https://bsky.app/profile/buenavistahealth.bsky.social',
    'https://www.jointcommission.org/en-us/accreditation/behavioral-health-care-and-human-services/provider-locator/605564/646853',
    'https://www.legitscript.com/websites/?checker_keywords=buenavistarecovery.com',
    'https://www.psychologytoday.com/us/treatment-rehab/buena-vista-health-and-recovery-centers-chandler-az/906339',
    'https://recovery.com/buena-vista-recovery-chandler-arizona/',
    'https://business.chandlerchamber.com/list/member/buena-vista-health-and-recovery-28591',
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Accreditation',
      name: 'The Joint Commission Gold Seal of Approval',
      recognizedBy: { '@type': 'Organization', name: 'The Joint Commission' },
      url: 'https://www.jointcommission.org/en-us/accreditation/behavioral-health-care-and-human-services/provider-locator/605564/646853',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Certification',
      name: 'LegitScript Certified',
      recognizedBy: { '@type': 'Organization', name: 'LegitScript' },
      url: 'https://www.legitscript.com/websites/?checker_keywords=buenavistarecovery.com',
    },
  ],
  memberOf: [
    { '@type': 'Organization', name: 'National Association of Addiction Treatment Providers' },
    {
      '@type': 'Organization',
      name: 'Chandler Chamber of Commerce',
      url: 'https://business.chandlerchamber.com/list/member/buena-vista-health-and-recovery-28591',
    },
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
