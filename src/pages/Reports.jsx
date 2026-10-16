import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FilePlus, FileText, Paperclip, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REPORT_STATUSES, REPORT_TYPES } from '../data/mockData';
import { can } from '../data/roles';
import { Badge, Card, Empty, Guard, PageHeader, Tabs } from '../components/ui';
import { fmtDate } from '../utils';

export function visibleReports(reports, user) {
  if (can(user, 'reports.viewAll')) return reports.filter((r) => r.status !== 'Draft' || r.authorId === user.id);
  return reports.filter((r) => r.authorId === user.id);
}

export function Pipeline({ counts, active }) {
  const steps = ['Draft', 'Submitted', 'Under Review'];
  return (
    <div className="pipeline">
      {steps.map((s) => (
        <div key={s} className={`pipe-step ${active === s ? 'active' : ''}`}>
          <span>{s}</span>
          {counts && <strong>{counts[s] || 0}</strong>}
        </div>
      ))}
      <div className="pipe-split">
        {['Approved', 'Returned'].map((s) => (
          <div key={s} className={`pipe-step pipe-${s.toLowerCase()} ${active === s ? 'active' : ''}`}>
            <span>{s === 'Returned' ? 'Returned with comments' : s}</span>
            {counts && <strong>{counts[s] || 0}</strong>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reports() {
  return (
    <Guard perm="reports.view" title="Reports">
      <ReportsInner />
    </Guard>
  );
}

function ReportsInner() {
  const { state, user, userById } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');
  const [type, setType] = useState('');
  const [q, setQ] = useState('');
  const mine = visibleReports(state.reports, user);
  const counts = Object.fromEntries(REPORT_STATUSES.map((s) => [s, mine.filter((r) => r.status === s).length]));
  const rows = mine
    .filter((r) => tab === 'All' || r.status === tab)
    .filter((r) => !type || r.type === type)
    .filter((r) => r.title.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

  return (
    <>
      <PageHeader
        eyebrow="Report submission and approval"
        title="Reports"
        subtitle={can(user, 'reports.viewAll') ? 'All Association reports across sessions, with their approval status.' : 'Reports you have prepared for your office.'}
        actions={
          can(user, 'reports.create') && (
            <Link to="/app/reports/new" className="btn btn-primary">
              <FilePlus size={16} /> New report
            </Link>
          )
        }
      />

      <Pipeline counts={counts} />

      <Card pad={false}>
        <div className="toolbar">
          <Tabs value={tab} onChange={setTab} tabs={['All', ...REPORT_STATUSES].map((s) => ({ value: s, label: s === 'All' ? `All (${mine.length})` : `${s} (${counts[s]})` }))} />
          <div className="toolbar-right">
            <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
              <option value="">All types</option>
              {REPORT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <div className="search">
              <Search size={16} />
              <input placeholder="Search reports" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
        </div>
        {rows.length === 0 ? (
          <Empty icon={FileText} title="No reports here" />
        ) : (
          <div className="table-wrap">
            <table className="table clickable">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Type</th>
                  <th>Prepared by</th>
                  <th>Session</th>
                  <th>Updated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} onClick={() => navigate(`/app/reports/${r.id}`)}>
                    <td>
                      <strong>{r.title}</strong>
                      <small className="muted block">
                        {r.period}
                        {r.attachments.length > 0 && (
                          <>
                            {' '}
                            · <Paperclip size={11} /> {r.attachments.length}
                          </>
                        )}
                      </small>
                    </td>
                    <td>{r.type}</td>
                    <td>{userById(r.authorId)?.office}</td>
                    <td>{r.session}</td>
                    <td className="nowrap">{fmtDate(r.updatedAt)}</td>
                    <td>
                      <Badge>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
