export const ASSOCIATION_NAME = 'KWASU Students’ Association';

export const REPORT_TEMPLATES = {
  Activity:
    'Period covered:\n\nActivities carried out:\n1. \n2. \n\nOutcomes / impact:\n\nChallenges:\n\nRecommendations:',
  Event:
    'Event name:\nDate & venue:\nAttendance:\n\nSummary of the event:\n\nBudget vs actual spend:\n\nLessons learned:',
  Financial:
    'Opening balance:\nTotal income:\nTotal expenditure:\nClosing balance:\n\nMajor items of expenditure:\n\nNotes (attach receipts):',
  Minutes:
    'Meeting:\nDate / time / venue:\nPresent:\nApologies:\n\nAgenda:\n1. \n\nResolutions:\n\nAction points:',
  Handover:
    'Outgoing council:\nTenure:\n\nAchievements:\n\nOngoing projects:\n\nAssets & funds handed over:\n\nOutstanding obligations:\n\nAdvice to incoming council:',
};

export const REPORT_TYPES = Object.keys(REPORT_TEMPLATES);
export const REPORT_STATUSES = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Returned'];

const S = '2026/2027';
const P = '2025/2026';

export const initialData = {
  currentUserId: 'u1',
  currentSession: S,

  users: [
    { id: 'u1', name: 'Dr. Aisha Bello', email: 'dsa@kwasu.edu.ng', phone: '0803 000 0001', role: 'admin', office: 'Dean of Student Affairs', session: null, status: 'active', createdAt: '2026-01-10T09:00:00Z' },
    { id: 'u2', name: 'Ibrahim Olawale', email: 'president@assoc.kwasu.edu.ng', phone: '0806 112 3344', role: 'president', office: 'President', session: S, status: 'active', createdAt: '2026-09-22T10:00:00Z' },
    { id: 'u3', name: 'Fatima Yusuf', email: 'gensec@assoc.kwasu.edu.ng', phone: '0807 221 9087', role: 'secretary', office: 'General Secretary', session: S, status: 'active', createdAt: '2026-09-22T10:05:00Z' },
    { id: 'u4', name: 'Tunde Adeyemi', email: 'finsec@assoc.kwasu.edu.ng', phone: '0810 554 1209', role: 'finsec', office: 'Financial Secretary', session: S, status: 'active', createdAt: '2026-09-22T10:10:00Z' },
    { id: 'u5', name: 'Grace Okafor', email: 'pro@assoc.kwasu.edu.ng', phone: '0813 778 4410', role: 'pro', office: 'Public Relations Officer', session: S, status: 'active', createdAt: '2026-09-22T10:15:00Z' },
    { id: 'u6', name: 'Musa Abdullahi', email: 'welfare@assoc.kwasu.edu.ng', phone: '0802 310 7765', role: 'executive', office: 'Welfare Director', session: S, status: 'active', createdAt: '2026-09-22T10:20:00Z' },
    { id: 'u7', name: 'Halima Sani', email: 'sports@assoc.kwasu.edu.ng', phone: '0805 908 1123', role: 'executive', office: 'Sports Director', session: S, status: 'invited', createdAt: '2026-10-14T11:00:00Z' },
    { id: 'u8', name: 'Zainab Lawal', email: 'zainab.lawal@students.kwasu.edu.ng', phone: '0809 445 6612', role: 'member', office: 'Member', session: S, status: 'active', createdAt: '2026-09-30T08:00:00Z' },
    { id: 'u9', name: 'Kehinde Ajayi', email: 'k.ajayi@assoc.kwasu.edu.ng', phone: '0803 667 0012', role: 'president', office: 'President', session: P, status: 'deactivated', createdAt: '2025-09-18T10:00:00Z' },
    { id: 'u10', name: 'Blessing Eze', email: 'b.eze@assoc.kwasu.edu.ng', phone: '0816 223 7781', role: 'secretary', office: 'General Secretary', session: P, status: 'deactivated', createdAt: '2025-09-18T10:05:00Z' },
    { id: 'u11', name: 'Samuel Oni', email: 's.oni@assoc.kwasu.edu.ng', phone: '0818 990 4421', role: 'finsec', office: 'Financial Secretary', session: P, status: 'deactivated', createdAt: '2025-09-18T10:10:00Z' },
  ],

  notices: [
    { id: 'n1', title: 'Submission of 2026/2027 Action Plan', body: 'All newly inaugurated executives are required to submit the Association’s action plan for the 2026/2027 session through the Reports module on or before 31st October 2026.\n\nThe plan should include proposed programmes, timelines and an estimated budget.\n\nDean of Student Affairs', fromId: 'u1', audience: ['all'], date: '2026-10-12T09:30:00Z', readBy: ['u2', 'u3'] },
    { id: 'n2', title: 'Financial Records Review — First Quarter', body: 'The Financial Secretary is to make available all receipts and financial records for the first quarter of the session for review by the Student Affairs Unit.\n\nKindly upload them as a Financial report with attachments.', fromId: 'u1', audience: ['finsec', 'president'], date: '2026-10-08T14:00:00Z', readBy: ['u4'] },
    { id: 'n3', title: 'Inauguration of the 2026/2027 Executive Council', body: 'Congratulations on your inauguration. Your accounts have been created on the Association Management Platform. Please complete your profile and familiarise yourselves with the platform.', fromId: 'u1', audience: ['all'], date: '2026-09-22T12:00:00Z', readBy: ['u2', 'u3', 'u4', 'u5', 'u6'] },
  ],

  announcements: [
    { id: 'an1', title: 'Freshers’ Orientation Week', body: 'The Association will hold a Freshers’ Orientation Week from 26th–30th October 2026 at the University Auditorium. All executives should be available to support the programme.', authorId: 'u5', audience: ['all'], date: '2026-10-13T10:00:00Z', pinned: true },
    { id: 'an2', title: 'Executive meeting moved to Friday', body: 'This week’s executive meeting has been moved to Friday, 4pm, at the Student Affairs Conference Room.', authorId: 'u2', audience: ['president', 'secretary', 'finsec', 'pro', 'executive'], date: '2026-10-10T16:20:00Z', pinned: false },
    { id: 'an3', title: 'Dues payment window open', body: 'Members can now pay their 2026/2027 session dues of ₦2,000. Contact the Financial Secretary for payment details and receipts.', authorId: 'u5', audience: ['all'], date: '2026-10-01T09:00:00Z', pinned: false },
  ],

  reports: [
    {
      id: 'r1', title: 'September 2026 Activity Report', type: 'Activity', authorId: 'u3', session: S, period: 'September 2026', status: 'Approved',
      summary: 'Period covered: 22nd – 30th September 2026\n\nActivities carried out:\n1. Inauguration of the 2026/2027 executive council\n2. First executive meeting and handover review\n3. Courtesy visit to the Dean of Student Affairs\n\nOutcomes / impact:\nCouncil fully constituted and platform accounts activated.\n\nChallenges:\nSome records from the previous session were incomplete.\n\nRecommendations:\nAll offices should upload their records to the document library.',
      attachments: [{ name: 'inauguration-attendance.pdf', size: 245000 }],
      history: [
        { date: '2026-09-30T15:00:00Z', by: 'u3', action: 'Draft created' },
        { date: '2026-10-01T09:10:00Z', by: 'u3', action: 'Submitted' },
        { date: '2026-10-01T13:40:00Z', by: 'u2', action: 'Endorsed by President and forwarded to the University' },
        { date: '2026-10-03T10:15:00Z', by: 'u1', action: 'Approved', comment: 'Well documented. Thank you.' },
      ],
      updatedAt: '2026-10-03T10:15:00Z',
    },
    {
      id: 'r2', title: 'Q1 Financial Report (Sept – Oct)', type: 'Financial', authorId: 'u4', session: S, period: 'Sept – Oct 2026', status: 'Under Review',
      summary: 'Opening balance: ₦185,000\nTotal income: ₦212,000\nTotal expenditure: ₦96,500\nClosing balance: ₦300,500\n\nMajor items of expenditure:\n- Inauguration logistics: ₦45,000\n- Printing of membership cards: ₦28,000\n- Transport for courtesy visits: ₦12,500\n\nNotes (attach receipts):\nAll receipts attached.',
      attachments: [{ name: 'receipts-sept-oct.pdf', size: 1820000 }, { name: 'cashbook-q1.xlsx', size: 38000 }],
      history: [
        { date: '2026-10-09T11:00:00Z', by: 'u4', action: 'Draft created' },
        { date: '2026-10-10T08:30:00Z', by: 'u4', action: 'Submitted' },
        { date: '2026-10-10T12:00:00Z', by: 'u2', action: 'Endorsed by President and forwarded to the University' },
      ],
      updatedAt: '2026-10-10T12:00:00Z',
    },
    {
      id: 'r3', title: 'Minutes — Executive Meeting, 10 Oct 2026', type: 'Minutes', authorId: 'u3', session: S, period: '10 October 2026', status: 'Submitted',
      summary: 'Meeting: Executive Council Meeting\nDate / time / venue: 10/10/2026, 4pm, Student Affairs Conference Room\nPresent: President, Gen. Sec., Fin. Sec., PRO, Welfare Director\nApologies: Sports Director\n\nAgenda:\n1. Freshers’ Orientation Week\n2. Dues collection\n\nResolutions:\nOrientation Week to hold 26–30 October.\n\nAction points:\nPRO to publish announcement; Fin. Sec. to open dues window.',
      attachments: [],
      history: [
        { date: '2026-10-11T09:00:00Z', by: 'u3', action: 'Draft created' },
        { date: '2026-10-11T18:00:00Z', by: 'u3', action: 'Submitted' },
      ],
      updatedAt: '2026-10-11T18:00:00Z',
    },
    {
      id: 'r4', title: 'Welfare Outreach Event Report', type: 'Event', authorId: 'u6', session: S, period: '5 October 2026', status: 'Returned',
      summary: 'Event name: Hostel Welfare Outreach\nDate & venue: 5th October 2026, Male & Female Hostels\nAttendance: about 120 students\n\nSummary of the event:\nDistribution of welfare packs and collection of complaints.\n\nBudget vs actual spend:\n₦30,000 / ₦34,000',
      attachments: [{ name: 'outreach-photos.jpg', size: 940000 }],
      history: [
        { date: '2026-10-06T10:00:00Z', by: 'u6', action: 'Draft created' },
        { date: '2026-10-06T15:00:00Z', by: 'u6', action: 'Submitted' },
        { date: '2026-10-07T09:00:00Z', by: 'u2', action: 'Endorsed by President and forwarded to the University' },
        { date: '2026-10-09T11:30:00Z', by: 'u1', action: 'Returned with comments', comment: 'Please attach receipts explaining the ₦4,000 overspend and include the list of complaints collected.' },
      ],
      updatedAt: '2026-10-09T11:30:00Z',
    },
    {
      id: 'r5', title: 'Freshers’ Orientation Plan', type: 'Activity', authorId: 'u5', session: S, period: 'October 2026', status: 'Draft',
      summary: 'Period covered: 26th – 30th October 2026\n\nActivities carried out:\n1. Campus tour\n2. Welcome talk by the Dean\n',
      attachments: [],
      history: [{ date: '2026-10-14T13:00:00Z', by: 'u5', action: 'Draft created' }],
      updatedAt: '2026-10-14T13:00:00Z',
    },
    {
      id: 'r6', title: '2025/2026 End-of-Tenure Handover Report', type: 'Handover', authorId: 'u9', session: P, period: '2025/2026 session', status: 'Approved',
      summary: 'Outgoing council: 2025/2026 Executive Council\nTenure: Sept 2025 – Sept 2026\n\nAchievements:\nHosted the annual cultural day; renovated the association office.\n\nAssets & funds handed over:\nBank balance ₦185,000; 2 laptops; 1 projector.\n\nAdvice to incoming council:\nKeep financial records up to date and file reports on time.',
      attachments: [{ name: 'asset-register.pdf', size: 310000 }],
      history: [
        { date: '2026-09-10T09:00:00Z', by: 'u9', action: 'Submitted' },
        { date: '2026-09-15T10:00:00Z', by: 'u1', action: 'Approved', comment: 'Handover accepted.' },
      ],
      updatedAt: '2026-09-15T10:00:00Z',
    },
  ],

  members: [
    { id: 'm1', name: 'Aminat Bakare', matric: '23/67MC/00142', dept: 'Mass Communication', level: '300', phone: '0803 441 2290', email: 'aminat.bakare@students.kwasu.edu.ng', status: 'Active', joined: '2023-11-02' },
    { id: 'm2', name: 'Chinedu Obi', matric: '24/47CS/00311', dept: 'Computer Science', level: '200', phone: '0812 220 1934', email: 'chinedu.obi@students.kwasu.edu.ng', status: 'Active', joined: '2024-11-14' },
    { id: 'm3', name: 'Yusuf Garba', matric: '22/27LW/00088', dept: 'Law', level: '400', phone: '0706 551 0098', email: 'yusuf.garba@students.kwasu.edu.ng', status: 'Active', joined: '2022-12-01' },
    { id: 'm4', name: 'Funmilayo Adebayo', matric: '25/57AC/00412', dept: 'Accounting', level: '100', phone: '0815 667 2231', email: 'funmi.adebayo@students.kwasu.edu.ng', status: 'Active', joined: '2026-10-05' },
    { id: 'm5', name: 'Abubakar Salihu', matric: '23/37BC/00213', dept: 'Biochemistry', level: '300', phone: '0803 908 4412', email: 'abubakar.salihu@students.kwasu.edu.ng', status: 'Active', joined: '2023-11-20' },
    { id: 'm6', name: 'Esther Akande', matric: '24/77NS/00054', dept: 'Nursing Science', level: '200', phone: '0902 334 1187', email: 'esther.akande@students.kwasu.edu.ng', status: 'Active', joined: '2024-12-03' },
    { id: 'm7', name: 'Ridwan Oyelade', matric: '22/57EC/00176', dept: 'Economics', level: '400', phone: '0810 223 9981', email: 'ridwan.oyelade@students.kwasu.edu.ng', status: 'Active', joined: '2022-11-28' },
    { id: 'm8', name: 'Mariam Usman', matric: '25/17EN/00301', dept: 'English', level: '100', phone: '0816 552 4471', email: 'mariam.usman@students.kwasu.edu.ng', status: 'Active', joined: '2026-10-07' },
    { id: 'm9', name: 'Daniel Ogunleye', matric: '23/37PH/00099', dept: 'Physics', level: '300', phone: '0705 664 1123', email: 'daniel.ogunleye@students.kwasu.edu.ng', status: 'Active', joined: '2023-12-11' },
    { id: 'm10', name: 'Hauwa Mohammed', matric: '24/37MB/00187', dept: 'Microbiology', level: '200', phone: '0813 445 8890', email: 'hauwa.mohammed@students.kwasu.edu.ng', status: 'Active', joined: '2024-11-30' },
    { id: 'm11', name: 'Peter Olaniyan', matric: '21/87CE/00041', dept: 'Civil Engineering', level: '500', phone: '0802 117 6654', email: 'peter.olaniyan@students.kwasu.edu.ng', status: 'Active', joined: '2021-12-06' },
    { id: 'm12', name: 'Rukayat Alabi', matric: '23/17PS/00230', dept: 'Political Science', level: '300', phone: '0809 778 3312', email: 'rukayat.alabi@students.kwasu.edu.ng', status: 'Active', joined: '2023-11-15' },
    { id: 'm13', name: 'Joseph Adekunle', matric: '24/57BA/00265', dept: 'Business Administration', level: '200', phone: '0817 990 2245', email: 'joseph.adekunle@students.kwasu.edu.ng', status: 'Inactive', joined: '2024-11-21' },
    { id: 'm14', name: 'Khadijah Ismail', matric: '25/37CH/00398', dept: 'Industrial Chemistry', level: '100', phone: '0903 221 5567', email: 'khadijah.ismail@students.kwasu.edu.ng', status: 'Active', joined: '2026-10-09' },
  ],

  events: [
    { id: 'ev1', title: 'Executive Council Meeting', type: 'Meeting', date: '2026-10-10', time: '16:00', venue: 'Student Affairs Conference Room', description: 'Planning for Freshers’ Orientation Week and dues collection.', attendance: ['m1', 'm3', 'm5'] },
    { id: 'ev2', title: 'Hostel Welfare Outreach', type: 'Event', date: '2026-10-05', time: '10:00', venue: 'Male & Female Hostels', description: 'Distribution of welfare packs.', attendance: ['m1', 'm2', 'm4', 'm6', 'm7', 'm9', 'm10'] },
    { id: 'ev3', title: 'Freshers’ Orientation Week', type: 'Event', date: '2026-10-26', time: '09:00', venue: 'University Auditorium', description: 'Five-day orientation programme for new students.', attendance: [] },
    { id: 'ev4', title: 'General Congress', type: 'Meeting', date: '2026-11-07', time: '14:00', venue: 'Lecture Theatre 1', description: 'First general meeting of members for the session.', attendance: [] },
    { id: 'ev5', title: 'Executive Council Meeting', type: 'Meeting', date: '2026-10-23', time: '16:00', venue: 'Student Affairs Conference Room', description: 'Final preparations for Orientation Week.', attendance: [] },
    { id: 'ev6', title: 'Inauguration Ceremony', type: 'Event', date: '2026-09-20', time: '11:00', venue: 'Senate Building Hall', description: 'Inauguration of the 2026/2027 executive council.', attendance: ['m1', 'm2', 'm3', 'm5', 'm7', 'm9', 'm11', 'm12'] },
  ],

  transactions: [
    { id: 't1', date: '2025-10-15', type: 'income', category: 'Dues', description: 'Session dues — 2025/2026', amount: 240000, session: P, receipt: 'RC-0091' },
    { id: 't2', date: '2026-03-12', type: 'expense', category: 'Events', description: 'Cultural day', amount: 150000, session: P, receipt: 'RC-0114' },
    { id: 't3', date: '2026-06-02', type: 'income', category: 'Sponsorship', description: 'Alumni donation', amount: 120000, session: P, receipt: 'RC-0131' },
    { id: 't4', date: '2026-07-20', type: 'expense', category: 'Office', description: 'Office renovation', amount: 25000, session: P, receipt: 'RC-0140' },
    { id: 't5', date: '2026-09-22', type: 'income', category: 'Balance b/f', description: 'Balance handed over from 2025/2026', amount: 185000, session: S, receipt: 'HO-2026' },
    { id: 't6', date: '2026-09-25', type: 'expense', category: 'Events', description: 'Inauguration logistics', amount: 45000, session: S, receipt: 'RC-0152' },
    { id: 't7', date: '2026-10-02', type: 'income', category: 'Dues', description: 'Dues collected — week 1 (62 members)', amount: 124000, session: S, receipt: 'RC-0155' },
    { id: 't8', date: '2026-10-04', type: 'expense', category: 'Printing', description: 'Membership cards', amount: 28000, session: S, receipt: 'RC-0156' },
    { id: 't9', date: '2026-10-05', type: 'expense', category: 'Welfare', description: 'Welfare outreach packs', amount: 34000, session: S, receipt: 'RC-0158' },
    { id: 't10', date: '2026-10-09', type: 'income', category: 'Dues', description: 'Dues collected — week 2 (44 members)', amount: 88000, session: S, receipt: 'RC-0161' },
    { id: 't11', date: '2026-10-11', type: 'expense', category: 'Transport', description: 'Courtesy visits', amount: 12500, session: S, receipt: 'RC-0162' },
  ],

  tasks: [
    { id: 'k1', title: 'Publish Orientation Week flyer', assigneeId: 'u5', assignedBy: 'u2', due: '2026-10-18', status: 'In progress', notes: 'Coordinate with the Media Unit.' },
    { id: 'k2', title: 'Open dues collection window', assigneeId: 'u4', assignedBy: 'u2', due: '2026-10-01', status: 'Done', notes: '' },
    { id: 'k3', title: 'Update member register with new freshers', assigneeId: 'u3', assignedBy: 'u2', due: '2026-10-25', status: 'To do', notes: '' },
    { id: 'k4', title: 'Resubmit outreach report with receipts', assigneeId: 'u6', assignedBy: 'u3', due: '2026-10-17', status: 'To do', notes: 'See University comments on the report.' },
    { id: 'k5', title: 'Prepare 2026/2027 action plan', assigneeId: 'u2', assignedBy: 'u1', due: '2026-10-31', status: 'In progress', notes: 'As requested in the official notice.' },
    { id: 'k6', title: 'Book auditorium for Orientation Week', assigneeId: 'u3', assignedBy: 'u2', due: '2026-10-15', status: 'Done', notes: '' },
  ],

  documents: [
    { id: 'd1', name: 'Association Constitution (2024 amended).pdf', category: 'Constitution', session: '—', size: 812000, uploadedBy: 'u1', date: '2026-01-15' },
    { id: 'd2', name: 'University Guidelines for Student Associations.pdf', category: 'Policy', session: '—', size: 1240000, uploadedBy: 'u1', date: '2026-01-15' },
    { id: 'd3', name: 'Financial Management Policy.pdf', category: 'Policy', session: '—', size: 455000, uploadedBy: 'u1', date: '2026-02-03' },
    { id: 'd4', name: '2025-2026 Handover Asset Register.pdf', category: 'Past Records', session: P, size: 310000, uploadedBy: 'u9', date: '2026-09-10' },
    { id: 'd5', name: 'Minutes — Inaugural Meeting.docx', category: 'Minutes', session: S, size: 64000, uploadedBy: 'u3', date: '2026-09-23' },
    { id: 'd6', name: '2025-2026 Annual Report.pdf', category: 'Past Records', session: P, size: 2210000, uploadedBy: 'u10', date: '2026-09-05' },
  ],

  audit: [
    { id: 'a1', date: '2026-10-14T11:00:00Z', userId: 'u1', action: 'Created account', target: 'Halima Sani — Sports Director' },
    { id: 'a2', date: '2026-10-14T13:00:00Z', userId: 'u5', action: 'Saved report draft', target: 'Freshers’ Orientation Plan' },
    { id: 'a3', date: '2026-10-13T10:00:00Z', userId: 'u5', action: 'Posted announcement', target: 'Freshers’ Orientation Week' },
    { id: 'a4', date: '2026-10-12T09:30:00Z', userId: 'u1', action: 'Sent official notice', target: 'Submission of 2026/2027 Action Plan' },
    { id: 'a5', date: '2026-10-11T18:00:00Z', userId: 'u3', action: 'Submitted report', target: 'Minutes — Executive Meeting, 10 Oct 2026' },
    { id: 'a6', date: '2026-10-11T12:30:00Z', userId: 'u4', action: 'Recorded expense', target: 'Courtesy visits — ₦12,500' },
    { id: 'a7', date: '2026-10-10T12:00:00Z', userId: 'u2', action: 'Endorsed report', target: 'Q1 Financial Report (Sept – Oct)' },
    { id: 'a8', date: '2026-10-09T11:30:00Z', userId: 'u1', action: 'Returned report', target: 'Welfare Outreach Event Report' },
    { id: 'a9', date: '2026-09-22T10:00:00Z', userId: 'u1', action: 'Started new tenure', target: '2025/2026 → 2026/2027; 3 accounts deactivated' },
  ],

  emails: [
    { id: 'e1', date: '2026-10-14T11:00:00Z', to: 'sports@assoc.kwasu.edu.ng', subject: 'Welcome to the KWASU Association Platform', body: 'Dear Halima Sani,\n\nYou have been assigned the office of Sports Director for the 2026/2027 session.\n\nYou can now access the platform.\n\nStudent Affairs Unit, Kwara State University', category: 'Invitation' },
    { id: 'e2', date: '2026-10-12T09:30:00Z', to: 'All executives (5)', subject: '[Official Notice] Submission of 2026/2027 Action Plan', body: 'All newly inaugurated executives are required to submit the Association’s action plan for the 2026/2027 session through the Reports module on or before 31st October 2026.', category: 'Notice' },
    { id: 'e3', date: '2026-10-09T11:30:00Z', to: 'welfare@assoc.kwasu.edu.ng', subject: 'Report returned for correction: Welfare Outreach Event Report', body: 'Your report "Welfare Outreach Event Report" was returned with comments:\n\n"Please attach receipts explaining the ₦4,000 overspend and include the list of complaints collected."\n\nPlease update and resubmit.', category: 'Report' },
    { id: 'e4', date: '2026-10-10T08:30:00Z', to: 'president@assoc.kwasu.edu.ng', subject: 'Report submitted: Q1 Financial Report (Sept – Oct)', body: 'Tunde Adeyemi (Financial Secretary) submitted "Q1 Financial Report (Sept – Oct)" for your endorsement.', category: 'Report' },
  ],
};
