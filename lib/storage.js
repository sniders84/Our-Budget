// lib/storage.js
export const TX_KEY = 'transactions'
export const BUDGET_KEY = 'budgets'
export const BILLS_KEY = 'bills'
export const ACCOUNTS_KEY = 'accounts'

export function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value || []))
}

export function addTx(tx) {
  const cur = read(TX_KEY)
  cur.unshift(tx)
  write(TX_KEY, cur)
  return cur
}

export function updateTx(id, patch) {
  const cur = read(TX_KEY).map(t => (t.id === id ? { ...t, ...patch } : t))
  write(TX_KEY, cur)
  return cur
}

export function deleteTx(id) {
  const cur = read(TX_KEY).filter(t => t.id !== id)
  write(TX_KEY, cur)
  return cur
}

// match a bill to a transaction — simple heuristics: same amount (within cents) and date within +/-3 days
export function matchBillToTx(bill, txs) {
  const matches = txs.filter(tx => {
    const amtMatch = Math.abs(Number(tx.amount) - Number(bill.amount)) < 0.01
    const txDate = new Date(tx.date)
    const due = new Date(bill.dueDate)
    const diffDays = Math.abs((txDate - due) / (1000 * 60 * 60 * 24))
    return amtMatch && diffDays <= 3
  })
  return matches[0] || null
}