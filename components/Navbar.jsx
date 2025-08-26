import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar({ user, role }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="w-full sticky top-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl">
          <span className="text-credTeal">bank</span>vault
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="badge">{role || 'user'}</span>
              <button onClick={handleLogout} className="btn btn-outline">logout</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link className="btn btn-outline" href="/client-login">client login</Link>
              <Link className="btn btn-primary" href="/admin-login">admin login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
