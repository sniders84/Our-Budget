import Papa from 'papaparse'

// Minimal parser that detects common bank CSV columns
// Returns array of transactions: { id, date, description, amount, category }

export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data.map(row => normalizeRow(row)).filter(Boolean)
          resolve(data)
        } catch (e) {
          reject(e)
        }
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}

function normalizeRow(row) {
  const keys = Object.keys(row)
  const lower = k => k.toLowerCase()
  const find = (...cands) => keys.find(k => cands.some(c => lower(k).includes(c)))

  const dateKey = find('date', 'transaction date', 'posted')
  const descKey = find('description', 'details', 'transaction')
  const debitKey = find('debit', 'amount', 'withdrawal', 'debit')
  const creditKey = find('credit')

  if (!dateKey || !descKey || !debitKey) {
    const amtKey = find('amount', 'amt')
    if (!dateKey || !descKey || !amtKey) return null
    const rawAmount = parseNumber(row[amtKey])
    return buildTransaction(row[dateKey], row[descKey], rawAmount)
  }

  const credit = creditKey ? parseNumber(row[creditKey]) : 0
  const debit = parseNumber(row[debitKey])
  const amount = credit && !debit ? credit : (debit && !credit ? -debit : parseNumber(row[debitKey]))

  return buildTransaction(row[dateKey], row[descKey], amount)
}

function parseNumber(v) {
  if (v == null) return 0
  const cleaned = String(v).replace(/[^0-9.\-]/g, '')
  const n = parseFloat(cleaned)
  return isNaN(n) ? 0 : n
}

function buildTransaction(dateRaw, description, amount) {
  const date = (dateRaw || '').split('T')[0]
  return {
    id: 't_' + Math.random().toString(36).slice(2, 9),
    date: date || new Date().toISOString().slice(0, 10),
    description: (description || '').trim(),
    amount: Number(amount) || 0,
    category: null
  }
}
