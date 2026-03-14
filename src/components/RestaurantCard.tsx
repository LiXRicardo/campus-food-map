import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Heart, Users } from 'lucide-react'
import { Restaurant } from '../types'
import { useStore } from '../store/useStore'
import { formatDistance } from '../utils/distance'
import { getBusinessStatus } from '../utils/businessHours'
import { getServicesByRestaurant } from '../data/queueService'

interface Props {
  restaurant: Restaurant
  compact?: boolean
}

export default function RestaurantCard({ restaurant: r, compact }: Props) {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useStore()
  const fav = isFavorite(r.id)
  const status = getBusinessStatus(r.businessHours)
  const waitingCount = getServicesByRestaurant(r.id).filter(q => q.status === 'waiting').length

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
      onClick={() => navigate(`/restaurant/${r.id}`)}
    >
      <div className="flex gap-3 p-3">
        <img
          src={r.coverImage}
          alt={r.name}
          className={`${compact ? 'w-20 h-20' : 'w-24 h-24'} rounded-lg object-cover flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm truncate">{r.name}</h3>
            <button
              onClick={e => { e.stopPropagation(); toggleFavorite(r.id) }}
              className="p-1 -mr-1"
            >
              <Heart
                size={18}
                className={fav ? 'fill-red-500 text-red-500' : 'text-gray-300'}
              />
            </button>
          </div>

          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{r.rating}</span>
            <span className="text-xs text-gray-400">({r.reviewCount})</span>
            <span className="text-xs text-gray-300 mx-1">|</span>
            <span className="text-xs text-primary-500">¥{r.avgPrice}/人</span>
          </div>

          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <MapPin size={12} />
            <span className="truncate">{r.address}</span>
            {r.distance != null && (
              <span className="flex-shrink-0 ml-auto">{formatDistance(r.distance)}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {r.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-50 text-primary-600">
                {tag}
              </span>
            ))}
            <span className="flex items-center gap-1 ml-auto">
              {waitingCount > 0 && (
                <span className="text-[10px] text-orange-600 flex items-center gap-0.5">
                  <Users size={10} />
                  {waitingCount}人排队
                </span>
              )}
              <span className={`text-[10px] ${status.color}`}>{status.text.split('·')[0]}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
