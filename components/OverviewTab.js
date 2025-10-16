import { useEffect, useMemo, useState } from 'react'
import Charts from './Charts'
import { read, BILLS_KEY, BUDGET_KEY, TX_KEY, read as _read } from '../lib/storage'
import { read as readRaw } from '../lib/storage'

const fmt = n => `$${Number(n || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`

// we will import directly from storage helper
import * as storage from '../lib/storage'

export default function OverviewTab() {
  const [txs, setTxs] = useState([])
  const [bills, setBills] = useState([])
  const [budgets, setBudgets] = useState([])

  useEffect(() => {
    setTxs(storage.read(storage.TX_KEY))
    setBills(storage.read(storage.BILLS_KEY))
    setBudgets(storage.read(storage.BUDGET_KEY))
  }, [])

  // net assets approximation: sum of account balances (if accounts exist) else sum of txs (simple)
  const netWorth = useMemo(() => {
    const accounts = storage.read(storage.ACCOUNTS_KEY)
    if (accounts && accounts.length > 0) {
      return accounts.reduce((s, a) => s + Number(a.balance || 0), 0)
    }
    // fallback: sum of credits minus debits
    return txs.reduce((s, t) => s + Number(t.amount || 0), 0)
  }, [txs])

  const upcomingBills = useMemo(() => {
    const today = new Date()
    return bills
      .map(b => ({ ...b, due: new Date(b.dueDate) }))
      .filter(b => b.due >= new Date(today.getFullYear(), today.getMonth(), 1) && (!b.paid))
      .sort((a,b)=>a.due - b.due)
  }, [bills])

  const overdue = useMemo(() => {
    const today = new Date()
    return bills.filter(b => !b.paid && new Date(b.dueDate) < today)
  }, [bills])

  // spending by category for last 30 days
  const byCategory = useMemo(() => {
    const map = {}
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - 1)
    txs.forEach(t => {
      const cat = t.category || 'Uncategorized'
      const date = new Date(t.date)
      if (date >= cutoff) {
        map[cat] = (map[cat] || 0) + Math.abs(Number(t.amount || 0))
      }
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [txs])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Net Worth</div>
            <div className="text-3xl font-bold">{fmt(netWorth)}</div>
            <div className="mt-2 text-sm text-slate-600">Includes linked accounts and transactions</div>
          </div>
          <div className="w-48">
            <div className="text-sm text-slate-500">Recent Spending (30d)</div>
            <div className="text-2xl font-semibold">{fmt(byCategory.reduce((s,x)=>s + x.value,0))}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Spending by Category (30d)</h3>
            <Charts type="pie" data={byCategory} height={240} />
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Upcoming Bills</h3>
            {upcomingBills.length === 0 ? (
              <div className="text-sm text-slate-500">No upcoming bills</div>
            ) : (
              <ul className="space-y-2">
                {upcomingBills.slice(0,6).map(b => (
                  <li key={b.id} className="flex items-center justify-between border rounded p-2">
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-slate-500">{new Date(b.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div className={`font-medium ${b.paid ? 'text-green-600' : 'text-slate-700'}`}>${Number(b.amount).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Suggestions</h3>
          <div className="text-sm text-slate-600">Cost-cutting suggestions are based on category spend. (More analysis coming — we will add rules to highlight dining out, subscriptions, and recurring spend.)</div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-sm text-slate-500">Overdue Bills</div>
          <div className="text-xl font-semibold mt-2">{overdue.length}</div>
          {overdue.length > 0 && (
            <ul className="mt-3 space-y-2">
              {overdue.slice(0,3).map(b => (
                <li key={b.id} className="text-sm text-rose-600">{b.name} — due {new Date(b.dueDate).toLocaleDateString()}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-sm text-slate-500">Budgets</div>
          <div className="mt-2 text-sm text-slate-600">Click Budgets tab to set and view limits</div>
        </div>
      </aside>
    </div>
  )
}