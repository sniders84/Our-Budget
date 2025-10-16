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
            <p className="text-gray-500 mb-2">Charts and insights will go here.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">Pie Chart Placeholder</div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">Bar Chart Placeholder</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}