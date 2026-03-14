import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { restaurants } from '../data/restaurants'
import { useStore } from '../store/useStore'
import RestaurantCard from '../components/RestaurantCard'
import EmptyState from '../components/EmptyState'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites, userReviews } = useStore()
  const [tab, setTab] = useState<'favorites' | 'reviews'>('favorites')

  const favoriteRestaurants = useMemo(
    () => restaurants.filter(r => favorites.includes(r.id)),
    [favorites]
  )

  const reviewedRestaurants = useMemo(() => {
    const ids = [...new Set(userReviews.map(r => r.restaurantId))]
    return restaurants.filter(r => ids.includes(r.id))
  }, [userReviews])

  const list = tab === 'favorites' ? favoriteRestaurants : reviewedRestaurants

  return (
    <div className="pb-20 min-h-screen bg-white">
      {/* 顶栏 */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-3 border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold text-base">我的收藏</h1>
        </div>

        {/* Tab */}
        <div className="flex gap-6 mt-3">
          {([['favorites', '收藏餐厅'], ['reviews', '评价过的']] as const).map(([key, label]) => (
            <button
              key={key}
              className={`pb-2 text-sm ${
                tab === key
                  ? 'text-primary-500 border-b-2 border-primary-500 font-medium'
                  : 'text-gray-400'
              }`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 列表 */}
      <div className="px-4 mt-3 space-y-3">
        {list.length === 0 ? (
          <EmptyState message={tab === 'favorites' ? '还没有收藏餐厅' : '还没有评价过餐厅'} />
        ) : (
          list.map(r => <RestaurantCard key={r.id} restaurant={r} />)
        )}
      </div>
    </div>
  )
}
