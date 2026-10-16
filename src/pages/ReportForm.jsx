import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Paperclip, Save, Send, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REPORT_TEMPLATES, REPORT_TYPES } from '../data/mockData';
import { Card, Field, Guard, PageHeader } from '../components/ui';
import { fmtSize, readFile } from '../utils';

export default function ReportForm() {
  return (
    <Guard perm="reports.create" title="Submit a Report">
      <ReportFormInner />
    </Guard>
  );
}

function ReportFormInner() {
  const { id } = useParams();
  const { state, user, saveReport, toast } = useApp();
  const navigate = useNavigate();
  const existing = id ? state.reports.find((r) => r.id === id) : null;
  const fileRef = useRef(null);
  const [form, setForm] = useState(
    existing
      ? { id: existing.id, title: existing.title, type: existing.type, period: existing.period, summary: existing.summary, attachments: existing.attachments }
      : { title: '', type: 'Activity', period: '', summary: REPORT_TEMPLATES.Activity, attachments: [] },
  );
  const [dragOver, setDragOver] = useState(false);

  if (existing && (existing.authorId !== user.id || !['Draft', 'Returned'].includes(existing.status))) {
    return (
      <div className="restricted">
        <h2>This report can’t be edited</h2>
        <p className="muted">Only the author can edit a report, and only while it is a draft or has been returned for correction.</p>
        <Link to={`/app/reports/${id}`} className="btn btn-ghost">
          Back to report
        </Link>
      </div>
    );
  }

  const changeType = (type) => {
    const untouched = Object.values(REPORT_TEMPLATES).includes(form.summary) || !form.summary.trim();
    setForm({ ...form, type, summary: untouched ? REPORT_TEMPLATES[type] : form.summary });
  };

  const addFiles = async (files) => {
    for (const file of files) {
      try {
        const att = await readFile(file);
        setForm((f) => ({ ...f, attachments: [...f.attachments, att] }));
      } catch (err) {
        toast(err.message, 'error');
      }
    }
  };

  const save = (submit) => {
    if (!form.title.trim()) return alert('Please give the report a title.');
    const rid = saveReport(form, submit);
    navigate(`/app/reports/${rid}`);
  };

  const returned = existing?.status === 'Returned' ? [...existing.history].reverse().find((h) => h.comment) : null;

  return (
    <>
      <Link to={existing ? `/app/reports/${existing.id}` : '/app/reports'} className="back-link">
        <ArrowLeft size={16} /> Back
      </Link>
      <PageHeader eyebrow="Standard report templates" title={existing ? 'Edit report' : 'New report'} subtitle={`${user.office} · ${state.currentSession} session`} />

      {returned && (
        <div className="alert alert-warn">
          <AlertTriangle size={18} />
          <span>
            <strong>Returned with comments:</strong> “{returned.comment}”
          </span>
        </div>
      )}

      <div className="grid-sidebar reverse">
        <Card title="Report details">
          <div className="stack">
            <div className="form-grid">
              <Field label="Title">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. October 2026 Activity Report" />
              </Field>
              <Field label="Report type">
                <select value={form.type} onChange={(e) => changeType(e.target.value)}>
                  {REPORT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t === 'Handover' ? 'End-of-tenure handover' : t} report
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Period / date covered">
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="e.g. October 2026" />
              </Field>
            </div>
            <Field label="Report content" hint="Pre-filled with the standard template for this report type">
              <textarea rows={16} className="mono" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </Field>
          </div>
        </Card>

        <div className="stack">
          <Card title="Supporting documents">
            <div
              className={`dropzone ${dragOver ? 'over' : ''}`}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
            >
              <Upload size={22} />
              <strong>Drop files or click to upload</strong>
              <small className="muted">PDF, images or spreadsheets, up to 2 MB each</small>
              <input ref={fileRef} type="file" multiple hidden accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.doc,.docx" onChange={(e) => addFiles(e.target.files)} />
            </div>
            <ul className="files">
              {form.attachments.map((a, i) => (
                <li key={a.name + i}>
                  <Paperclip size={14} />
                  <span className="grow">{a.name}</span>
                  <small className="muted">{fmtSize(a.size)}</small>
                  <button className="icon-btn sm" onClick={() => setForm({ ...form, attachments: form.attachments.filter((_, j) => j !== i) })} aria-label="Remove">
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Workflow">
            <ol className="mini-flow">
              <li className="on">Draft: only you can see it</li>
              <li>Submitted: President is alerted by email</li>
              <li>Under Review: forwarded to the University</li>
              <li>Approved / Returned with comments</li>
            </ol>
            <div className="stack-sm">
              <button className="btn btn-ghost btn-block" onClick={() => save(false)}>
                <Save size={16} /> Save draft
              </button>
              <button className="btn btn-primary btn-block" onClick={() => save(true)}>
                <Send size={16} /> {existing?.status === 'Returned' ? 'Resubmit' : 'Submit for review'}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
