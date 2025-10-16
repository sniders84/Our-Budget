import { useEffect, useMemo, useState } from 'react'
import { read, write, TX_KEY, addTx, deleteTx, updateTx } from '../lib/storage'
import * as storage from '../lib/storage'
import Charts from './Charts'

function id() {
  return 't_' + Math.random().toString(36).slice(2, 9)
}

export default function TransactionsTab() {
  const [txs, setTxs] = useState([])
  const [filter, setFilter] = useState({ q: '', cat: 'All' })
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    setTxs(storage.read(storage.TX_KEY))
  }, [])

  useEffect(() => {
    storage.write(storage.TX_KEY, txs)
  }, [txs])

  const categories = useMemo(() => {
    const set = new Set(txs.map(t => t.category || 'Uncategorized'))
    return ['All', ...Array.from(set).slice(0, 30)]
  }, [txs])

  function handleDelete(txId) {
    const after = storage.deleteTx(txId)
    setTxs(after)
  }

  function handleCategoryChange(id, cat) {
    const after = storage.updateTx(id, { category: cat })
    setTxs(after)
  }

  function handleAdd(e) {
    e.preventDefault()
    const f = new FormData(e.target)
    const tx = {
      id: id(),
      date: f.get('date'),
      description: f.get('description'),
      amount: Number(f.get('amount')),
      category: f.get('category') || null,
      account: f.get('account') || null,
    }
    const after = storage.addTx(tx)
    setTxs(after)
    e.target.reset()
  }

  const filtered = useMemo(() => {
    let arr = txs.slice()
    if (filter.q) {
      const q = filter.q.toLowerCase()
      arr = arr.filter(t => (t.description || '').toLowerCase().includes(q))
    }
    if (filter.cat && filter.cat !== 'All') {
      arr = arr.filter(t => (t.category || 'Uncategorized') === filter.cat)
    }
    arr.sort((a,b)=> new Date(b.date) - new Date(a.date))
    return arr
  }, [txs, filter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  const summary = useMemo(() => {
    const map = {}
    txs.forEach(t => {
      const c = t.category || 'Uncategorized'
      map[c] = (map[c] || 0) + Math.abs(Number(t.amount || 0))
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [txs])

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form onSubmit={handleAdd} className="col-span-1 lg:col-span-2 flex gap-2 items-end">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500">Date</label>
              <input name="date" type="date" required className="mt-1 w-full border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Amount</label>
              <input name="amount" type="number" step="0.01" required className="mt-1 w-full border rounded p-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500">Description</label>
              <input name="description" type="text" required className="mt-1 w-full border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Category</label>
              <input name="category" type="text" placeholder="e.g., groceries" className="mt-1 w-full border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Account</label>
              <input name="account" type="text" placeholder="Checking" className="mt-1 w-full border rounded p-2 text-sm" />
            </div>
          </div>
          <div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Add Tx</button>
          </div>
        </form>

        <div className="col-span-1 lg:col-span-1">
          <div className="flex items-center gap-2">
            <input placeholder="Search description..." className="flex-1 border rounded p-2 text-sm" value={filter.q} onChange={e => setFilter({...filter, q: e.target.value})} />
            <select className="border rounded p-2 text-sm" value={filter.cat} onChange={e => setFilter({...filter, cat: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-medium">Spending Summary</h4>
            <div className="mt-2">
              <Charts type="pie" data={summary} height={180} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2">Account</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(tx => (
              <tr key={tx.id} className="border-t">
                <td className="px-3 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="px-3 py-2">{tx.description}</td>
                <td className="px-3 py-2 text-right">{Number(tx.amount).toFixed(2)}</td>
                <td className="px-3 py-2">
                  <input value={tx.category || ''} onChange={e => handleCategoryChange(tx.id, e.target.value)} className="border rounded p-1 text-sm" />
                </td>
                <td className="px-3 py-2">{tx.account || ''}</td>
                <td className="px-3 py-2">
                  <button onClick={() => handleDelete(tx.id)} className="text-sm text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
          <div>Showing {(page-1)*pageSize + 1}–{Math.min(page*pageSize, filtered.length)} of {filtered.length}</div>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-2 py-1 border rounded disabled:opacity-40">Prev</button>
            <div className="px-3 py-1 border rounded">{page}/{pageCount}</div>
            <button disabled={page>=pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))} className="px-2 py-1 border rounded disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}