import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X, Filter } from 'lucide-react'

export default function CategoryDropdown({ value, onChange, categories = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Total semua note
  const totalNotes = categories.reduce((acc, c) => acc + (c.count || 0), 0)

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (categoryName) => {
    onChange(categoryName)
    setIsOpen(false)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange('')
    setIsOpen(false)
  }

  return (
    <div className="cat-dropdown" ref={dropdownRef}>
      {/* Tombol Pemicu Dropdown */}
      <button
        type="button"
        className={`cat-dropdown__trigger ${isOpen ? 'is-open' : ''} ${value ? 'is-active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="cat-dropdown__trigger-content">
          <Filter size={15} className="cat-dropdown__icon" aria-hidden="true" />
          <span className="cat-dropdown__label">
            {value ? (
              <>
                Kategori: <strong>{value}</strong>
              </>
            ) : (
              'Semua Kategori'
            )}
          </span>
        </span>

        <span className="cat-dropdown__trigger-actions">
          {value && (
            <span
              role="button"
              tabIndex={0}
              className="cat-dropdown__clear-btn"
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
              title="Reset ke semua kategori"
              aria-label="Reset ke semua kategori"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`cat-dropdown__chevron ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Panel Menu Opsi Melayang */}
      {isOpen && (
        <div className="cat-dropdown__menu" role="listbox" tabIndex={-1}>
          <div className="cat-dropdown__menu-header">
            <span>Pilih Kategori Olfaktif</span>
            {value && (
              <button
                type="button"
                className="cat-dropdown__reset-link"
                onClick={handleClear}
              >
                Reset
              </button>
            )}
          </div>

          <div className="cat-dropdown__menu-list">
            {/* Opsi: Semua Kategori */}
            <button
              type="button"
              role="option"
              aria-selected={!value}
              className={`cat-dropdown__item ${!value ? 'is-selected' : ''}`}
              onClick={() => handleSelect('')}
            >
              <span className="cat-dropdown__item-name">Semua Kategori</span>
              <div className="cat-dropdown__item-meta">
                {totalNotes > 0 && <span className="cat-dropdown__count">{totalNotes}</span>}
                {!value && <Check size={16} className="cat-dropdown__check" />}
              </div>
            </button>

            <div className="cat-dropdown__divider" />

            {/* Daftar Kategori */}
            {categories.map((c) => {
              const isSelected = value === c.name
              return (
                <button
                  key={c.name}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`cat-dropdown__item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(c.name)}
                >
                  <span className="cat-dropdown__item-name">{c.name}</span>
                  <div className="cat-dropdown__item-meta">
                    <span className="cat-dropdown__count">{c.count}</span>
                    {isSelected && <Check size={16} className="cat-dropdown__check" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

