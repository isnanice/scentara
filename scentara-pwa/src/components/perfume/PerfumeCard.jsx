import { Link } from 'react-router-dom'
import FavoriteButton from '../common/FavoriteButton.jsx'
import ImageWithFallback from '../common/ImageWithFallback.jsx'
import { formatRupiah } from '../../utils/helpers'

export default function PerfumeCard({ perfume, layer }) {
  return (
    <li className="p-card">
      <div className="p-card__media">
        <ImageWithFallback src={perfume.image_url} alt={perfume.name} />
      </div>
      <FavoriteButton id={perfume.id} name={perfume.name} className="p-card__fav" />

      <div className="p-card__body">
        <p className="p-card__brand">{perfume.brands?.name}</p>
        <h3 className="p-card__name">{perfume.name}</h3>
        <p className="p-card__meta">{perfume.concentration}</p>
        <p className="p-card__scents">
          {perfume.scent_profiles?.length > 0 ? perfume.scent_profiles.join(', ') : '\u00A0'}
        </p>
        {layer && <span className="layer-tag">{layer} note</span>}
        <p className="p-card__price">{formatRupiah(perfume.price)}</p>

        <Link
          to={`/parfum/${perfume.id}`}
          className="btn btn--dark btn--block stretched-link"
          aria-label={`Lihat detail ${perfume.name}`}
        >
          Lihat detail
        </Link>
      </div>
    </li>
  )
}
