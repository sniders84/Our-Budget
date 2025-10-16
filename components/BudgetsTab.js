import { useEffect, useMemo, useState } from 'react'
import * as storage from '../lib/storage'
import Charts from './Charts'

export default function BudgetsTab() {
  const [budgets, setBudgets] = useState(storage.read(storage.BUDGET_KEY))
  const [txs, setTxs] = useState(storage.read(storage.TX_KEY))
  const [newBudget, setNewBudget] = useState({ category: '', limit: '' })

  useEffect(()=> {
    setTxs(storage.read(storage.TX_KEY))
  }, [])

  useEffect(()=> {
    storage.write(storage.BUDGET_KEY, budgets)
  }, [budgets])

  const spentByCategory = useMemo(()=>{
    const map={}
    txs.forEach(t => {
      const c = t.category || 'Uncategorized'
      map[c] = (map[c]||0) + Math.abs(Number(t.amount||0))
    })
    return map
  }, [txs])

  function addBudget(e) {
    e.preventDefault()
    const b = {...newBudget, id:'b_' + Math.random().toString(36).slice(2,6), limit: Number(newBudget.limit)}
    const next = [b, ...budgets]
    setBudgets(next)
    setNewBudget({category:'', limit:''})
  }

  function removeBudget(id) {
    setBudgets(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold">Create Budget</h3>
        <form onSubmit={addBudget} className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={newBudget.category} onChange={e=>setNewBudget({...newBudget, category:e.target.value})} placeholder="Category" className="border rounded p-2" required/>
          <input value={newBudget.limit} onChange={e=>setNewBudget({...newBudget, limit:e.target.value})} placeholder="Monthly Limit" type="number" className="border rounded p-2" required/>
          <button className="bg-indigo-600 text-white rounded px-4 py-2">Add Budget</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-xl shadow grid gap-3">
        {budgets.length === 0 && <div className="text-sm text-slate-500">No budgets yet</div>}
        {budgets.map(b => {
          const spent = spentByCategory[b.category] || 0
          const pct = Math.min(100, (spent / (b.limit || 1)) * 100)
          return (
            <div key={b.id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{b.category}</div>
                <div className="text-sm text-slate-500">{spent.toFixed(2)} / {b.limit.toFixed(2)}</div>
                <div className="w-64 bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div style={{width: `${pct}%`}} className={`h-2 ${pct > 90 ? 'bg-rose-500' : 'bg-indigo-600'}`}></div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm text-slate-600">{Math.round(pct)}%</div>
                <button onClick={()=>removeBudget(b.id)} className="text-sm text-rose-600">Remove</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}