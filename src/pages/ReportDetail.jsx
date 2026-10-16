import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Download, Edit3, Forward, Paperclip, Printer, Send, Undo2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can, ROLES } from '../data/roles';
import { Avatar, Badge, Card, Field, Guard, PageHeader } from '../components/ui';
import { downloadFile, fmtDate, fmtDateTime, fmtSize } from '../utils';
import { Pipeline, visibleReports } from './Reports';

export default function ReportDetail() {
  return (
    <Guard perm="reports.view" title="Report">
      <ReportDetailInner />
    </Guard>
  );
}

function ReportDetailInner() {
  const { id } = useParams();
  const { state, user, userById, reviewReport, saveReport } = useApp();
  const [comment, setComment] = useState('');
  const r = state.reports.find((x) => x.id === id);

  if (!r || !visibleReports(state.reports, user).some((x) => x.id === id)) {
    return (
      <div className="restricted">
        <h2>Report not available</h2>
        <p className="muted">
          {r ? `This report belongs to another office. As ${ROLES[user.role].label} you can only see your own reports.` : 'This report does not exist.'}
        </p>
        <Link to="/app/reports" className="btn btn-ghost">
          Back to reports
        </Link>
      </div>
    );
  }

  const author = userById(r.authorId);
  const isAuthor = r.authorId === user.id;
  const canEndorse = can(user, 'reports.endorse') && r.status === 'Submitted' && !isAuthor;
  const canReview = can(user, 'reports.review') && ['Submitted', 'Under Review'].includes(r.status);
  const canEdit = isAuthor && ['Draft', 'Returned'].includes(r.status);

  const act = (action) => {
    if (action === 'return' && !comment.trim()) return alert('Please add a comment explaining what needs to be corrected.');
    reviewReport(r.id, action, comment.trim());
    setComment('');
  };

  return (
    <>
      <Link to="/app/reports" className="back-link no-print">
        <ArrowLeft size={16} /> All reports
      </Link>
      <PageHeader
        eyebrow={`${r.type} report · ${r.session}`}
        title={r.title}
        subtitle={`Period: ${r.period || '—'}`}
        actions={
          <>
            <Badge>{r.status}</Badge>
            <button className="btn btn-ghost no-print" onClick={() => window.print()}>
              <Printer size={16} /> Export PDF
            </button>
          </>
        }
      />

      <div className="no-print">
        <Pipeline active={r.status} />
      </div>

      <div className="grid-sidebar reverse">
        <div className="stack">
          <Card title="Report content">
            <div className="report-meta">
              <Avatar user={author} size={36} />
              <div>
                <strong>{author?.name}</strong>
                <small className="muted">
                  {author?.office} · last updated {fmtDateTime(r.updatedAt)}
                </small>
              </div>
            </div>
            <div className="report-body pre">{r.summary}</div>
          </Card>

          <Card title={`Supporting documents (${r.attachments.length})`}>
            {r.attachments.length === 0 ? (
              <p className="muted small">No attachments.</p>
            ) : (
              <ul className="files">
                {r.attachments.map((a, i) => (
                  <li key={a.name + i}>
                    <Paperclip size={14} />
                    <span className="grow">{a.name}</span>
                    <small className="muted">{fmtSize(a.size)}</small>
                    {a.dataUrl && (
                      <button className="icon-btn sm no-print" onClick={() => downloadFile(a)} aria-label="Download">
                        <Download size={14} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="stack">
          {(canEndorse || canReview || canEdit) && (
            <Card title="Actions" className="no-print actions-card">
              {canEdit && (
                <div className="stack-sm">
                  <p className="muted small">{r.status === 'Returned' ? 'Make the requested corrections, then resubmit.' : 'This is a draft. Only you can see it.'}</p>
                  <Link to={`/app/reports/${r.id}/edit`} className="btn btn-ghost btn-block">
                    <Edit3 size={16} /> Edit report
                  </Link>
                  <button className="btn btn-primary btn-block" onClick={() => saveReport(r, true)}>
                    <Send size={16} /> {r.status === 'Returned' ? 'Resubmit as is' : 'Submit for review'}
                  </button>
                </div>
              )}
              {(canEndorse || canReview) && (
                <div className="stack-sm">
                  <Field label="Comment for the author" hint={canReview ? 'Required when returning a report' : 'Optional'}>
                    <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="e.g. Please attach receipts for…" />
                  </Field>
                  {canEndorse && (
                    <button className="btn btn-primary btn-block" onClick={() => act('endorse')}>
                      <Forward size={16} /> Endorse & forward to University
                    </button>
                  )}
                  {canReview && r.status === 'Submitted' && (
                    <button className="btn btn-ghost btn-block" onClick={() => act('start')}>
                      Start review
                    </button>
                  )}
                  {canReview && (
                    <button className="btn btn-success btn-block" onClick={() => act('approve')}>
                      <Check size={16} /> Approve
                    </button>
                  )}
                  <button className="btn btn-danger-ghost btn-block" onClick={() => act('return')}>
                    <Undo2 size={16} /> Return with comments
                  </button>
                </div>
              )}
            </Card>
          )}

          <Card title="History">
            <ol className="timeline">
              {[...r.history].reverse().map((h, i) => {
                const by = userById(h.by);
                return (
                  <li key={i}>
                    <span className="tl-dot" />
                    <div>
                      <strong>{h.action}</strong>
                      <small className="muted">
                        {by?.name} ({by?.office}) · {fmtDate(h.date)}
                      </small>
                      {h.comment && <blockquote>“{h.comment}”</blockquote>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}
