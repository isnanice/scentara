import { useState, useRef } from 'react'
import { Pencil, Camera, Trash2, Check, X, Sparkles, User } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'

export default function ProfileSection() {
  const { profile, updateProfile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [notice, setNotice] = useState('')
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    avatarUrl: '',
    favoriteScent: '',
    bio: '',
  })

  const showNotification = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3000)
  }

  const handleStartEdit = () => {
    setFormData({
      name: profile.name || '',
      avatarUrl: profile.avatarUrl || '',
      favoriteScent: profile.favoriteScent || '',
      bio: profile.bio || '',
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi ukuran foto maksimal 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Silakan pilih foto di bawah 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatarUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Nama tidak boleh kosong.')
      return
    }

    updateProfile(formData)
    showNotification('Profil berhasil disimpan!')
    setIsEditing(false)
  }

  // Ambil inisial nama jika foto tidak ada
  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <section className="profile-section">
      {notice && (
        <div className="profile-notice" role="status">
          <Check size={18} /> {notice}
        </div>
      )}

      {/* MODE EDIT PROFIL */}
      {isEditing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-form__head">
            <h2 className="profile-form__title">Edit Profil Pengguna</h2>
            <p className="profile-form__sub">Perbarui foto avatar, aroma favorit, dan deskripsi personal Anda.</p>
          </div>

          {/* UPLOAD & HAPUS FOTO */}
          <div className="profile-photo-editor">
            <div className="profile-avatar profile-avatar--edit">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Preview Foto"
                  className="profile-avatar__img"
                />
              ) : (
                <span className="profile-avatar__text">{getInitials(formData.name)}</span>
              )}
            </div>

            <div className="profile-photo-controls">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="photo-upload-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn--sm btn--outline"
              >
                <Camera size={15} /> Ganti Foto dari Perangkat
              </button>

              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="btn btn--sm btn--danger-outline"
                >
                  <Trash2 size={15} /> Hapus Foto (Pakai Inisial)
                </button>
              )}
              <span className="profile-photo-tip">
                Mendukung file JPG, PNG, atau WebP (maks. 2MB). Jika dihapus, inisial nama Anda akan tampil otomatis.
              </span>
            </div>
          </div>

          <div className="profile-form__grid">
            <div className="form-group form-group--full">
              <label htmlFor="p-name">Nama Lengkap *</label>
              <input
                id="p-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama Anda"
                required
              />
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="p-scent">Aroma Favorit / Signature Scent</label>
              <input
                id="p-scent"
                type="text"
                value={formData.favoriteScent}
                onChange={(e) => setFormData({ ...formData, favoriteScent: e.target.value })}
                placeholder="Contoh: Woody, Amber, Citrus"
              />
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="p-bio">Bio / Deskripsi Singkat</label>
              <textarea
                id="p-bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Ceritakan preferensi wewangian atau catatan pribadi Anda..."
              />
            </div>
          </div>

          <div className="profile-form__actions">
            <button type="submit" className="btn btn--primary">
              <Check size={16} /> Simpan Perubahan
            </button>
            <button type="button" onClick={handleCancel} className="btn btn--outline">
              <X size={16} /> Batal
            </button>
          </div>
        </form>
      ) : (
        /* MODE TAMPILAN PROFIL (READ) */
        <article className="profile-card">
          <div className="profile-card__main">
            <div className="profile-avatar">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="profile-avatar__img"
                />
              ) : (
                <span className="profile-avatar__text">{getInitials(profile.name)}</span>
              )}
            </div>

            <div className="profile-card__info">
              <div className="profile-card__name-row">
                <h2 className="profile-card__name">{profile.name}</h2>
                <span className="profile-badge">
                  <User size={13} /> Penikmat Wewangian
                </span>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="btn btn--sm btn--primary profile-card__edit-btn"
                  aria-label="Edit Profil"
                >
                  <Pencil size={14} /> Edit Profil
                </button>
              </div>

              {profile.favoriteScent && (
                <div className="profile-card__scent-badge">
                  <Sparkles size={15} />
                  <span><strong>Signature Scent:</strong> {profile.favoriteScent}</span>
                </div>
              )}

              <p className="profile-card__bio">
                {profile.bio || 'Belum ada deskripsi profil.'}
              </p>
            </div>
          </div>
        </article>
      )}
    </section>
  )
}
