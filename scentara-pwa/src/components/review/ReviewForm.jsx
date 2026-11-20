import { useEffect, useState } from 'react'
import { Send, X } from 'lucide-react'
import { StarInput } from './StarRating'

export default function ReviewForm({ onSubmit, editingReview, onCancelEdit, submitting }) {
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  // Saat masuk mode edit, isi form dengan data review yang di-edit
  useEffect(() => {
    if (editingReview) {
      setAuthor(editingReview.author)
      setRating(editingReview.rating)
      setComment(editingReview.comment)
      setError('')
    }
  }, [editingReview])

  const reset = () => {
    setAuthor('')
    setRating(0)
    setComment('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!author.trim()) return setError('Nama tidak boleh kosong.')
    if (rating < 1) return setError('Pilih rating bintang.')
    if (!comment.trim()) return setError('Ulasan tidak boleh kosong.')

    try {
      await onSubmit({ author: author.trim(), rating, comment: comment.trim() })
      if (!editingReview) reset()
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulasan.')
    }
  }

  const handleCancel = () => {
    reset()
    onCancelEdit?.()
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">
        {editingReview ? 'Edit ulasan' : 'Tulis ulasan'}
      </h3>

      <div className="review-form__field">
        <label htmlFor="review-author">Nama</label>
        <input
          id="review-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Namamu"
          maxLength={50}
          disabled={submitting}
        />
      </div>

      <div className="review-form__field">
        <label>Rating</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div className="review-form__field">
        <label htmlFor="review-comment">Ulasan</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagaimana menurutmu tentang parfum ini?"
          rows={3}
          maxLength={500}
          disabled={submitting}
        />
      </div>

      {error && <p className="review-form__error">{error}</p>}

      <div className="review-form__actions">
        <button type="submit" className="btn btn--dark btn--small" disabled={submitting}>
          <Send size={15} />
          {submitting ? 'Mengirim...' : editingReview ? 'Simpan perubahan' : 'Kirim ulasan'}
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

