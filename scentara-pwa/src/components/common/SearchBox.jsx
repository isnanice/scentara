import { Search } from 'lucide-react'

export default function SearchBox({ value, onChange, placeholder, label }) {
  return (
    <label className="search">
      <Search size={18} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}
