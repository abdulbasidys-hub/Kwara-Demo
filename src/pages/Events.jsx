import { useState } from 'react';
import { CalendarPlus, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../data/roles';
import { Badge, Card, Field, Modal, PageHeader, Tabs } from '../components/ui';
import { fmtDate } from '../utils';

const TODAY = new Date().toISOString().slice(0, 10);
const blank = { title: '', type: 'Meeting', date: TODAY, time: '16:00', venue: '', description: '' };
const pad = (n) => String(n).padStart(2, '0');

export default function Events() {
  const { state, user, addEvent, toggleAttendance } = useApp();
  const manage = can(user, 'events.manage');
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [tab, setTab] = useState('upcoming');
  const [form, setForm] = useState(null);
  const [selId, setSelId] = useState(null);
  const sel = state.events.find((e) => e.id === selId);

  const first = new Date(month.y, month.m, 1);
  const daysInMonth = new Date(month.y, month.m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const cells = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const eventsOn = (d) => state.events.filter((e) => e.date === `${month.y}-${pad(month.m + 1)}-${pad(d)}`);
  const shift = (n) => setMonth(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }));

  const list = state.events
    .filter((e) => (tab === 'upcoming' ? e.date >= TODAY : e.date < TODAY))
    .sort((a, b) => (tab === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));

  return (
    <>
      <PageHeader
        eyebrow="Events and meetings calendar"
        title="Events & Meetings"
        subtitle="Plan programmes and meetings, and keep attendance records."
        actions={
          manage && (
            <button className="btn btn-primary" onClick={() => setForm(blank)}>
              <CalendarPlus size={16} /> Schedule
            </button>
          )
        }
      />

      <div className="grid-sidebar reverse">
        <Card
          title={first.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
          actions={
            <div className="row-actions">
              <button className="icon-btn" onClick={() => shift(-1)} aria-label="Previous month">
                <ChevronLeft size={18} />
              </button>
              <button className="icon-btn" onClick={() => shift(1)} aria-label="Next month">
                <ChevronRight size={18} />
              </button>
            </div>
          }
        >
          <div className="calendar">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="cal-head">
                {d}
              </div>
            ))}
            {cells.map((d, i) => {
              const iso = d && `${month.y}-${pad(month.m + 1)}-${pad(d)}`;
              return (
                <div key={i} className={`cal-cell ${!d ? 'empty' : ''} ${iso === TODAY ? 'today' : ''}`}>
                  {d && <span className="cal-day">{d}</span>}
                  {d &&
                    eventsOn(d).map((e) => (
                      <button key={e.id} className={`cal-event ${e.type === 'Meeting' ? 'meeting' : ''}`} onClick={() => setSelId(e.id)} title={e.title}>
                        {e.title}
                      </button>
                    ))}
                </div>
              );
            })}
          </div>
        </Card>

        <Card pad={false}>
          <div className="toolbar">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'past', label: 'Past' },
              ]}
            />
          </div>
          <ul className="list">
            {list.map((e) => (
              <li key={e.id}>
                <button className="list-row" onClick={() => setSelId(e.id)}>
                  <div className="date-chip">
                    <span>{new Date(e.date).toLocaleDateString('en-NG', { month: 'short' })}</span>
                    <strong>{new Date(e.date).getDate()}</strong>
                  </div>
                  <div className="grow">
                    <strong>{e.title}</strong>
                    <small className="muted">
                      {e.time} · {e.venue}
                    </small>
                  </div>
                  <small className="muted nowrap">
                    <Users size={12} /> {e.attendance.length}
                  </small>
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="card-body muted">Nothing here.</li>}
          </ul>
        </Card>
      </div>

      {sel && (
        <Modal title={sel.title} onClose={() => setSelId(null)} wide>
          <div className="event-meta">
            <Badge tone={sel.type === 'Meeting' ? 'blue' : 'green'}>{sel.type}</Badge>
            <span>
              <Clock size={14} /> {fmtDate(sel.date)}, {sel.time}
            </span>
            <span>
              <MapPin size={14} /> {sel.venue}
            </span>
          </div>
          <p>{sel.description}</p>
          <h4>
            Attendance: {sel.attendance.length} of {state.members.length} members
          </h4>
          {!manage && <p className="muted small">Only executives who schedule events can mark attendance.</p>}
          <div className="attendance">
            {state.members.map((m) => (
              <label key={m.id} className={`check att ${sel.attendance.includes(m.id) ? 'on' : ''}`}>
                <input type="checkbox" disabled={!manage} checked={sel.attendance.includes(m.id)} onChange={() => toggleAttendance(sel.id, m.id)} />
                <span>
                  {m.name}
                  <small className="muted"> · {m.level}L</small>
                </span>
              </label>
            ))}
          </div>
        </Modal>
      )}

      {form && (
        <Modal
          title="Schedule event or meeting"
          onClose={() => setForm(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setForm(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" form="add-event">
                Schedule
              </button>
            </>
          }
        >
          <form
            id="add-event"
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              addEvent(form);
              setForm(null);
            }}
          >
            <Field label="Title">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Type">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Meeting</option>
                <option>Event</option>
              </select>
            </Field>
            <Field label="Date">
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Time">
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </Field>
            <Field label="Venue">
              <input required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
            </Field>
            <Field label="Description">
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
          </form>
        </Modal>
      )}
    </>
  );
}
