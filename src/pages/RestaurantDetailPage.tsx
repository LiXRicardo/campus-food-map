import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Heart, Star, MapPin, Phone, Clock, ChevronRight, Share2,
  ShieldCheck, Radio, Ticket, Users,
} from 'lucide-react'
import { restaurants } from '../data/restaurants'
import { getReviewsByRestaurant } from '../data/reviews'
import { getServicesByRestaurant } from '../data/queueService'
import { useStore } from '../store/useStore'
import { getBusinessStatus } from '../utils/businessHours'
import StarRating from '../components/StarRating'

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite, userReviews, showToast } = useStore()

  const restaurant = restaurants.find(r => r.id === id)
  const [imgIndex, setImgIndex] = useState(0)

  const allReviews = useMemo(() => {
    if (!id) return []
    const mockReviews = getReviewsByRestaurant(id)
    const localReviews = userReviews.filter(r => r.restaurantId === id)
    return [...localReviews, ...mockReviews]
  }, [id, userReviews])

  const queueServices = useMemo(() => {
    if (!id) return []
    return getServicesByRestaurant(id)
  }, [id])

  const waitingServices = queueServices.filter(q => q.status === 'waiting')

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        餐厅不存在
      </div>
    )
  }

  const r = restaurant
  const fav = isFavorite(r.id)
  const status = getBusinessStatus(r.businessHours)

  return (
    <div className="pb-24">
      {/* 图片轮播 */}
      <div className="relative">
        <img
          src={r.images[imgIndex]}
          alt={r.name}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* 顶部按钮 */}
        <div className="absolute top-10 left-4 right-4 flex justify-between">
          <button
            className="bg-black/30 backdrop-blur rounded-full p-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button
              className="bg-black/30 backdrop-blur rounded-full p-2"
              onClick={() => showToast('链接已复制', 'info')}
            >
              <Share2 size={20} className="text-white" />
            </button>
            <button
              className="bg-black/30 backdrop-blur rounded-full p-2"
              onClick={() => toggleFavorite(r.id)}
            >
              <Heart
                size={20}
                className={fav ? 'fill-red-500 text-red-500' : 'text-white'}
              />
            </button>
          </div>
        </div>

        {/* 图片指示器 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {r.images.map((_, i) => (
            <button
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === imgIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setImgIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* 基本信息 */}
      <div className="px-4 pt-4">
        <h1 className="text-lg font-bold">{r.name}</h1>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{r.rating}</span>
          </div>
          <span className="text-xs text-gray-400">{r.reviewCount}条评价</span>
          <span className="text-xs text-primary-500 ml-auto">¥{r.avgPrice}/人</span>
        </div>

        <div className="flex gap-1.5 mt-2 flex-wrap">
          {r.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3">{r.description}</p>
      </div>

      {/* 实时排队状态 */}
      {waitingServices.length > 0 && (
        <div className="mx-4 mt-4 bg-orange-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Radio size={14} className="text-orange-500" />
            <span className="text-sm font-medium text-orange-700">实时排队</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full animate-pulse">
              LIVE
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">当前等待</p>
              <p className="text-xl font-bold text-orange-600">
                {waitingServices.length}人
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">预计等待</p>
              <p className="text-xl font-bold text-orange-600">
                {waitingServices[0]?.estimatedWait || 0}分钟
              </p>
            </div>
            <button
              className="bg-orange-500 text-white text-xs px-3 py-2 rounded-full flex items-center gap-1"
              onClick={() => navigate('/queue-service')}
            >
              <Ticket size={12} />
              代取号
            </button>
          </div>
        </div>
      )}

      {/* 信息卡片 */}
      <div className="mx-4 mt-4 bg-gray-50 rounded-xl p-3 space-y-2.5">
        <div className="flex items-center gap-2 text-xs">
          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">{r.address}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Phone size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">{r.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Users size={14} className={waitingServices.length > 0 ? 'text-orange-500 flex-shrink-0' : 'text-gray-400 flex-shrink-0'} />
          {waitingServices.length > 0 ? (
            <span className="text-orange-600 flex items-center gap-1.5">
              排队中 · {waitingServices.length}人等待 · 约{waitingServices[0]?.estimatedWait || 0}分钟
              <span className="text-[10px] px-1 py-0.5 bg-orange-100 text-orange-600 rounded animate-pulse leading-none">LIVE</span>
            </span>
          ) : (
            <span className="text-green-600">无需排队</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Clock size={14} className="text-gray-400 flex-shrink-0" />
          <span className={status.color}>{status.text}</span>
        </div>
      </div>

      {/* 特色 */}
      {r.features.length > 0 && (
        <div className="px-4 mt-4">
          <h2 className="font-semibold text-sm mb-2">特色服务</h2>
          <div className="flex gap-2 flex-wrap">
            {r.features.map(f => (
              <span key={f} className="text-xs px-2.5 py-1 bg-green-50 text-green-600 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 菜单 */}
      <div className="px-4 mt-4">
        <h2 className="font-semibold text-sm mb-2">推荐菜品</h2>
        <div className="space-y-2">
          {r.menu.map(item => (
            <div key={item.name} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{item.name}</span>
                {item.isSignature && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded">招牌</span>
                )}
              </div>
              <span className="text-sm text-primary-500">¥{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 评价 */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">用户评价 ({allReviews.length})</h2>
          <button
            className="text-xs text-primary-500 flex items-center"
            onClick={() => navigate(`/write-review/${r.id}`)}
          >
            写评价 <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {allReviews.slice(0, 10).map(rev => (
            <div key={rev.id} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <img src={rev.userAvatar} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium">{rev.userName}</p>
                    {rev.isVerified && (
                      <span className="text-[8px] px-1 py-0.5 bg-blue-50 text-blue-600 rounded flex items-center gap-0.5">
                        <ShieldCheck size={8} /> 已认证
                      </span>
                    )}
                  </div>
                  <StarRating rating={rev.rating} size={10} />
                </div>
                <span className="text-[10px] text-gray-400">{rev.createdAt}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">{rev.content}</p>
              {rev.images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {rev.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  ))}
                </div>
              )}
              {rev.tags.length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  {rev.tags.map(t => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t px-4 py-3 flex gap-3 z-50">
        <button
          className="flex-1 bg-primary-500 text-white rounded-full py-2.5 text-sm font-medium active:bg-primary-600"
          onClick={() => showToast('已拨打电话', 'info')}
        >
          打电话
        </button>
        <button
          className="flex-1 bg-primary-50 text-primary-500 rounded-full py-2.5 text-sm font-medium"
          onClick={() => navigate(`/write-review/${r.id}`)}
        >
          写评价
        </button>
      </div>
    </div>
  )
}
