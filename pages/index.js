import { useEffect, useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import TransactionList from '../components/TransactionList'

const SAMPLE_COLORS = ['#4ade80','#60a5fa','#f97316','#f472b6','#fca5a5','#a78bfa']

export default function Home() {
  const [transactions, setTransactions] = useState([])

  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem('transactions') || '[]')
    setTransactions(saved)
  }, [])

  const totalSpent = useMemo(() => transactions.reduce((sum,t)=>sum + Number(t.amount||0),0), [transactions])

  const byCategory = useMemo(() => {
    const map = {}
    transactions.forEach(t=>{
      const cat = t.category || 'Uncategorized'
      map[cat] = (map[cat] || 0) + Number(t.amount||0)
    })
    return Object.entries(map).map(([name,value])=>({name, value}))
  }, [transactions])

  const monthlyData = useMemo(() => {
    const map = {}
    transactions.forEach(t=>{
      const date = new Date(t.date)
      const month = `${date.getFullYear()}-${date.getMonth()+1}`
      map[month] = (map[month] || 0) + Number(t.amount||0)
    })
    return Object.entries(map).map(([month, amount])=>({month, amount}))
  }, [transactions])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Budget Dashboard</h1>
        <p className="text-gray-500 mt-1">Visualize your spending, bills, and budgets</p>
      </header>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-gray-500 font-semibold">Total Spent</h2>
          <p className="text-2xl font-bold text-red-500">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-gray-500 font-semibold">Transactions</h2>
          <p className="text-2xl font-bold text-blue-500">{transactions.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-gray-500 font-semibold">Average per Transaction</h2>
          <p className="text-2xl font-bold text-green-500">
            ${transactions.length ? (totalSpent / transactions.length).toFixed(2) : 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {byCategory.map((entry, idx) => <Cell key={idx} fill={SAMPLE_COLORS[idx % SAMPLE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Monthly Spending</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#4ade80" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-2">Recent Transactions</h3>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  )
}