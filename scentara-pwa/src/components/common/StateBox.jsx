import { Loader, AlertCircle, SearchX } from 'lucide-react'

export function LoadingState({ text = 'Memuat data...' }) {
  return (
    <div className="state-box" role="status">
      <Loader size={26} className="spin" />
      <p>{text}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box state-box--error" role="alert">
      <AlertCircle size={26} />
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          Coba lagi
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="state-box">
      <SearchX size={26} />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}
