import { useEffect, useState } from 'react'
import { Send, X } from 'lucide-react'
import { StarInput } from './StarRating'
import { useProfile } from '../../hooks/useProfile'

export default function ReviewForm({ onSubmit, editingReview, onCancelEdit, submitting }) {
  const { profile } = useProfile()
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  // Saat mode edit, isi form dengan data review terpilih
  useEffect(() => {
    if (editingReview) {
      setAuthor(editingReview.author || '')
      setRating(Number(editingReview.rating) || 5)
      setComment(editingReview.comment || '')
      setError('')
    } else {
      // Saat buat baru, otomatis isi nama dari profil pengguna
      setAuthor(profile?.name || '')
      setRating(5)
      setComment('')
      setError('')
    }
  }, [editingReview, profile?.name])

  const reset = () => {
    setAuthor(profile?.name || '')
    setRating(5)
    setComment('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!author.trim()) return setError('Nama penulis tidak boleh kosong.')
    if (rating < 1 || rating > 5) return setError('Pilih rating bintang (1-5).')
    if (!comment.trim()) return setError('Ulasan tidak boleh kosong.')

    try {
      await onSubmit({ author: author.trim(), rating, comment: comment.trim() })
      if (!editingReview) reset()
    } catch (err) {
      setError(err.message || 'Gagal menyimpan ulasan.')
    }
  }

  const handleCancel = () => {
    reset()
    onCancelEdit?.()
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">
        {editingReview ? 'Perbarui Ulasan (Update)' : 'Tulis Ulasan (Create)'}
      </h3>

      <div className="review-form__field">
        <label htmlFor="review-author">Nama Pengulas *</label>
        <input
          id="review-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Nama Anda"
          maxLength={50}
          disabled={submitting}
          required
        />
      </div>

      <div className="review-form__field">
        <label>Rating Kepuasan (1–5 Bintang) *</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div className="review-form__field">
        <label htmlFor="review-comment">Ulasan Lengkap *</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagaimana impresi aroma, daya tahan (longevity), dan proyeksi parfum ini?"
          rows={3}
          maxLength={500}
          disabled={submitting}
          required
        />
      </div>

      {error && <p className="review-form__error">{error}</p>}

      <div className="review-form__actions">
        <button type="submit" className="btn btn--dark btn--small" disabled={submitting}>
          <Send size={15} />
          {submitting ? 'Menyimpan...' : editingReview ? 'Simpan Perubahan' : 'Kirim Ulasan'}
        </button>
        {editingReview && (
          <button type="button" className="btn btn--ghost btn--small" onClick={handleCancel} disabled={submitting}>
            <X size={15} /> Batal
          </button>
        )}
      </div>
    </form>
  )
}
