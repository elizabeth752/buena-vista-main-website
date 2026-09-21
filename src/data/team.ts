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
      'His focus is on the parts of treatment that are usually invisible from the outside: whether the phone gets answered at four in the morning, whether a bed can be confirmed the same day, and whether somebody who calls and cannot be admitted still ends up somewhere good.',
    ],
    focus: ['Access to treatment', 'The Chandler reopening', 'Continuum of care'],
  },
];

export const bySlug = Object.fromEntries(team.map(m => [m.slug, m]));


/* ---------------------------------------------------------------------------
   LEGACY STAFF — NOT PUBLISHED.

   Nine bios carried over from the previous WordPress site, earning 288 clicks a
   year between them. They are captured here so nothing is lost and so they can
   be published by flipping one flag, but they are OFF by default and must stay
   off until the client confirms who is still on staff.

   Why this matters, and it is not a small thing:

     Dr. Paul R. Valbuena is listed as CHIEF MEDICAL OFFICER.
     Will Heise is our Chief Medical Officer.

     Julie Gable is listed as INTERIM CHIEF EXECUTIVE OFFICER.
     Wade Muhlhauser is our CEO.

   Publishing both sets would put two CMOs and two CEOs on one healthcare site.
   Others hold roles at locations Buena Vista does not operate — Katie Noetzel
   as Executive Director of Cave Creek — which is strong evidence this whole
   list predates the takeover.

   TO PUBLISH: confirm each person with the client, move them into `team` above
   with a real photo and correct credentials, and set PUBLISH_LEGACY_BIOS true.
   Do not publish the list wholesale.
--------------------------------------------------------------------------- */
export const PUBLISH_LEGACY_BIOS = false;

