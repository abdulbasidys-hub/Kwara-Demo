import { useState } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can, EXEC_ROLES } from '../data/roles';
import { Avatar, Field, Guard, Modal, PageHeader, Tabs } from '../components/ui';
import { fmtDate } from '../utils';

const COLUMNS = ['To do', 'In progress', 'Done'];
const TODAY = new Date().toISOString().slice(0, 10);

export default function Tasks() {
  return (
    <Guard perm="tasks.view" title="Tasks">
      <TasksInner />
    </Guard>
  );
}

function TasksInner() {
  const { state, user, userById, addTask, setTaskStatus } = useApp();
  const assign = can(user, 'tasks.assign');
  const [tab, setTab] = useState(assign ? 'all' : 'mine');
  const [form, setForm] = useState(null);
  const execs = state.users.filter((u) => EXEC_ROLES.includes(u.role) && u.status === 'active' && u.session === state.currentSession);
  const tasks = state.tasks.filter((t) => tab === 'all' || t.assigneeId === user.id || (tab === 'assigned' && t.assignedBy === user.id));
  const shown = tab === 'assigned' ? state.tasks.filter((t) => t.assignedBy === user.id) : tasks;

  return (
    <>
      <PageHeader
        eyebrow="Task assignment"
        title="Tasks"
        subtitle="Assign tasks among executives with due dates. Assignees are alerted by email."
        actions={
          assign && (
            <button className="btn btn-primary" onClick={() => setForm({ title: '', assigneeId: execs[0]?.id, due: TODAY, notes: '' })}>
              <Plus size={16} /> Assign task
            </button>
          )
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[{ value: 'mine', label: 'My tasks' }, ...(assign ? [{ value: 'assigned', label: 'Assigned by me' }] : []), { value: 'all', label: 'All tasks' }]}
      />
      <div className="kanban">
        {COLUMNS.map((col) => {
          const items = shown.filter((t) => t.status === col);
          return (
            <div key={col} className="kanban-col">
              <div className="kanban-head">
                <strong>{col}</strong>
                <span className="count">{items.length}</span>
              </div>
              {items.map((t) => {
                const a = userById(t.assigneeId);
                const editable = t.assigneeId === user.id || t.assignedBy === user.id || user.role === 'admin';
                const overdue = t.status !== 'Done' && t.due < TODAY;
                return (
                  <div key={t.id} className="task">
                    <strong>{t.title}</strong>
                    {t.notes && <p className="muted small">{t.notes}</p>}
                    <div className="task-foot">
                      <span className="cell-user">
                        <Avatar user={a} size={24} />
                        <small>{a?.office}</small>
                      </span>
                      <small className={overdue ? 'neg' : 'muted'}>
                        <CalendarClock size={12} /> {fmtDate(t.due)}
                      </small>
                    </div>
                    {editable && (
                      <select value={t.status} onChange={(e) => setTaskStatus(t.id, e.target.value)} className="task-status" aria-label="Status">
                        {COLUMNS.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
              {items.length === 0 && <div className="kanban-empty">No tasks</div>}
            </div>
          );
        })}
      </div>

      {form && (
        <Modal
          title="Assign a task"
          onClose={() => setForm(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setForm(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" form="add-task">
                Assign
              </button>
            </>
          }
        >
          <form
            id="add-task"
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              addTask(form);
              setForm(null);
            }}
          >
            <Field label="Task">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Assign to">
              <select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}>
                {execs.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.office} — {u.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Due date">
              <input type="date" required value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
            </Field>
            <Field label="Notes">
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
          </form>
        </Modal>
      )}
    </>
  );
}
