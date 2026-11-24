import { useEffect, useState, useRef } from 'react'
import { Send, X, Camera, Image as ImageIcon, Trash2, UploadCloud } from 'lucide-react'
import { StarInput } from './StarRating'
import { useProfile } from '../../hooks/useProfile'

export default function ReviewForm({ onSubmit, editingReview, onCancelEdit, submitting }) {
  const { profile } = useProfile()
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // Saat mode edit, isi form dengan data review terpilih
  useEffect(() => {
    if (editingReview) {
      setAuthor(editingReview.author || '')
      setRating(Number(editingReview.rating) || 5)
      setComment(editingReview.comment || '')
      setImageUrl(editingReview.image_url || '')
      setError('')
    } else {
      // Saat buat baru, otomatis isi nama dari profil pengguna
      setAuthor(profile?.name || '')
      setRating(5)
      setComment('')
      setImageUrl('')
      setError('')
    }
  }, [editingReview, profile?.name])

  const reset = () => {
    setAuthor(profile?.name || '')
    setRating(5)
    setComment('')
    setImageUrl('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Harap pilih file gambar (JPG, PNG, atau WebP).')
      return
    }

    // Maksimal 3MB untuk menjaga performa
    if (file.size > 3 * 1024 * 1024) {
      setError('Ukuran foto terlalu besar. Maksimal 3MB.')
      return
    }

    setError('')
    const reader = new FileReader()
    reader.onload = (event) => {
      setImageUrl(event.target.result)
    }
    reader.onerror = () => {
      setError('Gagal membaca file gambar.')
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setImageUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!author.trim()) return setError('Nama penulis tidak boleh kosong.')
    if (rating < 1 || rating > 5) return setError('Pilih rating bintang (1-5).')
    if (!comment.trim()) return setError('Ulasan tidak boleh kosong.')

    try {
      await onSubmit({
        author: author.trim(),
        rating,
        comment: comment.trim(),
        image_url: imageUrl || '',
      })
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

      {/* UPLOAD FOTO REVIEW */}
      <div className="review-form__field">
        <label>Foto Parfum / Botol (Opsional)</label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={submitting}
          id="review-photo-input"
        />

        {imageUrl ? (
          <div className="review-upload-preview">
            <div className="review-upload-thumb">
              <img src={imageUrl} alt="Pratinjau foto ulasan" />
            </div>
            <div className="review-upload-info">
              <span className="review-upload-status">Foto siap dilampirkan</span>
              <button
                type="button"
                className="review-upload-remove-btn"
                onClick={handleRemovePhoto}
                disabled={submitting}
              >
                <Trash2 size={13} /> Hapus foto
              </button>
            </div>
          </div>
        ) : (
          <div
            className="review-upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            <div className="review-upload-dropzone__icon">
              <Camera size={22} />
            </div>
            <div className="review-upload-dropzone__text">
              <strong>Klik untuk unggah foto</strong>
              <span>Format JPG, PNG, atau WebP (Maks. 3MB)</span>
            </div>
          </div>
        )}
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
