import { useEffect } from 'react';
import { X } from 'lucide-react';
import { ROLES } from '../data/roles';
import { initials } from '../utils';

export function PageHeader({ title, subtitle, actions, eyebrow }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

const STATUS_TONES = {
  Draft: 'gray',
  Submitted: 'blue',
  'Under Review': 'amber',
  Approved: 'green',
  Returned: 'red',
  active: 'green',
  invited: 'amber',
  deactivated: 'gray',
  Active: 'green',
  Inactive: 'gray',
  'To do': 'gray',
  'In progress': 'blue',
  Done: 'green',
  income: 'green',
  expense: 'red',
};

export function Badge({ children, tone }) {
  return <span className={`badge badge-${tone || STATUS_TONES[children] || 'gray'}`}>{children}</span>;
}

export function RoleBadge({ role }) {
  const r = ROLES[role];
  return (
    <span className="role-badge" style={{ '--role': r.color }}>
      {r.short}
    </span>
  );
}

export function Avatar({ user, size = 36 }) {
  const color = ROLES[user?.role]?.color || '#64748b';
  return (
    <span className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {initials(user?.name)}
    </span>
  );
}

export function Stat({ label, value, hint, icon: Icon, tone = 'green' }) {
  return (
    <div className={`stat stat-${tone}`}>
      {Icon && (
        <div className="stat-icon">
          <Icon size={20} />
        </div>
      )}
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {hint && <div className="stat-hint">{hint}</div>}
      </div>
    </div>
  );
}

export function Card({ title, actions, children, className = '', pad = true }) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <div className="card-head">
          {title && <h3>{title}</h3>}
          {actions}
        </div>
      )}
      <div className={pad ? 'card-body' : ''}>{children}</div>
    </section>
  );
}

export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function Empty({ icon: Icon, title, children }) {
  return (
    <div className="empty">
      {Icon && <Icon size={28} />}
      <strong>{title}</strong>
      {children && <p className="muted">{children}</p>}
    </div>
  );
}

export function Guard({ children }) {
  return children;
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => {
        const key = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        return (
          <button key={key} role="tab" aria-selected={value === key} className={`tab ${value === key ? 'active' : ''}`} onClick={() => onChange(key)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
