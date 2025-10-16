import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import TransactionList from '../components/TransactionList'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const SAMPLE_CATEGORIES = {
  groceries: ['walmart', 'whole foods', 'grocery', 'aldi', 'trader'],
  coffee: ['starbucks', 'dunkin', 'cafe'],
  transport: ['uber', 'lyft', 'metro', 'gas'],
  entertainment: ['netflix', 'spotify', 'hulu'],
  rent: ['rent'],
}

const COLORS = ['#4ade80', '#60a5fa', '#f97316', '#f472b6', '#fca5a5', '#a78bfa']

export default function Home() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('transactions') || '[]')
    setTransactions(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  function handleDelete(id) {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  function handleChangeCategory(id, cat) {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, category: cat } : t))
    )
  }

  // Auto-categorize any uncategorized transactions
  useEffect(() => {
    let changed = false
    const mapped = transactions.map(t => {
      if (t.category) return t
      const desc = (t.description || '').toLowerCase()
      for (const [cat, keys] of Object.entries(SAMPLE_CATEGORIES)) {
        if (keys.some(k => desc.includes(k))) {
          changed = true
          return { ...t, category: cat }
        }
      }
      return t
    })
    if (changed) setTransactions(mapped)
  }, [transactions])

  const total = useMemo(
    () => transactions.reduce((s, t) => s + Number(t.amount || 0), 0),
    [transactions]
  )

  const byCategory = useMemo(() => {
    const map = {}
    transactions.forEach(t => {
      const cat = t.category || 'Uncategorized'
      map[cat] = (map[cat] || 0) + Number(t.amount || 0)
    })
    return Object.entries(map).map(([name, amount]) => ({
      name,
      value: Math.abs(amount),
    }))
  }, [transactions])

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Personal Budget</h1>
        <nav className="space-x-2">
          <Link href="/upload" className="text-sm text-blue-600">
            Upload CSV
          </Link>
        </nav>
      </header>

      <section className="mt-4 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Net (all transactions)</div>
            <div className="text-3xl font-semibold">
              ${total.toFixed(2)}
            </div>
          </div>
          <div style={{ width: 200, height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={50}
                >
                  {byCategory.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-medium">Transactions</h2>
        <TransactionList
          transactions={transactions}
          onDelete={handleDelete}
          onChangeCategory={handleChangeCategory}
        />
      </section>

      <footer className="mt-6 text-sm text-gray-500">
        Tip: edit categories inline. Export CSV by copying browser storage if
        needed.
      </footer>
    </div>
  )
}
