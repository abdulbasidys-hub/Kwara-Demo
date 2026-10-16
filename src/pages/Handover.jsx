import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Archive, ArrowRight, CheckCircle2, Circle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar, Badge, Card, Field, Guard, PageHeader, RoleBadge } from '../components/ui';

const nextSession = (s) => {
  const [a, b] = s.split('/').map(Number);
  return `${a + 1}/${b + 1}`;
};

export default function Handover() {
  return (
    <Guard perm="handover.manage" title="Tenure Handover">
      <HandoverInner />
    </Guard>
  );
}

function HandoverInner() {
  const { state, startNewTenure } = useApp();
  const S = state.currentSession;
  const [newSession, setNewSession] = useState(nextSession(S));
  const [justClosed, setJustClosed] = useState(null);

  const outgoing = state.users.filter((u) => u.role !== 'admin' && u.session === S && u.status !== 'deactivated');
  const handoverReport = state.reports.find((r) => r.session === S && r.type === 'Handover');
  const financialApproved = state.reports.some((r) => r.session === S && r.type === 'Financial' && r.status === 'Approved');
  const sessions = [...new Set(state.users.map((u) => u.session).filter(Boolean))].sort().reverse();

  const checks = [
    ['End-of-tenure handover report submitted', !!handoverReport && handoverReport.status !== 'Draft'],
    ['Handover report approved by the University', handoverReport?.status === 'Approved'],
    ['Final financial report approved', financialApproved],
    ['All documents uploaded to the library', state.documents.some((d) => d.session === S)],
  ];

  const close = () => {
    if (!confirm(`Close the ${S} tenure? ${outgoing.length} outgoing accounts will be deactivated. All records remain in the system.`)) return;
    setJustClosed({ from: S, to: newSession, count: outgoing.length });
    startNewTenure(newSession);
    setNewSession(nextSession(newSession));
  };

  const preserved = [
    ['Reports', state.reports.length],
    ['Documents', state.documents.length],
    ['Members', state.members.length],
    ['Transactions', state.transactions.length],
    ['Events', state.events.length],
    ['Audit entries', state.audit.length],
  ];

  return (
    <>
      <PageHeader
        eyebrow="University"
        title="Tenure Handover"
        subtitle="Deactivate outgoing executives in one click. Every record stays with the Association for the incoming council."
      />

      {justClosed && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>
            Tenure <strong>{justClosed.from}</strong> closed and {justClosed.count} accounts deactivated. The platform is now on <strong>{justClosed.to}</strong>.{' '}
            <Link to="/app/accounts">
              <strong>Create accounts for the incoming council →</strong>
            </Link>
          </span>
        </div>
      )}

      <div className="grid-2">
        <Card title={`Outgoing council · ${S}`} pad={false}>
          {outgoing.length === 0 ? (
            <div className="card-body muted">No active accounts in this session yet. Create the new council under Accounts & Roles.</div>
          ) : (
            <ul className="list">
              {outgoing.map((u) => (
                <li key={u.id} className="list-row">
                  <Avatar user={u} size={30} />
                  <div className="grow">
                    <strong>{u.name}</strong>
                    <small className="muted">{u.office}</small>
                  </div>
                  <RoleBadge role={u.role} />
                  <Badge>{u.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Handover checklist">
          <ul className="checklist">
            {checks.map(([label, ok]) => (
              <li key={label} className={ok ? 'ok' : ''}>
                {ok ? <CheckCircle2 size={18} /> : <Circle size={18} />} {label}
              </li>
            ))}
          </ul>
          {!checks.every((c) => c[1]) && (
            <div className="alert alert-warn small">
              <AlertTriangle size={16} /> Some items are outstanding. You can still close the tenure, but they will be flagged in the audit log.
            </div>
          )}
          <div className="form-row">
            <Field label="Incoming session">
              <input value={newSession} onChange={(e) => setNewSession(e.target.value)} />
            </Field>
            <button className="btn btn-danger" onClick={close} disabled={!newSession || newSession === S}>
              <RefreshCw size={16} /> Close tenure & hand over
            </button>
          </div>
        </Card>

        <Card title="Records preserved for the incoming council">
          <div className="preserved">
            {preserved.map(([label, n]) => (
              <div key={label}>
                <Archive size={16} />
                <strong>{n}</strong>
                <small className="muted">{label}</small>
              </div>
            ))}
          </div>
          <p className="muted small">Nothing is deleted at handover. Incoming executives inherit a complete, organised history.</p>
        </Card>

        <Card title="Tenure history" pad={false}>
          <ul className="list">
            {sessions.map((s) => {
              const members = state.users.filter((u) => u.session === s && u.role !== 'member');
              return (
                <li key={s} className="list-row">
                  <div className="grow">
                    <strong>{s}</strong>
                    <small className="muted">
                      {members.length} executive account(s) · {state.reports.filter((r) => r.session === s).length} reports
                    </small>
                  </div>
                  {s === state.currentSession ? <Badge tone="green">Current</Badge> : <Badge tone="gray">Closed</Badge>}
                </li>
              );
            })}
          </ul>
          <div className="card-body">
            <Link to="/app/accounts" className="link">
              View all accounts by tenure <ArrowRight size={14} />
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
