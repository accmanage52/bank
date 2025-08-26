import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'

export default function ClientLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(()=>{
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        window.location.href = '/client/dashboard'
      }
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setError(error.message)
    window.location.href = '/client/dashboard'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-md mx-auto w-full px-4 py-14">
        <div className="card">
          <h1 className="text-2xl font-bold mb-4">Client Login</h1>
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
