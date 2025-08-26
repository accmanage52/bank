import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function RecordForm({ onSaved }) {
  const [form, setForm] = useState({
    name:'', account_no:'', ifsc:'', pan:'', aadhaar:'', mobile:'',
    date:'', card_number:'', expiry_date:'', cvv:''
  })
  const [files, setFiles] = useState({ pan:null, aadhaar:null, card:null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleFile = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] })

  const uploadFile = async (recordId, file, key) => {
    const ext = file.name.split('.').pop()
    const path = `records/${recordId}/${key}.${ext}`
    const { error: upErr } = await supabase.storage.from('kyc').upload(path, file, { upsert: true })
    if (upErr) throw upErr
    const { data: urlData } = await supabase.storage.from('kyc').getPublicUrl(path)
    return urlData.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      // create record without file URLs
      const { data: rec, error: insErr } = await supabase.from('records')
        .insert([{
          name: form.name,
          account_no: form.account_no,
          ifsc: form.ifsc,
          pan: form.pan,
          aadhaar: form.aadhaar,
          mobile: form.mobile,
          date: form.date || null,
          card_number: form.card_number,
          expiry_date: form.expiry_date,
          cvv: form.cvv
        }]).select().single()
      if (insErr) throw insErr

      const updates = {}
      if (files.pan)   updates.pan_image_url = await uploadFile(rec.id, files.pan, 'pan')
      if (files.aadhaar) updates.aadhaar_image_url = await uploadFile(rec.id, files.aadhaar, 'aadhaar')
      if (files.card)  updates.debit_card_image_url = await uploadFile(rec.id, files.card, 'card')

      if (Object.keys(updates).length) {
        const { error: upErr2 } = await supabase.from('records').update(updates).eq('id', rec.id)
        if (upErr2) throw upErr2
      }
      onSaved && onSaved()
      setForm({ name:'', account_no:'', ifsc:'', pan:'', aadhaar:'', mobile:'', date:'', card_number:'', expiry_date:'', cvv:'' })
      setFiles({ pan:null, aadhaar:null, card:null })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-2 gap-4">
      {error && <div className="col-span-2 text-red-400">{error}</div>}
      {['name','account_no','ifsc','pan','aadhaar','mobile','date','card_number','expiry_date','cvv'].map((k) => (
        <div key={k}>
          <label className="block mb-1 capitalize opacity-80">{k.replace('_',' ')}</label>
          <input className="input" name={k} value={form[k]} onChange={handleChange} placeholder={k==='date'?'YYYY-MM-DD':''} required={!(k==='date')} />
        </div>
      ))}
      <div>
        <label className="block mb-1">PAN Photo</label>
        <input type="file" name="pan" onChange={handleFile} className="input file:mr-3 file:py-2 file:px-3 file:rounded-lg" />
      </div>
      <div>
        <label className="block mb-1">Aadhaar Photo</label>
        <input type="file" name="aadhaar" onChange={handleFile} className="input file:mr-3 file:py-2 file:px-3 file:rounded-lg" />
      </div>
      <div>
        <label className="block mb-1">Debit Card Image</label>
        <input type="file" name="card" onChange={handleFile} className="input file:mr-3 file:py-2 file:px-3 file:rounded-lg" />
      </div>
      <div className="col-span-2">
        <button disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Record'}</button>
      </div>
    </form>
  )
}
