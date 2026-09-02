/* ---------------------------------------------------------------------------
   Site navigation — single source of truth for the header and the footer.

   Derived from the proposed sitemap (Sep 2026). The split is deliberate:

   MAIN MENU  carries the paths a person in crisis actually walks — what the
              program is, what it treats, who it's for, how to get in, what it
              costs, where it is. Seven groups, nothing deeper than two clicks.

   FOOTER     carries everything that is real but low-intent: the blog, the
              resource guides, careers, alumni, and the legal/technical pages.
              Nobody navigates to a privacy policy from a nav bar.

   `built: true` marks a page that exists today. Everything else is planned and
   will 404 until it ships — flip the flag when the page lands. Note that the
   live pages still sit on their flat URLs (/medical-detox, not
   /programs/medical-detox/); update these hrefs when the folder migration runs.
--------------------------------------------------------------------------- */

export interface NavLink {
  label: string;
  href: string;
  /** Page exists today. Unset means planned-but-not-built. */
  built?: boolean;
}

export interface NavColumn {
  heading?: string;
  links: NavLink[];
}

export interface NavGroup {
  label: string;
  /** Hub page the top-level label points at. */
  href: string;
  built?: boolean;
  columns: NavColumn[];
}

/** Dev aid: dots the links whose pages don't exist yet. Set false before launch. */
export const SHOW_BUILD_STATUS = true;

