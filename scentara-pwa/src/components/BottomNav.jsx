import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Flower2, Heart, User } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

const ITEMS = [
  { to: '/', label: 'Beranda', icon: Home, end: true },
  { to: '/katalog', label: 'Katalog', icon: LayoutGrid },
  { to: '/notes', label: 'Notes', icon: Flower2 },
  { to: '/favorit', label: 'Favorit', icon: Heart, badge: true },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  const { ids } = useFavorites()

  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `bottom-nav__link${isActive ? ' is-active' : ''}`}
        >
          <span className="bottom-nav__icon">
            <Icon size={20} />
            {badge && ids.length > 0 && <span className="bottom-nav__badge">{ids.length}</span>}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
