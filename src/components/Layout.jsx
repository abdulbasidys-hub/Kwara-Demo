import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeftRight, GraduationCap, Menu, X } from 'lucide-react';
import { noticesFor, useApp } from '../context/AppContext';
import { NAV } from '../data/nav';
import { can, ROLES } from '../data/roles';
import { Avatar } from './ui';

// Copies each table's column headings onto its cells so rows can be shown as cards on phones
function labelTables(root) {
  root.querySelectorAll('table.table').forEach((table) => {
    const heads = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach((tr) =>
      [...tr.children].forEach((td, i) => {
        if (heads[i] && td.getAttribute('data-label') !== heads[i]) td.setAttribute('data-label', heads[i]);
      }),
    );
  });
}

export default function Layout() {
  const { user, state } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    labelTables(el);
    const observer = new MutationObserver(() => labelTables(el));
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const badges = {
    notices: noticesFor(state.notices, user).filter((n) => user.role !== 'admin' && !n.readBy.includes(user.id)).length,
    reports:
      user.role === 'admin'
        ? state.reports.filter((r) => r.status === 'Under Review').length
        : user.role === 'president'
          ? state.reports.filter((r) => r.status === 'Submitted' && r.authorId !== user.id).length
          : state.reports.filter((r) => r.authorId === user.id && r.status === 'Returned').length,
  };

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <GraduationCap size={20} />
            </span>
            <span>
              <strong>KWASU</strong>
              <small>Association Platform</small>
            </span>
          </Link>
          <button className="icon-btn sidebar-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <div className="session-pill">Session {state.currentSession}</div>
        <nav>
          {NAV.map((group) => {
            const items = group.items.filter((i) => can(user, i.perm));
            if (!items.length) return null;
            return (
              <div key={group.label} className="nav-group">
                <div className="nav-label">{group.label}</div>
                {items.map((i) => (
                  <NavLink key={i.to} to={i.to} className="nav-item">
                    <i.icon size={18} />
                    <span>{i.label}</span>
                    {i.badge && badges[i.badge] > 0 && <span className="nav-badge">{badges[i.badge]}</span>}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>
        <Link to="/" className="nav-item nav-home">
          <ArrowLeftRight size={18} />
          <span>Switch view</span>
        </Link>
      </aside>
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="topbar-title">
            <strong>{ROLES[user.role].label}</strong>
            <small>Session {state.currentSession}</small>
          </div>
          <div className="topbar-right">
            <div className="user-chip">
              <Avatar user={user} size={34} />
              <div className="user-meta">
                <strong>{user.name}</strong>
                <small>{user.office}</small>
              </div>
            </div>
            <Link to="/" className="btn btn-ghost btn-sm switch-btn">
              <ArrowLeftRight size={14} /> <span>Switch view</span>
            </Link>
          </div>
        </header>
        <main className="content" ref={contentRef}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
