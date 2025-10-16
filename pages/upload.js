import { useRouter } from 'next/router'
import UploadForm from '../components/UploadForm'


export default function UploadPage(){
const router = useRouter()


function onImport(transactions){
// merge into localStorage
const prev = JSON.parse(localStorage.getItem('transactions') || '[]')
const merged = [...prev, ...transactions]
localStorage.setItem('transactions', JSON.stringify(merged))
router.push('/')
}


return (
<div className="max-w-3xl mx-auto p-4">
<h1 className="text-2xl font-bold">Upload Bank Statement</h1>
<p className="text-sm text-gray-600 mt-1">Upload a CSV exported from your bank. The parser will attempt to detect date, description and amount columns.</p>
<div className="mt-4">
<UploadForm onImport={onImport} />
</div>
</div>
)
}
