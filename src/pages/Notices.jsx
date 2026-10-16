import { useState } from 'react';
import { Bell, CheckCheck, Mail, Send } from 'lucide-react';
import { noticesFor, useApp } from '../context/AppContext';
import { can, EXEC_ROLES, ROLES } from '../data/roles';
import { Badge, Card, Empty, Field, Guard, PageHeader } from '../components/ui';
import { fmtDateTime } from '../utils';

export function AudiencePicker({ value, onChange }) {
  const all = value.includes('all');
  const toggle = (r) => onChange(value.includes(r) ? value.filter((x) => x !== r) : [...value.filter((x) => x !== 'all'), r]);
  return (
    <div className="chips">
      <button type="button" className={`chip ${all ? 'on' : ''}`} onClick={() => onChange(['all'])}>
        All executives
      </button>
      {EXEC_ROLES.map((r) => (
        <button type="button" key={r} className={`chip ${!all && value.includes(r) ? 'on' : ''}`} onClick={() => toggle(r)}>
          {ROLES[r].label}
        </button>
      ))}
    </div>
  );
}

export const audienceLabel = (aud) => (aud.includes('all') ? 'All executives' : aud.map((r) => ROLES[r]?.short).join(', '));

export default function Notices() {
  return (
    <Guard perm="notices.view" title="Official Notices">
      <NoticesInner />
    </Guard>
  );
}

function NoticesInner() {
  const { state, user, sendNotice, markNoticeRead, userById } = useApp();
  const sender = can(user, 'notices.send');
  const notices = noticesFor(state.notices, user);
  const [openId, setOpenId] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', audience: ['all'] });

  const recipientsOf = (aud) =>
    state.users.filter((u) => u.status === 'active' && EXEC_ROLES.includes(u.role) && u.session === state.currentSession && (aud.includes('all') || aud.includes(u.role)));

  const submit = (e) => {
    e.preventDefault();
    if (!form.audience.length) return;
    sendNotice(form);
    setForm({ title: '', body: '', audience: ['all'] });
  };

  const open = (n) => {
    setOpenId(openId === n.id ? null : n.id);
    if (!sender) markNoticeRead(n.id);
  };

  return (
    <>
      <PageHeader
        eyebrow="Communication and email"
        title={sender ? 'Official Notices' : 'Notice Inbox'}
        subtitle={
          sender
            ? 'Notices go to each executive’s platform inbox and their email address at the same time.'
            : 'Official communication from the University, also delivered to your email.'
        }
      />

      <div className={sender ? 'grid-sidebar' : ''}>
        {sender && (
          <Card title="Send an official notice">
            <form onSubmit={submit} className="stack">
              <Field label="Title">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Submission of quarterly reports" />
              </Field>
              <Field label="Message">
                <textarea required rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              </Field>
              <Field label="Send to">
                <AudiencePicker value={form.audience} onChange={(audience) => setForm({ ...form, audience })} />
              </Field>
              <div className="send-row">
                <small className="muted">
                  <Mail size={14} /> {recipientsOf(form.audience).length} recipient(s) by inbox + email
                </small>
                <button className="btn btn-primary" disabled={!form.audience.length}>
                  <Send size={16} /> Send notice
                </button>
              </div>
            </form>
          </Card>
        )}

        <Card title={sender ? 'Sent notices' : 'Inbox'} pad={false}>
          {notices.length === 0 && <Empty icon={Bell} title="No notices yet" />}
          <ul className="notice-list">
            {notices.map((n) => {
              const unread = !sender && !n.readBy.includes(user.id);
              const recips = recipientsOf(n.audience);
              const readCount = recips.filter((u) => n.readBy.includes(u.id)).length;
              return (
                <li key={n.id} className={`notice ${unread ? 'unread' : ''} ${openId === n.id ? 'open' : ''}`}>
                  <button className="notice-head" onClick={() => open(n)}>
                    {unread && <span className="dot" />}
                    <div className="grow">
                      <strong>{n.title}</strong>
                      <small className="muted">
                        {userById(n.fromId)?.office} · {fmtDateTime(n.date)} · To: {audienceLabel(n.audience)}
                      </small>
                    </div>
                    {sender ? (
                      <Badge tone={readCount === recips.length ? 'green' : 'amber'}>
                        <CheckCheck size={12} /> {readCount}/{recips.length} read
                      </Badge>
                    ) : unread ? (
                      <Badge tone="amber">New</Badge>
                    ) : null}
                  </button>
                  {openId === n.id && (
                    <div className="notice-body">
                      <p className="pre">{n.body}</p>
                      {sender ? (
                        <div className="read-receipts">
                          {recips.map((u) => (
                            <span key={u.id} className={`chip ${n.readBy.includes(u.id) ? 'on' : ''}`}>
                              {u.office}: {n.readBy.includes(u.id) ? 'Read' : 'Unread'}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <small className="muted">
                          <Mail size={12} /> Also delivered to {user.email}
                        </small>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
