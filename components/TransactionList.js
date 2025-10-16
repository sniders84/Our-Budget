export default function TransactionList({ transactions }) {
  if (!transactions.length) return <p className="text-gray-400">No transactions yet</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-gray-600">Description</th>
            <th className="px-4 py-2 text-left text-gray-600">Category</th>
            <th className="px-4 py-2 text-right text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx=>(
            <tr key={tx.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-2">{tx.date}</td>
              <td className="px-4 py-2">{tx.description}</td>
              <td className="px-4 py-2">{tx.category || 'Uncategorized'}</td>
              <td className="px-4 py-2 text-right font-medium">${tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}