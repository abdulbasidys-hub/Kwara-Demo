import { useState } from 'react';
import { Download, Search, Sparkles, UserCheck, UserPlus, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../data/roles';
import { Badge, Card, Field, Guard, Modal, PageHeader, Stat } from '../components/ui';
import { exportCSV, fmtDate } from '../utils';

const LEVELS = ['100', '200', '300', '400', '500'];
const blank = { name: '', matric: '', dept: '', level: '100', phone: '', email: '' };

export default function Members() {
  return (
    <Guard perm="members.view" title="Member Register">
      <MembersInner />
    </Guard>
  );
}

function MembersInner() {
  const { state, user, addMember, toggleMemberStatus } = useApp();
  const manage = can(user, 'members.manage');
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState(null);

  const rows = state.members
    .filter((m) => `${m.name} ${m.matric} ${m.dept} ${m.email}`.toLowerCase().includes(q.toLowerCase()))
    .filter((m) => !level || m.level === level)
    .filter((m) => !status || m.status === status);

  const thisMonth = new Date().toISOString().slice(0, 7);

  return (
    <>
      <PageHeader
        eyebrow="Association administration"
        title="Member Register"
        subtitle={manage ? 'Search, add and export the register of members.' : 'View-only access for your role. The General Secretary maintains the register.'}
        actions={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => exportCSV('member-register.csv', rows.map((m) => ({ Name: m.name, Matric: m.matric, Department: m.dept, Level: m.level, Phone: m.phone, Email: m.email, Status: m.status, Joined: m.joined })))}
            >
              <Download size={16} /> Export CSV
            </button>
            {manage && (
              <button className="btn btn-primary" onClick={() => setForm(blank)}>
                <UserPlus size={16} /> Add member
              </button>
            )}
          </>
        }
      />

      <div className="stats">
        <Stat icon={Users} label="Registered members" value={state.members.length} />
        <Stat icon={UserCheck} tone="blue" label="Active" value={state.members.filter((m) => m.status === 'Active').length} />
        <Stat icon={Sparkles} tone="gold" label="Joined this month" value={state.members.filter((m) => m.joined.startsWith(thisMonth)).length} />
      </div>

      <Card pad={false}>
        <div className="toolbar">
          <div className="search grow">
            <Search size={16} />
            <input placeholder="Search name, matric number, department" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="toolbar-right">
            <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Level">
              <option value="">All levels</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l} level
                </option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
              <option value="">Any status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Matric no.</th>
                <th>Department</th>
                <th>Level</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td>
                    <strong>{m.name}</strong>
                  </td>
                  <td className="mono nowrap">{m.matric}</td>
                  <td>{m.dept}</td>
                  <td>{m.level}</td>
                  <td>
                    <small className="block">{m.phone}</small>
                    <small className="muted">{m.email}</small>
                  </td>
                  <td className="nowrap">{fmtDate(m.joined)}</td>
                  <td>
                    {manage ? (
                      <button className="badge-btn" onClick={() => toggleMemberStatus(m.id)} title="Click to toggle">
                        <Badge>{m.status}</Badge>
                      </button>
                    ) : (
                      <Badge>{m.status}</Badge>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="center muted">
                    No members match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {form && (
        <Modal
          title="Add member"
          onClose={() => setForm(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setForm(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" form="add-member">
                Add to register
              </button>
            </>
          }
        >
          <form
            id="add-member"
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              addMember(form);
              setForm(null);
            }}
          >
            <Field label="Full name">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Matric number">
              <input required value={form.matric} onChange={(e) => setForm({ ...form, matric: e.target.value })} placeholder="25/47CS/00123" />
            </Field>
            <Field label="Department">
              <input required value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
            </Field>
            <Field label="Level">
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
          </form>
        </Modal>
      )}
    </>
  );
}
