export default function TransactionList({ transactions = [], onDelete, onChangeCategory }) {
return (
<div className="mt-4">
<div className="overflow-x-auto">
<table className="min-w-full bg-white">
<thead>
<tr>
<th className="px-4 py-2">Date</th>
<th className="px-4 py-2">Description</th>
<th className="px-4 py-2">Amount</th>
<th className="px-4 py-2">Category</th>
<th className="px-4 py-2">Actions</th>
</tr>
</thead>
<tbody>
{transactions.map(tx => (
<tr key={tx.id} className="border-t">
<td className="px-4 py-2">{tx.date}</td>
<td className="px-4 py-2">{tx.description}</td>
<td className="px-4 py-2">{tx.amount.toFixed(2)}</td>
<td className="px-4 py-2">
<input className="border p-1 text-sm" value={tx.category || ''} onChange={(e)=>onChangeCategory(tx.id, e.target.value)} placeholder="uncategorized" />
</td>
<td className="px-4 py-2">
<button className="text-sm text-red-600" onClick={()=>onDelete(tx.id)}>Delete</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
)
}
