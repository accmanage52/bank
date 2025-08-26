import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabaseClient'
import VirtualDebitCard from '@/components/VirtualDebitCard'

export default function ClientDashboard() {
  const [user, setUser] = useState(null)
  const [records, setRecords] = useState([])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return window.location.href = '/client-login'
      setUser(user)
      const { data } = await supabase.from('records').select('*').eq('client_id', user.id).order('created_at', { ascending:false })
      setRecords(data || [])
    }
    init()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} role="client" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Assigned Data</h1>
        {(!records || records.length === 0) ? (
          <div className="card">No records assigned yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map(r => (
              <div key={r.id} className="card space-y-4">
                <VirtualDebitCard
                  name={r.name}
                  cardNumber={r.card_number}
                  expiry={r.expiry_date}
                  cvv={r.cvv}
                />
                <div className="text-sm space-y-1">
                  <div><span className="opacity-60">Account:</span> {r.account_no}</div>
                  <div><span className="opacity-60">IFSC:</span> {r.ifsc}</div>
                  <div><span className="opacity-60">PAN:</span> {r.pan}</div>
                  <div><span className="opacity-60">Aadhaar:</span> {r.aadhaar}</div>
                  <div><span className="opacity-60">Mobile:</span> {r.mobile}</div>
                  <div><span className="opacity-60">Date:</span> {r.date || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {r.pan_image_url && <a className="btn btn-outline" href={r.pan_image_url} target="_blank" rel="noreferrer">PAN</a>}
                  {r.aadhaar_image_url && <a className="btn btn-outline" href={r.aadhaar_image_url} target="_blank" rel="noreferrer">Aadhaar</a>}
                  {r.debit_card_image_url && <a className="btn btn-outline" href={r.debit_card_image_url} target="_blank" rel="noreferrer">Card</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
