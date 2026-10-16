import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeftRight, GraduationCap, Menu, X } from 'lucide-react';
import { noticesFor, useApp } from '../context/AppContext';
import { NAV } from '../data/nav';
import { can, ROLES } from '../data/roles';
import { Avatar } from './ui';

export default function Layout() {
  const { user, state } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