export const mainNav: NavGroup[] = [
  {
    label: 'Programs',
    href: '/programs/',
    built: true,
    columns: [
      {
        heading: 'Levels of care',
        links: [
          { label: 'Medical detox', href: '/medical-detox', built: true },
          { label: 'Residential treatment', href: '/residential-treatment', built: true },
          { label: 'Dual diagnosis', href: '/dual-diagnosis', built: true },
          { label: 'Intensive outpatient (IOP)', href: '/programs/intensive-outpatient-iop/', built: true },
          { label: 'Outpatient program', href: '/programs/outpatient-program/' },
          { label: 'Outpatient therapy', href: '/programs/outpatient-therapy/' },
          { label: 'Mental health treatment', href: '/programs/mental-health-treatment/' },
          { label: 'Aftercare & alumni', href: '/programs/aftercare-and-alumni/' },
        ],
      },
      {
        heading: 'Therapies',
        links: [
          { label: 'Group therapy', href: '/therapies/group-therapy/' },
          { label: 'Individual therapy', href: '/therapies/individual-therapy/' },
          { label: 'Family therapy', href: '/therapies/family-therapy/' },
          { label: 'EMDR therapy', href: '/therapies/emdr-therapy/' },
          { label: 'CBT', href: '/therapies/cognitive-behavioral-therapy-cbt/' },
          { label: 'DBT', href: '/therapies/dialectical-behavior-therapy-dbt/' },
          { label: 'Medication management', href: '/therapies/medication-management/' },
          { label: 'All therapies', href: '/therapies/', built: true },
        ],
      },
    ],
  },
  {
    label: 'What we treat',
    href: '/what-we-treat/',
    built: true,
    columns: [
      {
        heading: 'Substance use',
        links: [
          { label: 'Alcohol addiction', href: '/what-we-treat/alcohol-addiction/', built: true },
          { label: 'Opioid addiction', href: '/what-we-treat/opioid-addiction/' },
          { label: 'Fentanyl', href: '/what-we-treat/opioid-addiction/fentanyl/', built: true },
          { label: 'Stimulant addiction', href: '/what-we-treat/stimulant-addiction/' },
          { label: 'Methamphetamine', href: '/what-we-treat/stimulant-addiction/methamphetamine/', built: true },
          { label: 'Benzodiazepines', href: '/what-we-treat/benzodiazepine-addiction/' },
          { label: 'Cannabis use disorder', href: '/what-we-treat/cannabis-use-disorder/' },
          { label: 'Prescription drugs', href: '/what-we-treat/prescription-drug-addiction/' },
        ],
      },
      {
        heading: 'Mental health',
        links: [
          { label: 'Anxiety', href: '/what-we-treat/anxiety/', built: true },
          { label: 'Depression', href: '/what-we-treat/depression/', built: true },
          { label: 'PTSD & trauma', href: '/what-we-treat/ptsd-and-trauma/' },
          { label: 'Bipolar disorder', href: '/what-we-treat/bipolar-disorder/' },
          { label: 'Suicidal ideation', href: '/what-we-treat/suicidal-ideation/' },
          { label: 'Self-harm', href: '/what-we-treat/self-harm/' },
          { label: 'Dual diagnosis', href: '/dual-diagnosis', built: true },
        ],
      },
    ],
  },
  {
    label: 'Who we serve',
    href: '/who-we-serve/',
    built: true,
    columns: [
      {
        heading: 'Our residents',
        links: [
          { label: 'Men', href: '/who-we-serve/men/' },
          { label: 'Women', href: '/who-we-serve/women/' },
          { label: 'Young adults (18–30)', href: '/who-we-serve/young-adults/' },
          { label: 'Adults (30–55)', href: '/who-we-serve/adults/' },
          { label: 'Older adults (55+)', href: '/who-we-serve/older-adults/' },
          { label: 'Professionals & executives', href: '/who-we-serve/professionals-and-executives/' },
        ],
      },
      {
        heading: 'For families',
        links: [
          { label: 'Families & loved ones', href: '/for-families/', built: true },
          { label: 'How to help a loved one', href: '/for-families/how-to-help-a-loved-one/' },
          { label: "What to expect during treatment", href: '/for-families/what-to-expect-during-treatment/' },
          { label: 'Visitation, phone & contact', href: '/for-families/staying-in-contact/' },
          { label: "Paying for a loved one's care", href: '/for-families/paying-for-a-loved-ones-treatment/' },
        ],
      },
    ],
  },
  {
    label: 'Admissions',
    href: '/admissions/',
    built: true,
    columns: [
      {
        heading: 'Getting started',
        links: [
          { label: 'How admissions works', href: '/admissions/', built: true },
          { label: 'Current bed availability', href: '/admissions/bed-availability/' },
          { label: 'What to expect', href: '/admissions/what-to-expect/' },
          { label: 'What to bring', href: '/admissions/what-to-bring/' },
          { label: 'How long treatment takes', href: '/admissions/length-of-stay/', built: true },
          { label: 'A day in treatment', href: '/admissions/a-day-in-treatment/' },
        ],
      },
      {
        heading: 'Practical questions',
        links: [
          { label: 'Your medications', href: '/admissions/medications-and-prescriptions/' },
          { label: 'Travel & transportation', href: '/admissions/travel-and-transportation/', built: true },
          { label: 'Accessibility & accommodations', href: '/admissions/accessibility-and-accommodations/' },
          { label: 'Admissions FAQ', href: '/admissions/faq/' },
          { label: 'Professional & hospital referrals', href: '/referrals/' , built: true },
        ],
      },
    ],
  },
  {
    label: 'Insurance',
    href: '/insurance',
    built: true,
    columns: [
      {
        heading: 'Coverage',
        links: [
          { label: 'Insurance & payment options', href: '/insurance', built: true },
          { label: 'Verify your benefits', href: '/insurance/verify-your-benefits/', built: true },
          { label: 'AHCCCS & Medicaid', href: '/insurance/ahcccs-medicaid/', built: true },
          { label: 'Banner University Family Care', href: '/insurance/banner-university-family-care/', built: true },
          { label: 'UnitedHealthcare', href: '/insurance/unitedhealthcare/' },
          { label: 'Blue Cross Blue Shield', href: '/insurance/blue-cross-blue-shield/' },
          { label: 'Aetna', href: '/insurance/aetna/' },
          { label: 'Cigna', href: '/insurance/cigna/' },
          { label: 'Humana', href: '/insurance/humana/' },
        ],
      },
      {
        heading: 'Paying for treatment',
        links: [
          { label: 'Private pay & rates', href: '/insurance/private-pay/' , built: true },
          { label: 'What treatment costs', href: '/insurance/cost-of-treatment/' },
          { label: 'Not sure about your plan?', href: '/insurance/plans-we-do-not-accept/' },
        ],
      },
    ],
  },
  {
    label: 'Locations',
    href: '/locations/',
    built: true,
    columns: [
      {
        heading: 'Our facilities',
        links: [
          { label: 'Chandler, AZ', href: '/locations/chandler/', built: true },
          { label: 'Tucson, AZ', href: '/locations/tucson/', built: true },
        ],
      },
      {
        heading: 'Areas we serve',
        links: [
          { label: 'Arizona', href: '/locations/arizona/' },
          { label: 'Phoenix', href: '/locations/phoenix/' },
          { label: 'Mesa', href: '/locations/mesa/' },
          { label: 'Gilbert', href: '/locations/gilbert/' },
          { label: 'Scottsdale', href: '/locations/scottsdale/' },
          { label: 'Tempe', href: '/locations/tempe/' },
          { label: 'Traveling to Arizona', href: '/locations/out-of-state/' },
        ],
      },
    ],
  },
  {
    label: 'About',
    href: '/about',
    built: true,
    columns: [
      {
        links: [
          { label: 'About Buena Vista', href: '/about', built: true },
          { label: 'Clinical leadership & team', href: '/about/our-team/' },
          { label: 'Our clinical approach', href: '/about/our-approach/' },
          { label: 'Facility tour', href: '/about/facility-tour/' },
          { label: 'Accreditations & licensing', href: '/about/accreditations-and-licensing/' },
          { label: 'Careers', href: '/about/careers/' },
          { label: 'Contact us', href: '/about/contact/' },
        ],
      },
    ],
  },
];

