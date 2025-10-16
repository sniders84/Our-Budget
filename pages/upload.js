import { useState, useEffect } from 'react'
import TransactionList from '../components/TransactionList'

const TABS = ['Upload', 'Accounts', 'Bills', 'Analytics']

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState('Upload')
  const [transactions, setTransactions] = useState([])
  const [fileError, setFileError] = useState(null)

  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem('transactions') || '[]')
    setTransactions(saved)
  }, [])

  const handleFileUpload = async (e) => {
    setFileError(null)
    const file = e.target.files[0]
    if (!file) return
    try {
      const text = await file.text()
      const lines = text.split('\n').slice(1) // skip header
      const newTx = lines.map((line, idx)=>{
        const [date, description, amount] = line.split(',')
        return { id: Date.now()+idx, date, description, amount: parseFloat(amount), category: '' }
      })
      const updated = [...transactions, ...newTx]
      setTransactions(updated)
      localStorage.setItem('transactions', JSON.stringify(updated))
    } catch(err) {
      setFileError('Failed to parse file.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bank Statements & Accounts</h1>
        <p className="text-gray-500 mt-1">Upload transactions, track accounts, and view bills</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {TABS.map(tab=>(
          <button
            key={tab}
            className={`pb-2 font-semibold ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={()=>setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'Upload' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Upload CSV Statement</h3>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="border p-2 rounded w-full" />
            {fileError && <p className="text-red-500 mt-2">{fileError}</p>}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-700 mb-2">Uploaded Transactions</h4>
              <TransactionList transactions={transactions} />
            </div>
          </div>
        )}

        {activeTab === 'Accounts' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Connected Accounts</h3>
            <p className="text-gray-500">This is where your synced bank accounts will appear.</p>
            <ul className="mt-4 space-y-2">
              <li className="bg-gray-100 p-3 rounded shadow hover:bg-gray-200 transition">Checking Account - $5,200</li>
              <li className="bg-gray-100 p-3 rounded shadow hover:bg-gray-200 transition">Credit Card - $1,230</li>
              <li className="bg-gray-100 p-3 rounded shadow hover:bg-gray-200 transition">Savings - $12,450</li>
            </ul>
          </div>
        )}

        {activeTab === 'Bills' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Upcoming & Overdue Bills</h3>
            <ul className="space-y-2">
              <li className="p-3 rounded shadow flex justify-between items-center bg-yellow-100">
                <span>Electricity - Due 10/20</span>
                <span className="font-bold text-yellow-700">$120</span>
              </li>
              <li className="p-3 rounded shadow flex justify-between items-center bg-red-100">
                <span>Credit Card - Overdue</span>
                <span className="font-bold text-red-700">$450</span>
              </li>
              <li className="p-3 rounded shadow flex justify-between items-center bg-green-100">
                <span>Internet - Paid</span>
                <span className="font-bold text-green-700">$60</span>
              </li>
            </ul>
          </div>
        )}

       {activeTab === 'Analytics' && (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="font-semibold text-gray-700 mb-4">Spending Insights</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Spending by Category Pie Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-2">Spending by Category</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={transactions.reduce((acc, t) => {
                const cat = t.category || 'Uncategorized'
                const found = acc.find(a => a.name === cat)
                if (found) found.value += Number(t.amount || 0)
                else acc.push({ name: cat, value: Number(t.amount || 0) })
                return acc
              }, [])}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {transactions.map((t, idx) => (
                <Cell key={idx} fill={SAMPLE_COLORS[idx % SAMPLE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Spending Line Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-2">Monthly Spending</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={transactions.reduce((acc, t) => {
              const date = new Date(t.date)
              const month = `${date.getFullYear()}-${date.getMonth() + 1}`
              const found = acc.find(a => a.month === month)
              if (found) found.amount += Number(t.amount || 0)
              else acc.push({ month, amount: Number(t.amount || 0) })
              return acc
            }, [])}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#4ade80" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Merchants / Descriptions Bar Chart */}
      <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
        <h4 className="font-semibold text-gray-700 mb-2">Top Merchants</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={transactions.reduce((acc, t) => {
              const desc = t.description || 'Unknown'
              const found = acc.find(a => a.name === desc)
              if (found) found.value += Number(t.amount || 0)
              else acc.push({ name: desc, value: Number(t.amount || 0) })
              return acc
            }, []).sort((a,b)=>b.value-a.value).slice(0,10)}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  </div>
)}