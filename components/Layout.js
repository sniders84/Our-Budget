import { useState } from 'react'

const tabs = ['Overview', 'Transactions', 'Budgets', 'Bills', 'Analytics', 'Accounts']

export default function Layout({ children }) {
  const [active, setActive] = useState('Overview')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white/60 backdrop-blur sticky top-0 z-20 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow">
              OB
            </div>
            <div>
              <h1 className="text-lg font-semibold">Our Budget</h1>
              <div className="text-xs text-slate-500">Personal finance dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">Signed in (local)</div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        <nav className="mt-4 bg-white/80 rounded-xl p-2 flex gap-2 shadow-sm">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                active === t
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        <main className="mt-6">{children(active)}</main>
      </div>
    </div>
  )
}