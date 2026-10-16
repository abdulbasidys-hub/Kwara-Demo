import { useRef, useState } from 'react';
import { Download, FileSpreadsheet, FileText, Image, Search, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../data/roles';
import { Card, Field, Modal, PageHeader, Tabs } from '../components/ui';
import { downloadFile, fmtDate, fmtSize, readFile } from '../utils';

const CATS = ['Constitution', 'Policy', 'Minutes', 'Past Records', 'Other'];
const iconFor = (name) => (/\.(png|jpe?g)$/i.test(name) ? Image : /\.(xlsx?|csv)$/i.test(name) ? FileSpreadsheet : FileText);

export default function Documents() {
  const { state, user, userById, addDocument, toast } = useApp();
  const upload = can(user, 'documents.upload');
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [form, setForm] = useState(null);
  const fileRef = useRef(null);

  const docs = state.documents.filter((d) => (cat === 'All' || d.category === cat) && d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        eyebrow="Document library"
        title="Document Library"
        subtitle="The constitution, policies and records from every tenure, kept permanently for future councils."
        actions={
          upload && (
            <button className="btn btn-primary" onClick={() => setForm({ name: '', size: 0, category: 'Minutes', session: state.currentSession })}>
              <Upload size={16} /> Upload
            </button>
          )
        }
      />
      <Card pad={false}>
        <div className="toolbar">
          <Tabs value={cat} onChange={setCat} tabs={['All', ...CATS.slice(0, 4)]} />
          <div className="search">
            <Search size={16} />
            <input placeholder="Search documents" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="doc-grid">
          {docs.map((d) => {
            const Icon = iconFor(d.name);
            return (
              <div key={d.id} className="doc">
                <div className="doc-icon">
                  <Icon size={22} />
                </div>
                <div className="grow">
                  <strong>{d.name}</strong>
                  <small className="muted block">
                    {d.category} · {d.session} · {fmtSize(d.size)}
                  </small>
                  <small className="muted">
                    {userById(d.uploadedBy)?.office} · {fmtDate(d.date)}
                  </small>
                </div>
                {d.dataUrl && (
                  <button className="icon-btn" onClick={() => downloadFile(d)} aria-label="Download">
                    <Download size={16} />
                  </button>
                )}
              </div>
            );
          })}
          {docs.length === 0 && <p className="muted card-body">No documents found.</p>}
        </div>
      </Card>

      {form && (
        <Modal
          title="Upload document"
          onClose={() => setForm(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setForm(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={!form.name}
                onClick={() => {
                  addDocument(form);
                  setForm(null);
                }}
              >
                Upload
              </button>
            </>
          }
        >
          <div className="stack">
            <div className="dropzone" onClick={() => fileRef.current.click()}>
              <Upload size={22} />
              <strong>{form.name || 'Choose a file'}</strong>
              <small className="muted">{form.size ? fmtSize(form.size) : 'PDF, Word, Excel or images, up to 2 MB'}</small>
              <input
                ref={fileRef}
                type="file"
                hidden
                onChange={async (e) => {
                  const f = e.target.files[0];
                  if (!f) return;
                  try {
                    setForm({ ...form, ...(await readFile(f)) });
                  } catch (err) {
                    toast(err.message, 'error');
                  }
                }}
              />
            </div>
            <div className="form-grid">
              <Field label="Category">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Session">
                <input value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })} />
              </Field>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
