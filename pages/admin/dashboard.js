import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabaseClient'
import RecordForm from '@/components/RecordForm'
import RecordTable from '@/components/RecordTable'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} role={role} />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Add New Entry</h2>
            <RecordForm onSaved={() => {}} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">View Records</h2>
            <RecordTable />
          </div>
        </div>
      </main>
    </div>
  )
}