export const legacyTeam: TeamMember[] = [
  {
    slug: "cindy-sneller",
    name: "Cindy Sneller",
    credentials: "DNP, RN, CNS, AG CNS-BC, NEA-BC, CEN, LSS-BB",
    title: "Director of Nursing",
    photo: '',
    clinicalReviewer: false,
    bio: ["Cindy graduated from Loma Linda University with her BSN in 1999 and entered nursing as a new grad RN in the Emergency Department at St. Bernardine Medical Center in Southern California. After a busy year of learning she was recruited to Loma Linda University Medical Center where she worked the next 4 years as a staff RN and eventually the Clinical Educator in the Emergency Department. Over the following 16 years Cindy worked simultaneously in emergency nursing and the manufacturing industry. This company was a family owned international electronics manufacturing business where she worked her way up to the Vice President and General Manager position held the last 10 years. In 2015 she returned to Loma Linda University for her Doctorate of Nursing Practice with a Clinical Nurse Specialist focus preparing to return to her passion of nursing full time. Upon graduation, she accepted a position to lead the Regional Burn Program at University of California Irvine (UCI) Medical Center. In this role her skills in process improvement and quality improvement utilizing Lean Six Sigma practices resulted in streamlining intake of transferred burn patients and improvement and growth of the quality program. In early 2021, Cindy left UCI and Southern California and moved to Phoenix to lead the Emergency Department and eventually was the Director of Nursing for Barrow Neurotological at St. Joseph Hospital and Medical Center. In 2022 Cindy left the acute care setting to lead in the Substance Use Disorder space and was hired as the Vice President of Medical Operations and Quality for Buena Vista Health and Recovery. Cindy holds national certifications in Adult/Gerontology Clinical Nurse Specialist (AGCNE-BC), Certified Emergency Nurse (CEN) and Nurse Executive Advanced (NEA-BC) and is a Certified Lean Six Sigma Black Belt. In her free time she enjoys cooking, traveling to new unexplored places and spending time with her family. She has a healthy obsession with English Bulldogs too!"],
    focus: [],
  },
  {
    slug: "dr-paul-r-valbuena",
    name: "Dr. Paul R. Valbuena",
    credentials: "",
    title: "Chief Medical Officer",
    photo: '',
    clinicalReviewer: false,
    bio: ["Paul R. Valbuena, M.D. is the current Chief Medical Officer of Buena Vista Health and Recovery. He is a double board-certified psychiatrist in adult, child, and adolescent psychiatry, a Diplomate of the American Board of Psychiatry and Neurology, also specializing in addiction medicine. He completed his B.S. in Microbiology and undergraduate training at the University of Oklahoma in 1993, went onto Michigan State University to complete his adult psychiatry residency training, and proceeded to a Child and Adolescent Psychiatry Fellowship at Maricopa Integrated Health System in Phoenix, AZ. He is the founder and owner of Valbuena 360 Wellness Center in North Scottsdale, where he provides 360-degree medical services from Medical Aesthetics and Integrative Medicine to outpatient psychiatry services. Dr. Valbuena lives in Scottsdale, AZ, is happily married to his wife, Gina, whom he met in medical school, and is also the proud father of 4 children. He is dedicated to providing optimal and cutting edge medical services to all ages."],
    focus: [],
  },
  {
    slug: "julie-gable",
    name: "Julie Gable",
    credentials: "",
    title: "Interim Chief Executive Officer",
    photo: '',
    clinicalReviewer: false,
    bio: ["Julie Gable was named Buena Vista\u2019s Interim Chief Executive Officer in December 2024. Although new to this position, Julie is not new to Buena Vista Recovery, having spent the prior three years working closely with the team as a strategy consultant. Julie brings decades of experience to this position as a strategic leader, change agent, and illuminator across industries. These experiences include executive at Accenture, COO of a tech consulting firm, and, most recently, CEO of BusinessWhys, a boutique management consulting firm. Julie also coaches executive teams, helping them to increase accountability, focus, and traction on strategic goals. In 2021, Julie was honored to receive the Most Influential Women in AZ \u2013 Trailblazer Spotlight Award by AZ Big Media and, in 2022, the Outstanding Women in Business Award by Phoenix Business Journal.", "Born and raised in the small mountain town of Los Alamos, New Mexico, Julie loves to be outside in nature, playing tennis, skiing, or hiking with her husband and their two adorable rescue dogs, Solo and Mika. She is also the proud mother of two exceptional young women whose courage and thought-provoking perspectives inspire her daily. Committed to supporting her community, Julie is honored to serve on the boards of the Arizona Humane Society and the Arizona Center for Nature Conservation (Phoenix Zoo)."],
    focus: [],
  },
  {
    slug: "katie-noetzel",
    name: "Katie Noetzel",
    credentials: "",
    title: "Executive Director Cave Creek",
    photo: '',
    clinicalReviewer: false,
    bio: ["Katie Noetzel started with Buena Vista Health and Recovery in November 2023 as the Executive Director and Director of Nursing at the Cave Creek location. Before Buena Vista, Katie was a House Manager at St. Joseph\u2019s Hospital and Medical Center in Phoenix, ensuring the smooth operation of St. Joseph\u2019s 600-bed facility, including enabling effective patient placement, monitoring hospital-wide staffing levels, facilitating interdepartmental communication, and risk management. Prior to her role at St. Joseph\u2019s, Katie held a variety of hospital leadership positions, including ER Director, ER Senior Manager, Endoscopy Clinical Manager, and PACU Clinical Manager. Along with a bachelor\u2019s degree in nursing from Western Governors University, Katie also comes to Buena Vista with over a decade of nursing experience working in the emergency room at Providence Hospital in Everett, WA, the busiest ER in the state, and over a decade of business ownership, having opened and operated two Anytime Fitness locations.", "Katie prides herself in supporting her staff, ensuring they have the tools to accomplish their jobs efficiently in a safe environment, patient advocacy, and her business acumen. Katie resides in Phoenix with her husband and two Jack Russell Terriers."],
    focus: [],
  },
  {
    slug: "lynn-santella",
    name: "Lynn Santella",
    credentials: "MSN, RN",
    title: "Executive Director Chandler",
    photo: '',
    clinicalReviewer: false,
    bio: ["Lynn Santella began her role as Executive Director of the Chandler campus in April of 2023 with Buena Vista Health and Recovery Centers. Prior to this role, Lynn was the Manager of Neurosurgery at Barrow Neurological Institute at St. Joseph\u2019s Hospital and Medical Center located in Phoenix, Arizona. Lynn was responsible for overseeing the daily operations and productivity of 11 Neurosurgery Suites. Lynn spent 27 years in total in the Operating Room as a Surgical Technologist, Registered Nurse, and Nurse Manager prior to making the transition to Behavioral Health and Substance Abuse addiction treatment.", "Lynn received her Master of Science Degree in Nursing Leadership from The University of Arizona in Tucson Arizona and Bachelor of Science in Nursing from Lewis-Clark State College in Lewiston, Idaho."],
    focus: [],
  },
  {
    slug: "roxanne-maloney",
    name: "Roxanne Maloney",
    credentials: "",
    title: "HR Director",
    photo: '',
    clinicalReviewer: false,
    bio: ["Roxanne is an Arizona native, with three adult children and one granddaughter; all who live in the valley. She enjoys cooking, entertaining, traveling and spending time with family.", "She is an HR Professional with 25+years of experience and has proven record of creating a strong team environment while executing strategic HR initiatives. She enjoys being challenged and friendly competition."],
    focus: [],
  },
  {
    slug: "sara-cothern-lcsw",
    name: "Sara Cothern",
    credentials: "LCSW",
    title: "Clinical Administrator",
    photo: '',
    clinicalReviewer: false,
    bio: ["Sara Cothern joined Buena Vista Health and Recovery in June 2024 as a Clinical Administrator. Sara brings extensive experience as a Licensed Clinical Social Worker, holding dual licensure in Illinois and Arizona. Throughout her career, Sara has worked in various behavioral health sectors, including family services, trauma, crisis, medical social work, serious mental illness, and community mental health. She brings expertise in case management, counseling, program development, and leadership.", "Most recently, Sara served as Director of Community Integration at Heritage Behavioral Health Center in Decatur, IL. She has worked with individuals experiencing substance use disorders throughout her career and enjoys focusing her skills solely on this population in her role at Buena Vista.", "Sara is dedicated to trauma-informed care, harm reduction principles, and clinical quality. She finds immense fulfillment in fostering staff development and clinical growth. Sara prides herself in creating an environment where clinical teams are empowered to creatively meet each patient\u2019s individualized needs while adhering to evidence-based practices.", "She recently relocated to Tucson from Illinois with her husband, daughter, and their cats. Sara loves spending time with her family, being outdoors, and exploring the rich culture of her new home."],
    focus: [],
  },
  {
    slug: "tj-carlini",
    name: "TJ Carlini",
    credentials: "",
    title: "Director of Business Development and Strategic Growth",
    photo: '',
    clinicalReviewer: false,
    bio: ["I discovered my passion for recovery after I graduated from the Salvation Army ARC in Austin, TX. I\u2019ve worked in every facet of the treatment industry and I\u2019ve loved every minute of it! I hold a level 1 & 2 certificate in Chemical Dependence Counseling and have multiple accreditations in the field of substance abuse and recovery. I work hard to inspire patients through my own firsthand experiences and help them break the cycles of addiction, crime, hopelessness, and despair that they face in their daily lives. My goal with Buena Vista is to build a strong and efficient business development team that not only brings more exposure to our facilities but also improves the overall client experience."],
    focus: [],
  },
];

/* What the bio route actually builds. */
export const publishedTeam: TeamMember[] = PUBLISH_LEGACY_BIOS ? [...team, ...legacyTeam] : team;