/* --- Footer ---------------------------------------------------------------
   Deliberately not a mirror of the main menu. It repeats a shallow slice of
   the money pages for crawlers and scroll-to-bottom readers, then carries the
   things that have no business in a nav bar: the blog, the guides, careers,
   alumni, and the legal set. */

export const footerColumns: NavColumn[] = [
  {
    heading: 'Programs',
    links: [
      { label: 'Medical detox', href: '/medical-detox', built: true },
      { label: 'Residential treatment', href: '/residential-treatment', built: true },
      { label: 'Dual diagnosis', href: '/dual-diagnosis', built: true },
      { label: 'Intensive outpatient (IOP)', href: '/programs/intensive-outpatient-iop/', built: true },
      { label: 'Outpatient program', href: '/programs/outpatient-program/' },
      { label: 'Mental health treatment', href: '/programs/mental-health-treatment/' },
      { label: 'Aftercare & alumni', href: '/programs/aftercare-and-alumni/' },
    ],
  },
  {
    heading: 'What we treat',
    links: [
      { label: 'Alcohol addiction', href: '/what-we-treat/alcohol-addiction/', built: true },
      { label: 'Opioid addiction', href: '/what-we-treat/opioid-addiction/' },
      { label: 'Stimulant addiction', href: '/what-we-treat/stimulant-addiction/' },
      { label: 'Benzodiazepines', href: '/what-we-treat/benzodiazepine-addiction/' },
      { label: 'Anxiety', href: '/what-we-treat/anxiety/', built: true },
      { label: 'Depression', href: '/what-we-treat/depression/', built: true },
      { label: 'PTSD & trauma', href: '/what-we-treat/ptsd-and-trauma/' },
    ],
  },
  {
    heading: 'Admissions & insurance',
    links: [
      { label: 'How admissions works', href: '/admissions/', built: true },
      { label: 'Bed availability', href: '/admissions/bed-availability/' },
      { label: 'Verify your benefits', href: '/insurance/verify-your-benefits/', built: true },
      { label: 'Insurance & payment', href: '/insurance', built: true },
      { label: 'AHCCCS & Medicaid', href: '/insurance/ahcccs-medicaid/', built: true },
      { label: 'What treatment costs', href: '/insurance/cost-of-treatment/' },
      { label: 'Professional referrals', href: '/referrals/' , built: true },
    ],
  },
  {
    heading: 'Company & resources',
    links: [
      { label: 'About us', href: '/about', built: true },
      { label: 'Clinical leadership', href: '/about/our-team/' },
      { label: 'Contact', href: '/about/contact/' },
      { label: 'Careers', href: '/about/careers/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Withdrawal timelines', href: '/resources/withdrawal-timelines/' },
      { label: 'Sober living options', href: '/resources/sober-living-arizona/', built: true },
      { label: 'Alumni community', href: '/alumni/' },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: 'Privacy policy', href: '/privacy-policy/' },
  { label: 'Notice of privacy practices', href: '/hipaa-notice-of-privacy-practices/' },
  { label: 'Terms of use', href: '/terms-of-use/' },
  { label: 'Sitemap', href: '/sitemap/' },
];
