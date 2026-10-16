import { useState } from 'react';
import { Megaphone, Pin, Send } from 'lucide-react';
import { announcementsFor, useApp } from '../context/AppContext';
import { can } from '../data/roles';
import { Avatar, Card, Empty, Field, PageHeader } from '../components/ui';
import { fmtDateTime } from '../utils';
import { AudiencePicker, audienceLabel } from './Notices';

export default function Announcements() {
  const { state, user, postAnnouncement, userById } = useApp();
  const poster = can(user, 'announcements.post');
  const [form, setForm] = useState({ title: '', body: '', audience: ['all'], pinned: false });
  const items = announcementsFor(state.announcements, user).sort((a, b) => b.pinned - a.pinned || b.date.localeCompare(a.date));

  const submit = (e) => {
    e.preventDefault();
    postAnnouncement(form);
    setForm({ title: '', body: '', audience: ['all'], pinned: false });
  };

  return (
    <>
      <PageHeader
        eyebrow="Internal announcements"
        title="Announcements"
        subtitle="The President and PRO publish to all executives or to selected roles. This is the Association’s notice board."
      />
      <div className={poster ? 'grid-sidebar' : ''}>
        {poster && (
          <Card title="New announcement">
            <form onSubmit={submit} className="stack">
              <Field label="Title">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Message">
                <textarea required rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              </Field>
              <Field label="Audience">
                <AudiencePicker value={form.audience} onChange={(audience) => setForm({ ...form, audience })} />
              </Field>
              <label className="check">
                <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Pin to top of notice board
              </label>
              <button className="btn btn-primary" disabled={!form.audience.length}>
                <Send size={16} /> Publish
              </button>
            </form>
          </Card>
        )}

        <div className="stack">
          {items.length === 0 && (
            <Card>
              <Empty icon={Megaphone} title="No announcements" />
            </Card>
          )}
          {items.map((a) => {
            const author = userById(a.authorId);
            return (
              <article key={a.id} className={`announcement ${a.pinned ? 'pinned' : ''}`}>
                <div className="announcement-head">
                  <Avatar user={author} size={36} />
                  <div className="grow">
                    <strong>{author?.name}</strong>
                    <small className="muted">
                      {author?.office} · {fmtDateTime(a.date)}
                    </small>
                  </div>
                  {a.pinned && (
                    <span className="pin">
                      <Pin size={14} /> Pinned
                    </span>
                  )}
                </div>
                <h3>{a.title}</h3>
                <p className="pre">{a.body}</p>
                <small className="muted">Audience: {a.audience.includes('all') ? 'Everyone' : audienceLabel(a.audience)}</small>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
