import { useEffect, useState } from 'react'
import * as storage from '../lib/storage'

export default function AccountsTab() {
  const [accounts, setAccounts] = useState(storage.read(storage.ACCOUNTS_KEY))
  const [form, setForm] = useState({ name:'', balance:'' })

  useEffect(()=> {
    setAccounts(storage.read(storage.ACCOUNTS_KEY))
  }, [])

  useEffect(()=> {
    storage.write(storage.ACCOUNTS_KEY, accounts)
  }, [accounts])

  function addAccount(e) {
    e.preventDefault()
    const acc = { id: 'a_' + Math.random().toString(36).slice(2,6), name: form.name, balance: Number(form.balance || 0) }
    setAccounts(prev => [acc, ...prev])
    setForm({name:'', balance:''})
  }

  function removeAccount(id) {
    setAccounts(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold">Add Account</h3>
        <form onSubmit={addAccount} className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Account name" className="border rounded p-2" required />
          <input value={form.balance} onChange={e=>setForm({...form, balance:e.target.value})} placeholder="Balance" type="number" className="border rounded p-2" required />
          <button className="bg-indigo-600 text-white rounded px-4 py-2">Add</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Linked Accounts</h3>
        <div className="space-y-2">
          {accounts.length === 0 && <div className="text-sm text-slate-500">No accounts yet</div>}
          {accounts.map(a => (
            <div key={a.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-slate-500">${Number(a.balance).toFixed(2)}</div>
              </div>
              <button onClick={()=>removeAccount(a.id)} className="text-sm text-rose-600">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}