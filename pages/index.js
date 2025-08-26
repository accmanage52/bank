import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">secure client banking data manager</h1>
            <p className="mt-5 opacity-80">Admin can add, manage and assign data to clients. Clients get a sleek, virtual debit card view with all assigned details.</p>
            <div className="mt-8 flex gap-3">
              <Link className="btn btn-primary" href="/admin-login">admin login</Link>
              <Link className="btn btn-outline" href="/client-login">client login</Link>
            </div>
          </div>
          <div className="card">
            <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop" alt="hero" className="rounded-xl" />
          </div>
        </section>
      </main>
      <footer className="text-center py-6 opacity-60">© {new Date().getFullYear()} bankvault</footer>
    </div>
  )
}
