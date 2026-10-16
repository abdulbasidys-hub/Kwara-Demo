import { Link } from 'react-router-dom';
import { ArrowRight, Bell, CalendarDays, FileClock, FileText, FolderOpen, ListChecks, Megaphone, Users, Wallet } from 'lucide-react';
import { announcementsFor, noticesFor, useApp } from '../context/AppContext';
import { can, ROLES } from '../data/roles';
import { Avatar, Badge, Card, Empty, PageHeader, RoleBadge, Stat } from '../components/ui';
import { fmtDate, fmtDateTime, fmtMoney } from '../utils';

const TODAY = new Date().toISOString().slice(0, 10);

export default function Dashboard() {
  const { state, user, userById } = useApp();
  const isAdmin = user.role === 'admin';
  const isMember = user.role === 'member';
  const S = state.currentSession;

  const council = state.users.filter((u) => u.session === S && u.role !== 'admin' && u.role !== 'member');
  const pending = state.reports.filter((r) => (isAdmin ? r.status === 'Under Review' || r.status === 'Submitted' : r.status === 'Submitted' && r.authorId !== user.id));
  const myReports = state.reports.filter((r) => r.authorId === user.id && r.status !== 'Approved');
  const notices = noticesFor(state.notices, user);
  const unread = notices.filter((n) => !n.readBy.includes(user.id));
  const myTasks = state.tasks.filter((t) => t.assigneeId === user.id && t.status !== 'Done');
  const upcoming = state.events.filter((e) => e.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date));
  const tx = state.transactions.filter((t) => t.session === S);
  const income = tx.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = tx.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const showFinance = can(user, 'finance.view');
  const announcements = announcementsFor(state.announcements, user).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        eyebrow={isAdmin ? 'University oversight' : isMember ? 'Member' : `${ROLES[user.role].label} dashboard`}
        title={`Welcome, ${user.name.split(' ')[isAdmin ? 1 : 0]}`}
        subtitle={isAdmin ? `Real-time view of the Association for the ${S} session.` : isMember ? `What’s happening in the Association this ${S} session.` : `Here’s what needs your attention this ${S} session.`}
      />

      <div className="stats">
        {isMember ? (
          <>
            <Stat icon={Megaphone} label="Announcements" value={announcements.length} hint={announcements[0] ? `Latest ${fmtDate(announcements[0].date)}` : '—'} />
            <Stat icon={CalendarDays} tone="blue" label="Upcoming events" value={upcoming.length} hint={upcoming[0] ? upcoming[0].title : '—'} />
            <Stat icon={FolderOpen} tone="gold" label="Documents" value={state.documents.length} hint="Constitution, policies & records" />
          </>
        ) : isAdmin ? (
          <>
            <Stat icon={Users} label="Active executives" value={council.filter((u) => u.status === 'active').length} hint={`${council.filter((u) => u.status === 'invited').length} invitation(s) pending`} />
            <Stat icon={FileClock} tone="amber" label="Reports awaiting action" value={pending.length} hint="Submitted or under review" />
            <Stat icon={FileText} tone="blue" label="Reports approved" value={state.reports.filter((r) => r.session === S && r.status === 'Approved').length} hint={`This session`} />
            <Stat icon={Wallet} tone="gold" label="Association balance" value={fmtMoney(income - expense)} hint={`${fmtMoney(income)} in · ${fmtMoney(expense)} out`} />
          </>
        ) : (
          <>
            <Stat icon={Bell} tone="amber" label="Unread notices" value={unread.length} hint={`${notices.length} total`} />
            <Stat icon={ListChecks} tone="blue" label="My open tasks" value={myTasks.length} hint={myTasks[0] ? `Next due ${fmtDate(myTasks[0].due)}` : 'All clear'} />
            <Stat icon={FileText} label="My reports in progress" value={myReports.length} hint={`${myReports.filter((r) => r.status === 'Returned').length} returned for correction`} />
            {showFinance ? (
              <Stat icon={Wallet} tone="gold" label="Association balance" value={fmtMoney(income - expense)} hint={S} />
            ) : (
              <Stat icon={CalendarDays} tone="gold" label="Upcoming events" value={upcoming.length} hint={upcoming[0] ? upcoming[0].title : '—'} />
            )}
          </>
        )}
      </div>

      <div className="grid-2">
        {(isAdmin || user.role === 'president') && (
          <Card
            title={isAdmin ? 'Reports awaiting University action' : 'Reports awaiting your endorsement'}
            actions={
              <Link to="/app/reports" className="link">
                All reports <ArrowRight size={14} />
              </Link>
            }
            pad={false}
          >
            {pending.length === 0 ? (
              <Empty icon={FileText} title="Nothing pending" />
            ) : (
              <ul className="list">
                {pending.map((r) => (
                  <li key={r.id}>
                    <Link to={`/app/reports/${r.id}`} className="list-row">
                      <div>
                        <strong>{r.title}</strong>
                        <small className="muted">
                          {r.type} report · {userById(r.authorId)?.office} · {fmtDate(r.updatedAt)}
                        </small>
                      </div>
                      <Badge>{r.status}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {!isAdmin && !isMember && (
          <Card
            title="Latest official notices"
            actions={
              <Link to="/app/notices" className="link">
                Inbox <ArrowRight size={14} />
              </Link>
            }
            pad={false}
          >
            <ul className="list">
              {notices.slice(0, 4).map((n) => (
                <li key={n.id}>
                  <Link to="/app/notices" className="list-row">
                    <div>
                      <strong className={n.readBy.includes(user.id) ? '' : 'unread'}>{n.title}</strong>
                      <small className="muted">From the Dean of Student Affairs · {fmtDate(n.date)}</small>
                    </div>
                    {!n.readBy.includes(user.id) && <Badge tone="amber">New</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {!isAdmin && !isMember && (
          <Card
            title="My tasks"
            actions={
              <Link to="/app/tasks" className="link">
                Tasks <ArrowRight size={14} />
              </Link>
            }
            pad={false}
          >
            {myTasks.length === 0 ? (
              <Empty icon={ListChecks} title="No open tasks" />
            ) : (
              <ul className="list">
                {myTasks.map((t) => (
                  <li key={t.id} className="list-row">
                    <div>
                      <strong>{t.title}</strong>
                      <small className="muted">
                        Due {fmtDate(t.due)} · from {userById(t.assignedBy)?.office}
                      </small>
                    </div>
                    <Badge>{t.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {!isAdmin && !isMember && myReports.length > 0 && (
          <Card title="My reports" pad={false}>
            <ul className="list">
              {myReports.map((r) => (
                <li key={r.id}>
                  <Link to={`/app/reports/${r.id}`} className="list-row">
                    <div>
                      <strong>{r.title}</strong>
                      <small className="muted">Updated {fmtDate(r.updatedAt)}</small>
                    </div>
                    <Badge>{r.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {isMember && (
          <Card
            title="Latest announcements"
            actions={
              <Link to="/app/announcements" className="link">
                All <ArrowRight size={14} />
              </Link>
            }
            pad={false}
          >
            <ul className="list">
              {announcements.slice(0, 4).map((a) => (
                <li key={a.id} className="list-row">
                  <div>
                    <strong>{a.title}</strong>
                    <small className="muted">
                      {userById(a.authorId)?.office} · {fmtDate(a.date)}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card
          title="Upcoming events & meetings"
          actions={
            <Link to="/app/events" className="link">
              Calendar <ArrowRight size={14} />
            </Link>
          }
          pad={false}
        >
          <ul className="list">
            {upcoming.slice(0, 4).map((e) => (
              <li key={e.id} className="list-row">
                <div className="date-chip">
                  <span>{new Date(e.date).toLocaleDateString('en-NG', { month: 'short' })}</span>
                  <strong>{new Date(e.date).getDate()}</strong>
                </div>
                <div className="grow">
                  <strong>{e.title}</strong>
                  <small className="muted">
                    {e.time} · {e.venue}
                  </small>
                </div>
                <Badge tone={e.type === 'Meeting' ? 'blue' : 'green'}>{e.type}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        {showFinance && (
          <Card
            title={`Financial summary · ${S}`}
            actions={
              <Link to="/app/finance" className="link">
                Finance <ArrowRight size={14} />
              </Link>
            }
          >
            <div className="fin-summary">
              <div>
                <small className="muted">Income</small>
                <strong className="pos">{fmtMoney(income)}</strong>
              </div>
              <div>
                <small className="muted">Expenses</small>
                <strong className="neg">{fmtMoney(expense)}</strong>
              </div>
              <div>
                <small className="muted">Balance</small>
                <strong>{fmtMoney(income - expense)}</strong>
              </div>
            </div>
            <div className="meter" title="Share of income spent">
              <span style={{ width: `${Math.min(100, (expense / (income || 1)) * 100)}%` }} />
            </div>
            <small className="muted">{Math.round((expense / (income || 1)) * 100)}% of income spent so far</small>
          </Card>
        )}

        {isAdmin && (
          <Card
            title="Recent activity"
            actions={
              <Link to="/app/audit" className="link">
                Audit log <ArrowRight size={14} />
              </Link>
            }
            pad={false}
          >
            <ul className="list">
              {state.audit
                                .slice(0, 6)
                .map((a) => {
                  const u = userById(a.userId);
                  return (
                    <li key={a.id} className="list-row">
                      <Avatar user={u} size={30} />
                      <div className="grow">
                        <span>
                          <strong>{u?.name}</strong> {a.action.toLowerCase()}
                        </span>
                        <small className="muted">
                          {a.target} · {fmtDateTime(a.date)}
                        </small>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </Card>
        )}

        {isAdmin && (
          <Card
            title={`Executive council · ${S}`}
            actions={
              <Link to="/app/accounts" className="link">
                Manage <ArrowRight size={14} />
              </Link>
            }
            pad={false}
          >
            <ul className="list">
              {council.map((u) => (
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
          </Card>
        )}
      </div>
    </>
  );
}
