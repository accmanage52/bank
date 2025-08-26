import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(()=>{
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
        if (profile?.role === 'admin') window.location.href = '/admin/dashboard'
      }
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setError(error.message)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if (profile?.role === 'admin') window.location.href = '/admin/dashboard'
    else setError('Account is not an admin.')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-md mx-auto w-full px-4 py-14">
        <div className="card">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          {error && <div className="mb-3 text-red-400">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-3">
            <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" className="input" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className="btn btn-primary w-full">Login</button>
          </form>
        </div>
      </main>
    </div>
  )
}
