import { useState } from 'react'

export default function Layout({ children }) {
  const tabs = ['Overview', 'Transactions', 'Budgets', 'Bills', 'Analytics', 'Accounts']
  const [active, setActive] = useState('Overview')

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Our Budget</h1>
      </header>

      <nav className="bg-gray-50 p-2 flex space-x-4 shadow-inner">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-3 py-1 rounded ${
              active === tab ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="p-4">{children(active)}</main>
    </div>
  )
}
