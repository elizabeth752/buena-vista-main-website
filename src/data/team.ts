/* Single source of truth for the people who appear on the site: the team
   section, blog bylines, clinical-review credits and the individual bio pages.

   ⚠ E-E-A-T: a byline is an authorship claim. Nobody goes in this list who is
   not actually on staff, and the credentials must match what they hold. If a
   post is medically reviewed, the reviewer must be clinically qualified to
   review it — Will Heise (MD) and Breana Ramirez (RN) can; the others cannot.

   ⚠ The old WordPress site carries nine staff bios for DIFFERENT people
   (cindy-sneller, dr-paul-r-valbuena, jose-leon, julie-gable, katie-noetzel,
   lynn-santella, roxanne-maloney, sara-cothern-lcsw, tj-carlini, plus
   mike-kalesk, jill-byron and sean-kewin found in Search Console). Those are
   pre-takeover staff. Do not merge them in without confirmation from the
   client. */
export interface TeamMember {
  slug: string;
  name: string;
  credentials: string;
  title: string;
  photo: string;
  /* Can this person sign off clinical content? */
  clinicalReviewer: boolean;
  bio: string[];
  focus: string[];
}

export const team: TeamMember[] = [
  {
    slug: 'will-heise',
    name: 'Will Heise',
    credentials: 'MD, FACMT',
    title: 'Chief Medical Officer',
    photo: '/Asset/Our%20Team/Will-Heise-MD-FACMT.webp',
    clinicalReviewer: true,
    bio: [
      'Dr Heise oversees the medical side of care at Buena Vista, from the protocols that govern medical detox to the physician review that decides whether an admission is safe.',
      'He is board certified in medical toxicology, a specialism that matters more in this setting than it might sound: withdrawal from alcohol and benzodiazepines is a toxicological event, and the anti-seizure protocol used during alcohol detox sits under his authority.',
      'His involvement in a stay starts before someone arrives. Every assessment goes to a provider for review, and the plan for the first days is set from that rather than worked out on the morning of admission.',
    ],
    focus: ['Medical detox protocols', 'Withdrawal management', 'Medication review on admission', 'Co-occurring medical complexity'],
  },
  {
    slug: 'darren-lee',
    name: 'Darren Lee',
    credentials: 'M.A., LPC',
    title: 'Clinical Director',
    photo: '/Asset/Our%20Team/Darren-Lee-M.A.-LPC.webp',
    clinicalReviewer: true,
    bio: [
      'Darren leads the clinical programme: the twice-daily groups, the individual therapy, and the way the two fit together across a residential stay.',
      'As a licensed professional counselor he is responsible for what actually happens in the therapy rooms rather than the schedule on paper, including how new clients are eased into group work when the prospect of speaking in front of people is the thing they dread most.',
      'He also owns the clinical side of discharge planning, which is where a stay either holds or comes apart.',
    ],
    focus: ['Group and individual therapy', 'Trauma-informed care', 'Dual diagnosis treatment', 'Discharge planning'],
  },
  {
    slug: 'breana-ramirez',
    name: 'Breana Ramirez',
    credentials: 'BSN, RN',
    title: 'Director of Nursing',
    photo: '/Asset/Our%20Team/Breana-Ramirez-BSN-RN.webp',
    clinicalReviewer: true,
    bio: [
      'Breana runs the nursing team, which is the part of Buena Vista that never closes. Someone from her team is on site every hour of every day, including holidays.',
      'In practice she owns the experience most people actually remember from detox: the checks through the night, the vital signs, the comfort medication, and noticing early when something is going in the wrong direction.',
      'She is also the person who decides how a new admission is settled in at three in the morning, which is when a good share of them arrive.',
    ],
    focus: ['24-hour nursing care', 'Detox monitoring', 'Comfort medication', 'Admissions at any hour'],
  },
  {
    slug: 'wade-muhlhauser',
    name: 'Wade Muhlhauser',
    credentials: '',
    title: 'CEO and Partner',
    photo: '/Asset/Our%20Team/Wade-Muhlhauser.webp',
    clinicalReviewer: false,
    bio: [
      'Wade leads Buena Vista and the wider Plugged In Recovery group, and was behind the reopening of the Chandler campus.',
      'His focus is on the parts of treatment that are usually invisible from the outside: whether a real person answers the phone at four in the morning, whether a bed can be confirmed the same day, and whether somebody who calls and cannot be admitted still ends up somewhere good.',
    ],
    focus: ['Access to treatment', 'The Chandler reopening', 'Continuum of care'],
  },
];

export const bySlug = Object.fromEntries(team.map(m => [m.slug, m]));
