export const ROLES = {
  admin: {
    label: 'University Administrator',
    short: 'Admin',
    color: '#7c3aed',
    duties:
      'Creates and deactivates accounts; assigns and changes roles; sends official notices; reviews and approves reports; views all dashboards and audit logs.',
  },
  president: {
    label: 'President',
    short: 'President',
    color: '#4f46e5',
    duties:
      'Oversees all Association activity; approves internal reports before they go to the University; publishes announcements; views all modules.',
  },
  secretary: {
    label: 'General Secretary',
    short: 'Gen. Sec.',
    color: '#0891b2',
    duties:
      'Manages minutes, correspondence and the member register; prepares activity reports; schedules meetings.',
  },
  finsec: {
    label: 'Financial Secretary / Treasurer',
    short: 'Fin. Sec.',
    color: '#d97706',
    duties:
      'Records dues, income and expenses; prepares financial reports with supporting receipts; views the finance dashboard.',
  },
  pro: {
    label: 'Public Relations Officer',
    short: 'PRO',
    color: '#db2777',
    duties: 'Publishes announcements and event information; manages the public notice board.',
  },
  executive: {
    label: 'Other Executive',
    short: 'Executive',
    color: '#475569',
    duties: 'Access to notices, assigned tasks, meetings and the reports relevant to their office.',
  },
  member: {
    label: 'Member',
    short: 'Member',
    color: '#64748b',
    duties: 'Receive announcements, view events and update their personal details.',
  },
};

export const ROLE_KEYS = Object.keys(ROLES);
export const EXEC_ROLES = ['president', 'secretary', 'finsec', 'pro', 'executive'];
const ALL = ['admin', ...EXEC_ROLES, 'member'];
const STAFF = ['admin', ...EXEC_ROLES];

export const PERMISSIONS = {
  'dashboard.view': ALL,
  'accounts.manage': ['admin'],
  'handover.manage': ['admin'],
  'roles.view': ALL,
  'notices.view': STAFF,
  'notices.send': ['admin'],
  'announcements.view': ALL,
  'announcements.post': ['admin', 'president', 'pro'],
  'emails.view': ALL,
  'reports.view': STAFF,
  'reports.viewAll': ['admin', 'president'],
  'reports.create': EXEC_ROLES,
  'reports.endorse': ['president'],
  'reports.review': ['admin'],
  'members.view': STAFF,
  'members.manage': ['president', 'secretary'],
  'events.view': ALL,
  'events.manage': ['admin', 'president', 'secretary', 'pro'],
  'finance.view': ['admin', 'president', 'finsec'],
  'finance.manage': ['finsec'],
  'tasks.view': STAFF,
  'tasks.assign': ['admin', 'president', 'secretary'],
  'documents.view': ALL,
  'documents.upload': ['admin', 'president', 'secretary'],
  'audit.view': ['admin'],
};

// Whether a role holds a permission (used by the Roles & Permissions page)
export const allows = (role, perm) => (PERMISSIONS[perm] || []).includes(role);

export const can = (user, perm) => !!user && allows(user.role, perm);

// Rows for the permission matrix on the Roles page
export const PERMISSION_MATRIX = [
  ['Create / deactivate accounts & assign roles', 'accounts.manage'],
  ['Close tenure & hand over', 'handover.manage'],
  ['Send official University notices', 'notices.send'],
  ['Receive official notices', 'notices.view'],
  ['Publish announcements', 'announcements.post'],
  ['View announcements', 'announcements.view'],
  ['Submit reports', 'reports.create'],
  ['Endorse internal reports', 'reports.endorse'],
  ['Review & approve reports', 'reports.review'],
  ['View member register', 'members.view'],
  ['Manage member register', 'members.manage'],
  ['View events & meetings', 'events.view'],
  ['Schedule events & take attendance', 'events.manage'],
  ['View finance dashboard', 'finance.view'],
  ['Record dues, income & expenses', 'finance.manage'],
  ['Assign tasks', 'tasks.assign'],
  ['View document library', 'documents.view'],
  ['Upload documents', 'documents.upload'],
  ['View audit log', 'audit.view'],
];
