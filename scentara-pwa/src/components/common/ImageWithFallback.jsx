import { useState } from 'react'

// Foto produk berasal dari situs brand. Kalau gagal dimuat, tampilkan huruf awal nama.
export default function ImageWithFallback({ src, alt, className }) {
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return (
      <span className={`img-fallback ${className || ''}`} role="img" aria-label={alt}>
        {alt?.charAt(0) || '?'}
      </span>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}
