import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Handover from './pages/Handover';
import Notices from './pages/Notices';
import Announcements from './pages/Announcements';
import Reports from './pages/Reports';
import ReportForm from './pages/ReportForm';
import ReportDetail from './pages/ReportDetail';
import Members from './pages/Members';
import Events from './pages/Events';
import Finance from './pages/Finance';
import Tasks from './pages/Tasks';
import Documents from './pages/Documents';
import AuditLog from './pages/AuditLog';

function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tone}`}>
          {t.tone === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function NotFound() {
  return (
    <div className="restricted">
      <h2>Page not found</h2>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="handover" element={<Handover />} />
          <Route path="notices" element={<Notices />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/new" element={<ReportForm />} />
          <Route path="reports/:id" element={<ReportDetail />} />
          <Route path="reports/:id/edit" element={<ReportForm />} />
          <Route path="members" element={<Members />} />
          <Route path="events" element={<Events />} />
          <Route path="finance" element={<Finance />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="documents" element={<Documents />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toasts />
    </>
  );
}
