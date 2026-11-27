import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowLeftRight,
  Check,
  ExternalLink,
  GitCompareArrows,
  Sparkles,
  Tag,
} from 'lucide-react'
import { usePerfumes, usePerfumeById } from '../hooks/usePerfumes'
import CustomDropdown from '../components/common/CustomDropdown.jsx'
import ImageWithFallback from '../components/common/ImageWithFallback.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateBox.jsx'
import { formatRupiah } from '../utils/helpers'

const NOTE_LAYERS = [
  { key: 'top', title: 'Top Notes', hint: 'Tercium pertama saat disemprot, cepat memudar' },
  { key: 'middle', title: 'Middle Notes', hint: 'Inti aroma setelah top notes memudar' },
  { key: 'base', title: 'Base Notes', hint: 'Dasar aroma yang menempel paling lama di kulit' },
]

function collectAllNotes(perfume) {
  if (!perfume?.notes) return []
  return [
    ...(perfume.notes.top ?? []),
    ...(perfume.notes.middle ?? []),
    ...(perfume.notes.base ?? []),
  ]
}

export default function ComparePage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const p1Id = params.get('p1') ?? ''
  const p2Id = params.get('p2') ?? ''

  const { perfumes, loading: listLoading } = usePerfumes()
  const {
    perfume: perfume1,
    loading: loading1,
    error: error1,
    refetch: refetch1,
  } = usePerfumeById(p1Id)
  const {
    perfume: perfume2,
    loading: loading2,
    error: error2,
    refetch: refetch2,
  } = usePerfumeById(p2Id)

  const perfumeOptions = useMemo(
    () =>
      perfumes.map((p) => ({
        value: p.id,
        label: p.name,
        sublabel: `${p.brands?.name || 'Artisanal'} • ${formatRupiah(p.price)}`,
      })),
    [perfumes],
  )

  const handleSelect = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const handleSwap = () => {
    const next = new URLSearchParams(params)
    if (p2Id) next.set('p1', p2Id)
    else next.delete('p1')
    if (p1Id) next.set('p2', p1Id)
    else next.delete('p2')
    setParams(next, { replace: true })
  }

  // Hitung notes yang dimiliki oleh kedua parfum (matching by id atau nama)
  const { sharedKeys, sharedNotesList } = useMemo(() => {
    if (!perfume1 || !perfume2) return { sharedKeys: new Set(), sharedNotesList: [] }
    const notes1 = collectAllNotes(perfume1)
    const notes2 = collectAllNotes(perfume2)

    const keys1 = new Set(notes1.flatMap((n) => [n.id, n.name?.toLowerCase()].filter(Boolean)))
    const matchedKeys = new Set()
    const seenIds = new Set()
    const list = []

    for (const n of notes2) {
      const nameLower = n.name?.toLowerCase()
      if (keys1.has(n.id) || (nameLower && keys1.has(nameLower))) {
        if (n.id) matchedKeys.add(n.id)
        if (nameLower) matchedKeys.add(nameLower)
        if (!seenIds.has(n.id || nameLower)) {
          seenIds.add(n.id || nameLower)
          list.push(n)
        }
      }
    }
    return { sharedKeys: matchedKeys, sharedNotesList: list }
  }, [perfume1, perfume2])

  const sharedProfiles = useMemo(() => {
    if (!perfume1?.scent_profiles || !perfume2?.scent_profiles) return new Set()
    const set1 = new Set(perfume1.scent_profiles.map((s) => s.toLowerCase()))
    return new Set(
      perfume2.scent_profiles.filter((s) => set1.has(s.toLowerCase())).map((s) => s.toLowerCase()),
    )
  }, [perfume1, perfume2])

  const priceComparison = useMemo(() => {
    if (!perfume1 || !perfume2) return null
    const price1 = Number(perfume1.price) || 0
    const price2 = Number(perfume2.price) || 0
    const diff = Math.abs(price1 - price2)
    if (diff === 0) {
      return { cheaperId: null, diff: 0, text: 'Kedua parfum memiliki harga yang sama.' }
    }
    const cheaper = price1 < price2 ? perfume1 : perfume2
    return {
      cheaperId: cheaper.id,
      diff,
      text: `${cheaper.name} lebih hemat ${formatRupiah(diff)}`,
    }
  }, [perfume1, perfume2])

  const isSamePerfume = Boolean(p1Id && p2Id && p1Id === p2Id)
  const isComparing = Boolean(perfume1 && perfume2 && !isSamePerfume)
  const isLoadingDetails = (p1Id && loading1) || (p2Id && loading2)

  // Pasangan cepat jika user baru membuka halaman dan ingin langsung mencoba
  const quickPair = useMemo(() => {
    if (perfumes.length < 2) return null
    return { p1: perfumes[0], p2: perfumes[1] }
  }, [perfumes])

  return (
    <div className="compare-page">
      <button
        type="button"
        className="back-link"
        onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'))}
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      {/* HEADER */}
      <div className="page-head">
        <span className="page-head__badge">Perbandingan Aroma & Harga</span>
        <h1>Bandingkan Parfum</h1>
        <p className="lede">
          Pilih dua parfum dari katalog untuk membandingkan brand, harga, profil aroma, serta lapisan
          Top, Middle, dan Base Notes secara berdampingan.
        </p>
      </div>

      {/* 1. PEMILIHAN DUA PARFUM DARI KATALOG */}
      <section className="compare-selector-card" aria-label="Pilih dua parfum untuk dibandingkan">
        <div className="compare-selector-slot">
          <span className="compare-selector-label">Parfum Pertama</span>
          <CustomDropdown
            value={p1Id}
            onChange={(val) => handleSelect('p1', val)}
            options={perfumeOptions}
            placeholder={listLoading ? 'Memuat katalog...' : 'Pilih parfum pertama...'}
            searchable
            fullWidth
            headerTitle="Pilih Parfum 1"
          />
        </div>

        <button
          type="button"
          className="compare-swap-btn"
          onClick={handleSwap}
          disabled={!p1Id && !p2Id}
          title="Tukar posisi parfum"
          aria-label="Tukar posisi parfum"
        >
          <ArrowLeftRight size={18} />
        </button>

        <div className="compare-selector-slot">
          <span className="compare-selector-label">Parfum Kedua</span>
          <CustomDropdown
            value={p2Id}
            onChange={(val) => handleSelect('p2', val)}
            options={perfumeOptions}
            placeholder={listLoading ? 'Memuat katalog...' : 'Pilih parfum kedua...'}
            searchable
            fullWidth
            headerTitle="Pilih Parfum 2"
          />
        </div>
      </section>

      {/* STATE HANDLING */}
      {isSamePerfume && (
        <EmptyState
          title="Kamu memilih parfum yang sama"
          text="Silakan pilih dua parfum yang berbeda untuk melihat perbandingan notes dan keunggulannya."
        />
      )}

      {!isSamePerfume && (!p1Id || !p2Id) && (
        <EmptyState
          title="Pilih dua parfum untuk mulai membandingkan"
          text="Gunakan dropdown di atas untuk memilih Parfum Pertama dan Parfum Kedua dari katalog Scentara."
          action={
            quickPair && (
              <button
                type="button"
                className="btn btn--dark"
                onClick={() =>
                  setParams({ p1: quickPair.p1.id, p2: quickPair.p2.id }, { replace: true })
                }
              >
                <GitCompareArrows size={16} /> Contoh: {quickPair.p1.name} vs {quickPair.p2.name}
              </button>
            )
          }
        />
      )}

      {!isSamePerfume && isLoadingDetails && <LoadingState text="Memuat detail & piramida notes kedua parfum..." />}

      {error1 && <ErrorState message={`Gagal memuat parfum pertama: ${error1}`} onRetry={refetch1} />}
      {error2 && <ErrorState message={`Gagal memuat parfum kedua: ${error2}`} onRetry={refetch2} />}

      {/* HASIL PERBANDINGAN BERDAMPINGAN */}
      {isComparing && !isLoadingDetails && (
        <div className="compare-results">
          {/* RINGKASAN KESAMAAN & HARGA */}
          <section className="compare-summary" aria-label="Ringkasan perbandingan">
            <div className="compare-summary__stats">
              <div className="compare-summary__stat">
                <Sparkles size={16} className="compare-summary__icon" />
                <div>
                  <span className="compare-summary__label">Kesamaan Kandungan Notes</span>
                  <strong className="compare-summary__value">
                    {sharedNotesList.length > 0
                      ? `${sharedNotesList.length} Fragrance Notes Sama`
                      : 'Tidak ada notes yang sama'}
                  </strong>
                </div>
              </div>

              {priceComparison && (
                <div className="compare-summary__stat">
                  <Tag size={16} className="compare-summary__icon" />
                  <div>
                    <span className="compare-summary__label">Perbandingan Harga</span>
                    <strong className="compare-summary__value">{priceComparison.text}</strong>
                  </div>
                </div>
              )}
            </div>

            {sharedNotesList.length > 0 && (
              <div className="compare-summary__shared-list">
                <span className="compare-summary__shared-title">Notes yang dimiliki keduanya:</span>
                <div className="compare-summary__shared-chips">
                  {sharedNotesList.map((n) => (
                    <Link
                      key={n.id || n.name}
                      to={`/notes/${n.id}`}
                      className="compare-note-pill compare-note-pill--shared"
                    >
                      <Check size={12} aria-hidden="true" />
                      <span>{n.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <p className="compare-summary__legend">
              <span className="compare-legend-badge">
                <Check size={11} /> Sama
              </span>{' '}
              menandakan note tersebut dimiliki oleh kedua parfum.
            </p>
          </section>

          {/* 2. NAMA, BRAND, HARGA & PROFIL BERDAMPINGAN */}
          <section className="compare-cards-grid" aria-label="Perbandingan identitas dan harga parfum">
            {[perfume1, perfume2].map((item, idx) => {
              const isCheaper = priceComparison?.cheaperId === item.id
              return (
                <article key={item.id} className="compare-perfume-card">
                  <div className="compare-perfume-card__top">
                    <span className="compare-perfume-card__slot">Parfum {idx + 1}</span>
                    {isCheaper && <span className="compare-cheaper-badge">Lebih Hemat</span>}
                  </div>

                  <div className="compare-perfume-card__media">
                    <ImageWithFallback src={item.image_url} alt={item.name} />
                  </div>

                  <div className="compare-perfume-card__body">
                    <Link
                      to={`/katalog?brand=${item.brands?.slug ?? ''}`}
                      className="compare-perfume-card__brand"
                    >
                      {item.brands?.name || 'Artisanal Brand'}
                    </Link>
                    <h2 className="compare-perfume-card__name">{item.name}</h2>
                    <p className="compare-perfume-card__meta">{item.concentration}</p>
                    <p className="compare-perfume-card__price">{formatRupiah(item.price)}</p>

                    <ul className="compare-perfume-card__profiles" aria-label="Profil aroma">
                      {(item.scent_profiles ?? []).map((profile) => {
                        const isSharedProfile = sharedProfiles.has(profile.toLowerCase())
                        return (
                          <li
                            key={profile}
                            className={`compare-profile-chip${isSharedProfile ? ' is-shared' : ''}`}
                          >
                            {isSharedProfile && <Check size={11} aria-hidden="true" />}
                            {profile}
                          </li>
                        )
                      })}
                    </ul>

                    <Link to={`/parfum/${item.id}`} className="btn btn--ghost btn--small compare-detail-link">
                      Lihat detail <ExternalLink size={14} />
                    </Link>
                  </div>
                </article>
              )
            })}
          </section>

          {/* 3 & 4 & 5. PERBANDINGAN FRAGRANCE NOTES (TOP, MIDDLE, BASE) BERDAMPINGAN */}
          <section className="compare-notes-section" aria-label="Perbandingan fragrance notes">
            <h2 className="section__title">Perbandingan Fragrance Notes</h2>
            <p className="section__sub">
              Ketuk note untuk melihat detail aromanya. Note dengan penanda hijau dimiliki oleh kedua parfum.
            </p>

            <div className="compare-layers">
              {NOTE_LAYERS.map((layer) => {
                const list1 = perfume1.notes?.[layer.key] ?? []
                const list2 = perfume2.notes?.[layer.key] ?? []

                return (
                  <div key={layer.key} className={`compare-layer compare-layer--${layer.key}`}>
                    <div className="compare-layer__head">
                      <h3>{layer.title}</h3>
                      <span>{layer.hint}</span>
                    </div>

                    <div className="compare-layer__columns">
                      {[
                        { perfume: perfume1, notes: list1 },
                        { perfume: perfume2, notes: list2 },
                      ].map((col) => (
                        <div key={col.perfume.id} className="compare-layer__col">
                          <span className="compare-layer__col-title">{col.perfume.name}</span>
                          {col.notes.length === 0 ? (
                            <p className="compare-layer__empty">Tidak ada data notes</p>
                          ) : (
                            <ul className="compare-layer__notes">
                              {col.notes.map((note) => {
                                const isShared =
                                  sharedKeys.has(note.id) ||
                                  (note.name && sharedKeys.has(note.name.toLowerCase()))
                                return (
                                  <li key={note.id || note.name}>
                                    <Link
                                      to={`/notes/${note.id}`}
                                      className={`compare-note-pill${isShared ? ' compare-note-pill--shared' : ''}`}
                                    >
                                      <span>{note.name}</span>
                                      {isShared && (
                                        <span className="compare-note-badge">
                                          <Check size={11} aria-hidden="true" /> Sama
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

