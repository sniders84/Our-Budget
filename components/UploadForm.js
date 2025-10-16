import { useRef, useState } from 'react'
import { parseCSVFile } from '../lib/parser'


export default function UploadForm({ onImport }) {
const inputRef = useRef()
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)


async function handleFile(e) {
setError(null)
const file = e.target.files[0]
if (!file) return
setLoading(true)
try {
const tx = await parseCSVFile(file)
onImport(tx)
} catch (err) {
console.error(err)
setError('Failed to parse file — make sure it is a CSV with headers.')
} finally {
setLoading(false)
inputRef.current.value = ''
}
}


return (
<div>
<label className="block text-sm font-medium text-gray-700">Upload CSV</label>
<input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="mt-2" />
{loading && <p className="text-sm text-gray-500">Parsing...</p>}
{error && <p className="text-sm text-red-500">{error}</p>}
</div>
)
}
