import Charts from './Charts'

export default function OverviewTab() {
  const dummyData = [
    { name: 'Groceries', value: 400 },
    { name: 'Rent', value: 1200 },
    { name: 'Entertainment', value: 150 },
    { name: 'Transport', value: 100 },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Net Worth</h2>
        <div className="text-3xl font-bold">$5,250</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Spending by Category</h2>
        <Charts type="pie" data={dummyData} />
      </div>
    </div>
  )
}
