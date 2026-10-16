import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLES } from '../data/roles';
import { Avatar, Card, Guard, PageHeader } from '../components/ui';
import { exportCSV, fmtDateTime } from '../utils';

export default function AuditLog() {
  return (
    <Guard perm="audit.view" title="Audit Log">
      <AuditInner />
    </Guard>
  );
}

function AuditInner() {
  const { state, userById } = useApp();
  const [q, setQ] = useState('');
  const [who, setWho] = useState('');
  const [hideViews, setHideViews] = useState(true);

  const rows = state.audit
    .filter((a) => !hideViews || !['Signed in', 'Signed out'].includes(a.action))
    .filter((a) => !who || a.userId === who)
    .filter((a) => `${a.action} ${a.target} ${userById(a.userId)?.name}`.toLowerCase().includes(q.toLowerCase()));

  const actors = [...new Set(state.audit.map((a) => a.userId))].map(userById).filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow="Oversight and accountability"
        title="Audit Log"
        subtitle="A complete record of who did what and when. Entries cannot be edited or deleted."
        actions={
          <button
            className="btn btn-ghost"
            onClick={() =>
              exportCSV(
                'audit-log.csv',
                rows.map((a) => {
                  const u = userById(a.userId);
                  return { Date: a.date, User: u?.name, Office: u?.office, Action: a.action, Details: a.target };
                }),
              )
            }
          >
            <Download size={16} /> Export CSV
          </button>
        }
      />
      <Card pad={false}>
        <div className="toolbar">
          <div className="search grow">
            <Search size={16} />
            <input placeholder="Search actions" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="toolbar-right">
            <select value={who} onChange={(e) => setWho(e.target.value)} aria-label="User">
              <option value="">All users</option>
              {actors.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <label className="check">
              <input type="checkbox" checked={hideViews} onChange={(e) => setHideViews(e.target.checked)} /> Hide sign-ins
            </label>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const u = userById(a.userId);
                return (
                  <tr key={a.id}>
                    <td className="nowrap mono small">{fmtDateTime(a.date)}</td>
                    <td>
                      <div className="cell-user">
                        <Avatar user={u} size={28} />
                        <div>
                          <strong>{u?.name}</strong>
                          <small className="muted">{u ? ROLES[u.role].short : ''}</small>
                        </div>
                      </div>
                    </td>
                    <td>{a.action}</td>
                    <td className="muted">{a.target}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
