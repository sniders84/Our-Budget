import { useEffect, useMemo, useState } from 'react'
import * as storage from '../lib/storage'
import Charts from './Charts'

export default function AnalyticsTab() {
  const [txs, setTxs] = useState([])

  useEffect(()=> {
    setTxs(storage.read(storage.TX_KEY))
  }, [])

  const monthly = useMemo(() => {
    const map = {}
    txs.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
      map[key] = (map[key] || 0) + Number(t.amount || 0)
    })
    return Object.entries(map).sort().map(([k,v]) => ({ name: k, value: Math.abs(v) }))
  }, [txs])

  const byCategory = useMemo(() => {
    const map = {}
    txs.forEach(t => {
      const c = t.category || 'Uncategorized'
      map[c] = (map[c] || 0) + Math.abs(Number(t.amount || 0))
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [txs])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Monthly Spend</h3>
        <Charts type="line" data={monthly} />
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Category Breakdown</h3>
        <Charts type="bar" data={byCategory} />
      </div>
    </div>
  )
}