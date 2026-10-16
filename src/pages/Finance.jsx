import { useState } from 'react';
import { Download, Plus, TrendingDown, TrendingUp, Wallet, Coins } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../data/roles';
import { Badge, Card, Field, Guard, Modal, PageHeader, Stat } from '../components/ui';
import { exportCSV, fmtDate, fmtMoney } from '../utils';

const CATEGORIES = { income: ['Dues', 'Sponsorship', 'Donation', 'Balance b/f', 'Other'], expense: ['Events', 'Welfare', 'Printing', 'Transport', 'Office', 'Other'] };

export default function Finance() {
  return (
    <Guard perm="finance.view" title="Dues & Finance">
      <FinanceInner />
    </Guard>
  );
}

function FinanceInner() {
  const { state, user, addTransaction } = useApp();
  const manage = can(user, 'finance.manage');
  const sessions = [...new Set(state.transactions.map((t) => t.session).concat(state.currentSession))].sort().reverse();
  const [session, setSession] = useState(state.currentSession);
  const [form, setForm] = useState(null);

  const tx = state.transactions.filter((t) => t.session === session).sort((a, b) => b.date.localeCompare(a.date));
  const income = tx.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = tx.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const dues = tx.filter((t) => t.category === 'Dues').reduce((a, t) => a + t.amount, 0);

  const byCat = (type) => {
    const m = {};
    tx.filter((t) => t.type === type).forEach((t) => (m[t.category] = (m[t.category] || 0) + t.amount));
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  };
  const maxCat = Math.max(1, ...byCat('income').map((x) => x[1]), ...byCat('expense').map((x) => x[1]));

  return (
    <>
      <PageHeader
        eyebrow="Dues and finance records"
        title="Dues & Finance"
        subtitle={manage ? 'Record dues, income and expenses with receipt references.' : 'Read-only finance dashboard for your role.'}
        actions={
          <>
            <select value={session} onChange={(e) => setSession(e.target.value)} aria-label="Session">
              {sessions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              className="btn btn-ghost"
              onClick={() => exportCSV(`finance-${session.replace('/', '-')}.csv`, tx.map((t) => ({ Date: t.date, Type: t.type, Category: t.category, Description: t.description, Amount: t.amount, Receipt: t.receipt })))}
            >
              <Download size={16} /> Export
            </button>
            {manage && (
              <button className="btn btn-primary" onClick={() => setForm({ type: 'expense', category: 'Events', description: '', amount: '', date: new Date().toISOString().slice(0, 10), receipt: '' })}>
                <Plus size={16} /> Record transaction
              </button>
            )}
          </>
        }
      />

      <div className="stats">
        <Stat icon={TrendingUp} label="Total income" value={fmtMoney(income)} />
        <Stat icon={TrendingDown} tone="red" label="Total expenses" value={fmtMoney(expense)} />
        <Stat icon={Wallet} tone="gold" label="Balance" value={fmtMoney(income - expense)} />
        <Stat icon={Coins} tone="blue" label="Dues collected" value={fmtMoney(dues)} hint="₦2,000 per member" />
      </div>

      <div className="grid-sidebar reverse">
        <Card title={`Transactions · ${session}`} pad={false}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Receipt</th>
                  <th className="right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {tx.map((t) => (
                  <tr key={t.id}>
                    <td className="nowrap">{fmtDate(t.date)}</td>
                    <td>{t.description}</td>
                    <td>
                      <Badge tone={t.type === 'income' ? 'green' : 'red'}>{t.category}</Badge>
                    </td>
                    <td className="mono">{t.receipt || '—'}</td>
                    <td className={`right nowrap ${t.type === 'income' ? 'pos' : 'neg'}`}>
                      {t.type === 'income' ? '+' : '−'}
                      {fmtMoney(t.amount)}
                    </td>
                  </tr>
                ))}
                {tx.length === 0 && (
                  <tr>
                    <td colSpan={5} className="center muted">
                      No transactions recorded for this session yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Summary by category">
          {['income', 'expense'].map((type) => (
            <div key={type} className="cat-block">
              <h4>{type === 'income' ? 'Income' : 'Expenses'}</h4>
              {byCat(type).map(([cat, amt]) => (
                <div key={cat} className="cat-row">
                  <div className="cat-label">
                    <span>{cat}</span>
                    <strong>{fmtMoney(amt)}</strong>
                  </div>
                  <div className={`bar ${type}`}>
                    <span style={{ width: `${(amt / maxCat) * 100}%` }} />
                  </div>
                </div>
              ))}
              {byCat(type).length === 0 && <p className="muted small">None</p>}
            </div>
          ))}
        </Card>
      </div>

      {form && (
        <Modal
          title="Record transaction"
          onClose={() => setForm(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setForm(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" form="add-tx">
                Save
              </button>
            </>
          }
        >
          <form
            id="add-tx"
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              addTransaction({ ...form, amount: Number(form.amount) });
              setForm(null);
              setSession(state.currentSession);
            }}
          >
            <Field label="Type">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category: CATEGORIES[e.target.value][0] })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES[form.type].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Description">
              <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Amount (₦)">
              <input required type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </Field>
            <Field label="Date">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Receipt no." hint="Attach receipts to the financial report">
              <input value={form.receipt} onChange={(e) => setForm({ ...form, receipt: e.target.value })} placeholder="RC-0000" />
            </Field>
          </form>
        </Modal>
      )}
    </>
  );
}
