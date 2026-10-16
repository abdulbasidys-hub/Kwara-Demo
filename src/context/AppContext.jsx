import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { initialData } from '../data/mockData';
import { ROLES } from '../data/roles';
import { fmtMoney, uid } from '../utils';

const STORAGE_KEY = 'kwasu-assoc-platform-v4';
const AppContext = createContext(null);

const clone = (o) => JSON.parse(JSON.stringify(o));
const now = () => new Date().toISOString();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* storage unavailable — fall back to seed data */
  }
  return clone(initialData);
}

// Helpers bound to a draft state, used inside every mutation
function helpers(s) {
  const actor = () => s.users.find((u) => u.id === s.currentUserId);
  return {
    actor,
    log: (action, target = '') =>
      s.audit.unshift({ id: uid('a'), date: now(), userId: s.currentUserId, action, target }),
    mail: (to, subject, body, category = 'System') =>
      s.emails.unshift({ id: uid('e'), date: now(), to, subject, body, category }),
  };
}

const isExecRecipient = (u, audience) =>
  u.status === 'active' &&
  u.role !== 'admin' &&
  u.role !== 'member' &&
  (audience.includes('all') || audience.includes(u.role));

export function AppProvider({ children }) {
  const [state, setState] = useState(load);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, tone = 'success') => {
    const id = uid('t');
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast('Browser storage is full. Recent changes will not be kept after you close this tab.', 'error');
    }
  }, [state, toast]);

  const mutate = (fn) =>
    setState((prev) => {
      const next = clone(prev);
      fn(next, helpers(next));
      return next;
    });

  const user = state.users.find((u) => u.id === state.currentUserId) || null;
  const userById = (id) => state.users.find((u) => u.id === id);

  // ---------- View ----------
  const switchUser = (userId) => setState((prev) => ({ ...prev, currentUserId: userId }));

  // ---------- Accounts & roles ----------
  const createAccount = (data) => {
    mutate((s, { log, mail }) => {
      const u = { id: uid('u'), ...data, session: s.currentSession, status: 'invited', createdAt: now() };
      s.users.push(u);
      log('Created account', `${u.name} — ${u.office}`);
      mail(
        u.email,
        'Welcome to the KWASU Association Platform',
        `Dear ${u.name},\n\nYou have been assigned the office of ${u.office} for the ${s.currentSession} session.\n\nYou can now access the platform.\n\nStudent Affairs Unit, Kwara State University`,
        'Invitation',
      );
    });
    toast(`Account created — invitation emailed to ${data.email}`);
  };

  const resendInvite = (userId) => {
    const u = userById(userId);
    mutate((s, { log, mail }) => {
      mail(u.email, 'Reminder: your KWASU Association Platform account', `Dear ${u.name},\n\nYour account for the office of ${u.office} is ready.`, 'Invitation');
      log('Resent invitation', u.name);
    });
    toast(`Invitation re-sent to ${u.email}`);
  };

  const changeRole = (userId, role, office) => {
    mutate((s, { log, mail }) => {
      const u = s.users.find((x) => x.id === userId);
      const from = u.office;
      u.role = role;
      u.office = office;
      log('Changed role', `${u.name}: ${from} → ${office}`);
      mail(u.email, 'Your role has been updated', `Dear ${u.name},\n\nYour office on the platform has been changed from ${from} to ${office} (${ROLES[role].label}).`, 'Account');
    });
    toast('Role updated');
  };

  const setUserStatus = (userId, status) => {
    mutate((s, { log }) => {
      const u = s.users.find((x) => x.id === userId);
      u.status = status;
      log(status === 'deactivated' ? 'Deactivated account' : 'Reactivated account', `${u.name} — ${u.office}`);
    });
    toast(status === 'deactivated' ? 'Account deactivated' : 'Account reactivated');
  };

  const startNewTenure = (newSession) => {
    const count = state.users.filter((u) => u.role !== 'admin' && u.session === state.currentSession && u.status !== 'deactivated').length;
    mutate((s, { log }) => {
      const outgoing = s.users.filter((u) => u.role !== 'admin' && u.session === s.currentSession && u.status !== 'deactivated');
      outgoing.forEach((u) => {
        u.status = 'deactivated';
      });
      log('Started new tenure', `${s.currentSession} → ${newSession}; ${outgoing.length} accounts deactivated`);
      s.currentSession = newSession;
    });
    toast(`Tenure closed — ${count} outgoing accounts deactivated. Session is now ${newSession}.`);
  };

  // ---------- Communication ----------
  const sendNotice = ({ title, body, audience }) => {
    mutate((s, { log, mail }) => {
      s.notices.unshift({ id: uid('n'), title, body, fromId: s.currentUserId, audience, date: now(), readBy: [] });
      s.users.filter((u) => isExecRecipient(u, audience)).forEach((u) => mail(u.email, `[Official Notice] ${title}`, body, 'Notice'));
      log('Sent official notice', title);
    });
    toast('Notice delivered to platform inboxes and email');
  };

  const markNoticeRead = (id) =>
    setState((prev) => {
      const n = prev.notices.find((x) => x.id === id);
      if (!n || n.readBy.includes(prev.currentUserId)) return prev;
      const next = clone(prev);
      next.notices.find((x) => x.id === id).readBy.push(prev.currentUserId);
      return next;
    });

  const postAnnouncement = ({ title, body, audience, pinned }) => {
    mutate((s, { log, mail }) => {
      s.announcements.unshift({ id: uid('an'), title, body, authorId: s.currentUserId, audience, date: now(), pinned });
      const n = s.users.filter((u) => isExecRecipient(u, audience)).length;
      mail(audience.includes('all') ? 'All executives & members' : `Selected roles (${n})`, `[Announcement] ${title}`, body, 'Announcement');
      log('Posted announcement', title);
    });
    toast('Announcement published');
  };

  // ---------- Reports ----------
  const saveReport = (fields, submit) => {
    const id = fields.id || uid('r');
    mutate((s, { log, mail, actor }) => {
      let r = s.reports.find((x) => x.id === id);
      if (!r) {
        r = { id, authorId: s.currentUserId, session: s.currentSession, status: 'Draft', history: [{ date: now(), by: s.currentUserId, action: 'Draft created' }] };
        s.reports.unshift(r);
      }
      const wasReturned = r.status === 'Returned';
      Object.assign(r, { title: fields.title, type: fields.type, period: fields.period, summary: fields.summary, attachments: fields.attachments, updatedAt: now() });
      if (submit) {
        r.status = 'Submitted';
        r.history.push({ date: now(), by: s.currentUserId, action: wasReturned ? 'Resubmitted after corrections' : 'Submitted' });
        log('Submitted report', r.title);
        const me = actor();
        const president = s.users.find((u) => u.role === 'president' && u.status === 'active' && u.session === s.currentSession);
        if (president && president.id !== me.id) {
          mail(president.email, `Report submitted: ${r.title}`, `${me.name} (${me.office}) submitted "${r.title}" for your endorsement.`, 'Report');
        } else {
          mail('dsa@kwasu.edu.ng', `Report submitted: ${r.title}`, `${me.name} (${me.office}) submitted "${r.title}" for University review.`, 'Report');
        }
      } else {
        log('Saved report draft', r.title);
      }
    });
    toast(submit ? 'Report submitted — email alert sent' : 'Draft saved');
    return id;
  };

  const reviewReport = (id, action, comment = '') => {
    const labels = {
      endorse: ['Endorsed by President and forwarded to the University', 'Under Review', 'Endorsed report'],
      start: ['University review started', 'Under Review', 'Started review'],
      approve: ['Approved', 'Approved', 'Approved report'],
      return: ['Returned with comments', 'Returned', 'Returned report'],
    };
    const [historyText, status, auditText] = labels[action];
    mutate((s, { log, mail }) => {
      const r = s.reports.find((x) => x.id === id);
      r.status = status;
      r.updatedAt = now();
      r.history.push({ date: now(), by: s.currentUserId, action: historyText, ...(comment ? { comment } : {}) });
      log(auditText, r.title);
      const author = s.users.find((u) => u.id === r.authorId);
      if (action === 'endorse') {
        mail('dsa@kwasu.edu.ng', `Report forwarded for review: ${r.title}`, `The President has endorsed "${r.title}" and forwarded it for University review.`, 'Report');
      } else if (author) {
        const msg = {
          start: `Your report "${r.title}" is now under review by the University.`,
          approve: `Good news — your report "${r.title}" has been approved.${comment ? `\n\nComment: "${comment}"` : ''}`,
          return: `Your report "${r.title}" was returned with comments:\n\n"${comment}"\n\nPlease update and resubmit.`,
        }[action];
        const subj = { start: 'Report under review', approve: 'Report approved', return: 'Report returned for correction' }[action];
        mail(author.email, `${subj}: ${r.title}`, msg, 'Report');
      }
    });
    toast({ endorse: 'Report endorsed and forwarded', start: 'Review started', approve: 'Report approved — author notified', return: 'Report returned — author notified' }[action]);
  };

  // ---------- Administration ----------
  const addMember = (m) => {
    mutate((s, { log }) => {
      s.members.unshift({ id: uid('m'), status: 'Active', joined: now().slice(0, 10), ...m });
      log('Added member', m.name);
    });
    toast('Member added to register');
  };

  const toggleMemberStatus = (id) =>
    mutate((s, { log }) => {
      const m = s.members.find((x) => x.id === id);
      m.status = m.status === 'Active' ? 'Inactive' : 'Active';
      log('Updated member status', `${m.name} → ${m.status}`);
    });

  const addEvent = (e) => {
    mutate((s, { log }) => {
      s.events.push({ id: uid('ev'), attendance: [], ...e });
      log(e.type === 'Meeting' ? 'Scheduled meeting' : 'Scheduled event', e.title);
    });
    toast(`${e.type} scheduled`);
  };

  const toggleAttendance = (eventId, memberId) =>
    mutate((s) => {
      const e = s.events.find((x) => x.id === eventId);
      e.attendance = e.attendance.includes(memberId) ? e.attendance.filter((x) => x !== memberId) : [...e.attendance, memberId];
    });

  const addTransaction = (t) => {
    mutate((s, { log }) => {
      s.transactions.push({ id: uid('t'), session: s.currentSession, ...t });
      log(t.type === 'income' ? 'Recorded income' : 'Recorded expense', `${t.description} — ${fmtMoney(t.amount)}`);
    });
    toast('Transaction recorded');
  };

  const addTask = (t) => {
    mutate((s, { log, mail, actor }) => {
      s.tasks.unshift({ id: uid('k'), assignedBy: s.currentUserId, status: 'To do', ...t });
      const a = s.users.find((u) => u.id === t.assigneeId);
      mail(a.email, `New task assigned: ${t.title}`, `${actor().name} assigned you a task due ${t.due}.\n\n${t.notes || ''}`, 'Task');
      log('Assigned task', `${t.title} → ${a.name}`);
    });
    toast('Task assigned — assignee notified by email');
  };

  const setTaskStatus = (id, status) =>
    mutate((s, { log }) => {
      const t = s.tasks.find((x) => x.id === id);
      t.status = status;
      log('Updated task', `${t.title} → ${status}`);
    });

  const addDocument = (d) => {
    mutate((s, { log }) => {
      s.documents.unshift({ id: uid('d'), uploadedBy: s.currentUserId, date: now().slice(0, 10), ...d });
      log('Uploaded document', d.name);
    });
    toast('Document uploaded to library');
  };

  const value = {
    state,
    user,
    switchUser,
    userById,
    toasts,
    toast,
    createAccount,
    resendInvite,
    changeRole,
    setUserStatus,
    startNewTenure,
    sendNotice,
    markNoticeRead,
    postAnnouncement,
    saveReport,
    reviewReport,
    addMember,
    toggleMemberStatus,
    addEvent,
    toggleAttendance,
    addTransaction,
    addTask,
    setTaskStatus,
    addDocument,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);

// Notices visible to a given user
export const noticesFor = (notices, user) =>
  user.role === 'admin' ? notices : notices.filter((n) => n.audience.includes('all') || n.audience.includes(user.role));

export const announcementsFor = (items, user) =>
  user.role === 'admin' ? items : items.filter((a) => a.audience.includes('all') || a.audience.includes(user.role));
