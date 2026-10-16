import {
  Bell,
  CalendarDays,
  FileText,
  FolderOpen,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  RefreshCw,
  ScrollText,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react';

export const NAV = [
  {
    label: 'Overview',
    items: [{ to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, perm: 'dashboard.view' }],
  },
  {
    label: 'Communication',
    items: [
      { to: '/app/notices', label: 'Official Notices', icon: Bell, perm: 'notices.view', badge: 'notices' },
      { to: '/app/announcements', label: 'Announcements', icon: Megaphone, perm: 'announcements.view' },
    ],
  },
  {
    label: 'Reports',
    items: [{ to: '/app/reports', label: 'Reports', icon: FileText, perm: 'reports.view', badge: 'reports' }],
  },
  {
    label: 'Administration',
    items: [
      { to: '/app/members', label: 'Member Register', icon: Users, perm: 'members.view' },
      { to: '/app/events', label: 'Events & Meetings', icon: CalendarDays, perm: 'events.view' },
      { to: '/app/finance', label: 'Dues & Finance', icon: Wallet, perm: 'finance.view' },
      { to: '/app/tasks', label: 'Tasks', icon: ListChecks, perm: 'tasks.view' },
      { to: '/app/documents', label: 'Document Library', icon: FolderOpen, perm: 'documents.view' },
    ],
  },
  {
    label: 'University',
    items: [
      { to: '/app/accounts', label: 'Accounts & Roles', icon: UserCog, perm: 'accounts.manage' },
      { to: '/app/handover', label: 'Tenure Handover', icon: RefreshCw, perm: 'handover.manage' },
      { to: '/app/audit', label: 'Audit Log', icon: ScrollText, perm: 'audit.view' },
    ],
  },
];
