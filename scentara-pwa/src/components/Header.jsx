import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

// Menu situs (tampil di layar lebar). Di HP, navigasi memakai Bottom Navigation Bar.
const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/notes', label: 'Notes' },
  { to: '/ulasan', label: 'Reviews' },
  { to: '/favorit', label: 'Favorites' },
  { to: '/profile', label: 'Profile' },
]

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/katalog?q=${encodeURIComponent(q)}` : '/katalog')
    setQuery('')
  }

  return (
    <>
      <header className="header">
        <div className="header__row">
          <Link to="/" className="header__logo" aria-label="Scentara, ke beranda">
            <img src="/logo-lockup-on-light.svg" alt="Scentara" width="187" height="40" />
          </Link>

          <form className="header__search" role="search" onSubmit={handleSubmit}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama parfum"
              aria-label="Cari nama parfum"
            />
            <button type="submit" aria-label="Cari">
              <Search size={18} />
            </button>
          </form>
        </div>

        <nav className="mainnav" aria-label="Menu situs">
          <ul>
            {NAV_ITEMS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  )
}
