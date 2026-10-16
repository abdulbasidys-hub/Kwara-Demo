import { useState } from 'react';
import { Info, MailPlus, Search, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLES } from '../data/roles';
import { Avatar, Badge, Card, Field, Guard, Modal, PageHeader, RoleBadge, Tabs } from '../components/ui';
import { fmtDate } from '../utils';

const ASSIGNABLE = ['president', 'secretary', 'finsec', 'pro', 'executive', 'member'];
const blank = { name: '', email: '', phone: '', role: 'executive', office: '' };

export default function Accounts() {
  return (
    <Guard perm="accounts.manage" title="Accounts & Roles">
      <AccountsInner />
    </Guard>
  );
}

function AccountsInner() {
  const { state, createAccount, changeRole, setUserStatus, resendInvite } = useApp();
  const [tab, setTab] = useState('current');
  const [q, setQ] = useState('');
  const [form, setForm] = useState(null);
  const [roleEdit, setRoleEdit] = useState(null);

  const sessions = [...new Set(state.users.map((u) => u.session).filter(Boolean))].sort().reverse();
  const rows = state.users
    .filter((u) => u.role !== 'admin')
    .filter((u) => (tab === 'current' ? u.session === state.currentSession : tab === 'all' ? true : u.session === tab))
    .filter((u) => `${u.name} ${u.email} ${u.office}`.toLowerCase().includes(q.toLowerCase()));

  const save = (e) => {
    e.preventDefault();
    if (state.users.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) return alert('An account with this email already exists.');
    createAccount({ ...form, office: form.office || ROLES[form.role].label });
    setForm(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="Account and role management"
        title="Accounts & Roles"
        subtitle="Only the University administrator can create accounts and assign offices. There is no self-registration."
        actions={
          <button className="btn btn-primary" onClick={() => setForm(blank)}>
            <UserPlus size={16} /> Create account
          </button>
        }
      />

      <div className="alert alert-info">
        <Info size={18} />
        <span>
          New accounts are linked to the <strong>{state.currentSession}</strong> session. The executive receives a welcome email.
        </span>
      </div>

      <Card pad={false}>
        <div className="toolbar">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[{ value: 'current', label: `Current (${state.currentSession})` }, ...sessions.filter((s) => s !== state.currentSession).map((s) => ({ value: s, label: s })), { value: 'all', label: 'All tenures' }]}
          />
          <div className="search">
            <Search size={16} />
            <input placeholder="Search name, email, office" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Executive</th>
                <th>Office / Role</th>
                <th>Session</th>
                <th>Status</th>
                <th>Created</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="cell-user">
                      <Avatar user={u} size={32} />
                      <div>
                        <strong>{u.name}</strong>
                        <small className="muted">{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="stack-sm">
                      <span>{u.office}</span>
                      <RoleBadge role={u.role} />
                    </div>
                  </td>
                  <td>{u.session}</td>
                  <td>
                    <Badge>{u.status}</Badge>
                  </td>
                  <td className="nowrap">{fmtDate(u.createdAt)}</td>
                  <td className="right">
                    <div className="row-actions">
                      {u.status === 'invited' && (
                        <button className="btn btn-sm btn-ghost" onClick={() => resendInvite(u.id)}>
                          <MailPlus size={14} /> Resend
                        </button>
                      )}
                      {u.status !== 'deactivated' && (
                        <button className="btn btn-sm btn-ghost" onClick={() => setRoleEdit({ id: u.id, role: u.role, office: u.office, name: u.name })}>
                          Change role
                        </button>
                      )}
                      {u.status === 'deactivated' ? (
                        <button className="btn btn-sm btn-ghost" onClick={() => setUserStatus(u.id, 'active')}>
                          Reactivate
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-danger-ghost" onClick={() => confirm(`Deactivate ${u.name}? They will no longer be able to sign in.`) && setUserStatus(u.id, 'deactivated')}>
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="center muted">
                    No accounts match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {form && (
        <Modal
          title="Create executive account"
          onClose={() => setForm(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setForm(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" form="create-account">
                Create & send invitation
              </button>
            </>
          }
        >
          <form id="create-account" className="form-grid" onSubmit={save}>
            <Field label="Full name">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Halima Sani" />
            </Field>
            <Field label="Email address" hint="A welcome email is sent to this address">
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="office@assoc.kwasu.edu.ng" />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="080..." />
            </Field>
            <Field label="Permission role">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ASSIGNABLE.map((r) => (
                  <option key={r} value={r}>
                    {ROLES[r].label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Office title" hint="As named in the constitution, e.g. Welfare Director">
              <input value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} placeholder={ROLES[form.role].label} />
            </Field>
            <Field label="Tenure">
              <input value={state.currentSession} disabled />
            </Field>
            <p className="field-note full">{ROLES[form.role].duties}</p>
          </form>
        </Modal>
      )}

      {roleEdit && (
        <Modal
          title={`Change role: ${roleEdit.name}`}
          onClose={() => setRoleEdit(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setRoleEdit(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  changeRole(roleEdit.id, roleEdit.role, roleEdit.office || ROLES[roleEdit.role].label);
                  setRoleEdit(null);
                }}
              >
                Save role
              </button>
            </>
          }
        >
          <div className="form-grid">
            <Field label="Permission role">
              <select value={roleEdit.role} onChange={(e) => setRoleEdit({ ...roleEdit, role: e.target.value })}>
                {ASSIGNABLE.map((r) => (
                  <option key={r} value={r}>
                    {ROLES[r].label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Office title">
              <input value={roleEdit.office} onChange={(e) => setRoleEdit({ ...roleEdit, office: e.target.value })} />
            </Field>
            <p className="field-note full">{ROLES[roleEdit.role].duties}</p>
          </div>
        </Modal>
      )}
    </>
  );
}
