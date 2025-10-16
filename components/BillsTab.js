import { useEffect, useState } from 'react'
import * as storage from '../lib/storage'

export default function BillsTab() {
  const [bills, setBills] = useState(storage.read(storage.BILLS_KEY))
  const [txs, setTxs] = useState(storage.read(storage.TX_KEY))
  const [form, setForm] = useState({ name:'', amount:'', dueDate:'' })

  useEffect(()=> {
    setTxs(storage.read(storage.TX_KEY))
  }, [])

  useEffect(()=> {
    storage.write(storage.BILLS_KEY, bills)
  }, [bills])

  function addBill(e) {
    e.preventDefault()
    const b = { id: 'bill_' + Math.random().toString(36).slice(2,6), name: form.name, amount: Number(form.amount), dueDate: form.dueDate, paid: false }
    setBills(prev => [b, ...prev])
    setForm({name:'', amount:'', dueDate:''})
  }

  function markPaid(bill) {
    // try to find matching tx
    const match = storage.matchBillToTx(bill, txs)
    setBills(prev => prev.map(p => p.id === bill.id ? {...p, paid: true, matchedTxId: match ? match.id : null } : p))
  }

  function removeBill(id) {
    setBills(prev => prev.filter(b => b.id !== id))
  }

  const overdue = bills.filter(b => !b.paid && new Date(b.dueDate) < new Date())

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold">Add Bill</h3>
        <form onSubmit={addBill} className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name e.g., Electric" className="border rounded p-2" required/>
          <input value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} placeholder="Amount" type="number" className="border rounded p-2" required/>
          <input value={form.dueDate} onChange={e=>setForm({...form, dueDate:e.target.value})} placeholder="Due date" type="date" className="border rounded p-2" required/>
          <div className="md:col-span-3">
            <button className="bg-indigo-600 text-white rounded px-4 py-2">Add Bill</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold">Your Bills</h3>
        <div className="mt-3 space-y-2">
          {bills.length === 0 && <div className="text-sm text-slate-500">No bills yet</div>}
          {bills.map(b => {
            const due = new Date(b.dueDate)
            const isOver = !b.paid && due < new Date()
            return (
              <div key={b.id} className={`flex items-center justify-between p-3 border rounded ${isOver ? 'bg-rose-50' : ''}`}>
                <div>
                  <div className="font-medium">{b.name} {b.paid && <span className="text-sm text-green-600">● paid</span>}</div>
                  <div className="text-xs text-slate-500">Due {due.toLocaleDateString()} • ${b.amount.toFixed(2)}</div>
                </div>
                <div className="flex gap-2 items-center">
                  {!b.paid && <button onClick={()=>markPaid(b)} className="text-sm bg-green-600 text-white px-3 py-1 rounded">Mark paid</button>}
                  <button onClick={()=>removeBill(b.id)} className="text-sm text-rose-600">Remove</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="bg-rose-50 p-4 rounded-xl shadow">
          <div className="font-semibold text-rose-700">Overdue Payments</div>
          <ul className="mt-2">
            {overdue.map(b => <li key={b.id} className="text-sm text-rose-700">{b.name} — due {new Date(b.dueDate).toLocaleDateString()}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}