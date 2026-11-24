import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X, Search } from 'lucide-react'

/**
 * CustomDropdown: Komponen Dropdown Kustom dengan visual yang elegan,
 * konsisten dengan CategoryDropdown pada halaman Notes.
 *
 * Props:
 * - value: nilai terpilih saat ini
 * - onChange(value): handler saat opsi dipilih
 * - options: array of { value, label, count, icon, sublabel }
 * - placeholder: label ketika belum ada yang dipilih (misal: "Semua Kategori", "Urutkan")
 * - labelPrefix: teks awalan (misal: "Urutkan:", "Parfum:", "Rating:")
 * - icon: komponen ikon opsional di sisi kiri trigger
 * - headerTitle: judul di atas daftar opsi dropdown
 * - searchable: jika true, tampilkan kolom pencarian di dalam dropdown
 * - fullWidth: jika true, lebar penuh (cocok untuk formulir modal)
 * - alwaysPlaceholder: jika true, trigger selalu tampil sebagai teks biasa
 *   (tidak berubah warna hitam/aktif, tidak tampilkan nama opsi dipilih).
 *   Cocok untuk dropdown Urutkan yang ingin tetap tampil "Urutkan" saja.
 * - minWidth: string lebar minimal (opsional)
 */
export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih Opsi',
  labelPrefix = '',
  icon: IconComponent = null,
  headerTitle = '',
  searchable = false,
  fullWidth = false,
  minWidth = '220px',
  alwaysPlaceholder = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Jika alwaysPlaceholder, trigger selalu tampil sebagai teks placeholder saja
  const selectedOption = alwaysPlaceholder
    ? null
    : options.find((opt) => String(opt.value) === String(value))
  const isSelected = !alwaysPlaceholder &&
    value !== '' && value !== null && value !== undefined && value !== 0

  // Tutup dropdown saat klik di luar atau tekan tombol Escape
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
      if (searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 50)
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, searchable])

  const handleSelect = (optValue) => {
    onChange(optValue)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    const defaultOpt = options.find((opt) => opt.value === '' || opt.value === 0)
    onChange(defaultOpt ? defaultOpt.value : '')
    setIsOpen(false)
    setSearchQuery('')
  }

  // Filter opsi berdasarkan pencarian jika searchable aktif
  const filteredOptions = searchable && searchQuery.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options

  return (
    <div
      className={`cat-dropdown ${fullWidth ? 'cat-dropdown--full' : ''}`}
      ref={dropdownRef}
      style={{ minWidth: fullWidth ? '100%' : minWidth }}
    >
      {/* Tombol Pemicu Dropdown */}
      <button
        type="button"
        className={`cat-dropdown__trigger ${isOpen ? 'is-open' : ''} ${isSelected ? 'is-active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="cat-dropdown__trigger-content">
          {IconComponent && <IconComponent size={15} className="cat-dropdown__icon" aria-hidden="true" />}
          <span className="cat-dropdown__label">
            {selectedOption ? (
              <>
                {labelPrefix && `${labelPrefix} `}
                <strong>{selectedOption.label}</strong>
              </>
            ) : (
              placeholder
            )}
          </span>
        </span>

        <span className="cat-dropdown__trigger-actions">
          {isSelected && (
            <span
              role="button"
              tabIndex={0}
              className="cat-dropdown__clear-btn"
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
              title="Reset pilihan"
              aria-label="Reset pilihan"
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

      {/* Menu Opsi Melayang */}
      {isOpen && (
        <div className={`cat-dropdown__menu ${fullWidth ? 'cat-dropdown__menu--full' : ''}`} role="listbox" tabIndex={-1}>
          {/* Header Menu */}
          {(headerTitle || isSelected) && (
            <div className="cat-dropdown__menu-header">
              <span>{headerTitle || 'Pilih Opsi'}</span>
              {isSelected && (
                <button
                  type="button"
                  className="cat-dropdown__reset-link"
                  onClick={handleClear}
                >
                  Reset
                </button>
              )}
            </div>
          )}

          {/* Kolom Pencarian Cepat (opsional) */}
          {searchable && (
            <div className="cat-dropdown__search-box">
              <Search size={14} className="cat-dropdown__search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari dalam daftar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cat-dropdown__search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="cat-dropdown__search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* Daftar Opsi */}
          <div className="cat-dropdown__menu-list">
            {filteredOptions.length === 0 ? (
              <div className="cat-dropdown__empty">Tidak ada opsi ditemukan</div>
            ) : (
              filteredOptions.map((opt) => {
                const active = String(opt.value) === String(value)
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`cat-dropdown__item ${active ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="cat-dropdown__item-text">
                      <span className="cat-dropdown__item-name">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="cat-dropdown__item-sublabel">{opt.sublabel}</span>
                      )}
                    </div>

                    <div className="cat-dropdown__item-meta">
                      {opt.count !== undefined && (
                        <span className="cat-dropdown__count">{opt.count}</span>
                      )}
                      {active && <Check size={16} className="cat-dropdown__check" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
