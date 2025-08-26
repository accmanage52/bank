import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function RecordTable() {
  const [records, setRecords] = useState([])
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data: recs, error: recErr } = await supabase.from('records').select('*').order('created_at', { ascending: false })
      if (recErr) throw recErr
      setRecords(recs || [])

      const { data: cls, error: clErr } = await supabase.from('profiles').select('id, email, role').eq('role', 'client').order('email')
      if (clErr) throw clErr
      setClients(cls || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let arr = records
    if (q) {
      arr = arr.filter(r =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.account_no || '').includes(q) ||
        (r.ifsc || '').toLowerCase().includes(q)
      )
    }
    arr = [...arr].sort((a,b) => {
      const A = a[sortKey] || ''
      const B = b[sortKey] || ''
      if (A < B) return sortDir==='asc' ? -1 : 1
      if (A > B) return sortDir==='asc' ? 1 : -1
      return 0
    })
    return arr
  }, [records, search, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const handleAssign = async (recordId, clientId) => {
    const { error } = await supabase.from('records').update({ client_id: clientId }).eq('id', recordId)
    if (!error) fetchAll()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return
    const { error } = await supabase.from('records').delete().eq('id', id)
    if (!error) fetchAll()
  }

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
        <input className="input md:w-80" placeholder="Search name / account / IFSC" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <div className="text-sm opacity-70">Total: {filtered.length}</div>
      </div>

      {loading ? <div>Loading...</div> : error ? <div className="text-red-400">{error}</div> : (
        <div className="overflow-auto">
          <table className="table text-sm">
            <thead>
              <tr>
                {['name','account_no','ifsc','date','created_at'].map(h => (
                  <th key={h} className="th cursor-pointer" onClick={()=>toggleSort(h)}>
                    {h.replace('_',' ')}
                  </th>
                ))}
                <th className="th">assign</th>
                <th className="th">actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="td">{r.name}</td>
                  <td className="td">{r.account_no}</td>
                  <td className="td">{r.ifsc}</td>
                  <td className="td">{r.date || '-'}</td>
                  <td className="td">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="td">
                    <select className="input" defaultValue={r.client_id || ''} onChange={(e)=>handleAssign(r.id, e.target.value || null)}>
                      <option value="">— unassigned —</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.email}</option>)}
                    </select>
                  </td>
                  <td className="td">
                    <div className="flex gap-2">
                      <a className="btn btn-outline" href={`/admin/edit/${r.id}`}>edit</a>
                      <button className="btn btn-outline" onClick={()=>handleDelete(r.id)}>delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
