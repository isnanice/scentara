import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Search } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

// Menu situs (tampil di layar lebar). Di HP, navigasi memakai Bottom Navigation Bar.
const NAV_ITEMS = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/katalog', label: 'Katalog lengkap' },
  { to: '/brand', label: 'Per brand' },
  { to: '/aroma', label: 'Per profil aroma' },
  { to: '/notes', label: 'Notes' },
  { to: '/profile', label: 'Profile' },
]

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { ids } = useFavorites()

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

          <Link
            to="/favorit"
            className="header__fav"
            aria-label={`Favorit, ${ids.length} parfum tersimpan`}
          >
            <Heart size={22} />
            {ids.length > 0 && <span className="header__badge">{ids.length}</span>}
          </Link>
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
