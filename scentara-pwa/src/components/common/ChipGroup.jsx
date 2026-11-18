// Deretan tombol filter. `value` kosong = "Semua".
export default function ChipGroup({ label, options, value, onChange, allLabel = 'Semua' }) {
  return (
    <div className="chip-group" role="group" aria-label={label}>
      <button
        type="button"
        className={`chip${value === '' ? ' chip--active' : ''}`}
        aria-pressed={value === ''}
        onClick={() => onChange('')}
      >
        {allLabel}
      </button>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`chip${value === option.value ? ' chip--active' : ''}`}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
