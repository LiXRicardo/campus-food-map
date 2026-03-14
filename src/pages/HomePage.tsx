import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ChevronRight, Wallet, Heart, Moon, Users, Sun, Flame,
  Shuffle, Calculator, Radio, Tag,
} from 'lucide-react'
import { restaurants } from '../data/restaurants'
import { scenes } from '../data/scenes'
import { getLatestReviews } from '../data/reviews'
import { communityPosts } from '../data/community'
import { useStore } from '../store/useStore'
import RestaurantCard from '../components/RestaurantCard'
import StarRating from '../components/StarRating'
import ShakeRecommend from '../components/ShakeRecommend'
import AACalculator from '../components/AACalculator'

const SCENE_ICONS: Record<string, React.ElementType> = {
  Wallet, Heart, Moon, Users, Sun, Flame,
}

export default function HomePage() {
  const navigate = useNavigate()
  const { filters, setFilter, user } = useStore()
  const [activeTab, setActiveTab] = useState<'hot' | 'new' | 'cheap'>('hot')
  const [showShake, setShowShake] = useState(false)
  const [showAA, setShowAA] = useState(false)

  const hotList = useMemo(() => {
    let list = [...restaurants]
    if (filters.campus !== '全部') {
      list = list.filter(r => r.campus === filters.campus)
    }
    switch (activeTab) {
      case 'hot': return list.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6)
      case 'new': return list.sort((a, b) => b.rating - a.rating).slice(0, 6)
      case 'cheap': return list.sort((a, b) => a.avgPrice - b.avgPrice).slice(0, 6)
    }
  }, [filters.campus, activeTab])

  const latestReviews = useMemo(() => getLatestReviews(5), [])

  // 实时动态预览（取最新3条）
  const recentPosts = useMemo(() => communityPosts.slice(0, 3), [])

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">大学城美食地图</h1>
            <p className="text-sm text-primary-100 mt-1">发现校园周边好味道</p>
          </div>
          {user.isVerified && (
            <span className="text-[10px] px-2 py-1 bg-white/20 rounded-full flex items-center gap-1">
              ✅ 已认证
            </span>
          )}
        </div>

        {/* 搜索栏 */}
        <div
          className="mt-4 bg-white/20 backdrop-blur rounded-full px-4 py-2.5 flex items-center gap-2"
          onClick={() => navigate('/search')}
        >
          <Search size={16} className="text-white/70" />
          <span className="text-sm text-white/70">搜索餐厅、菜品...</span>
        </div>
      </div>

      {/* 今天吃什么 + AA计算器 快捷入口 */}
      <div className="px-4 -mt-4 flex gap-3">
        <button
          className="flex-1 bg-white rounded-xl p-3 shadow-md flex items-center gap-2.5 active:scale-95 transition-transform"
          onClick={() => setShowShake(true)}
        >
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Shuffle size={20} className="text-primary-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">今天吃什么</p>
            <p className="text-[10px] text-gray-400">随机推荐</p>
          </div>
        </button>
        <button
          className="flex-1 bg-white rounded-xl p-3 shadow-md flex items-center gap-2.5 active:scale-95 transition-transform"
          onClick={() => setShowAA(true)}
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Calculator size={20} className="text-green-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">AA计算器</p>
            <p className="text-[10px] text-gray-400">聚餐分摊</p>
          </div>
        </button>
      </div>

      {/* 场景入口 */}
      <div className="px-4 mt-5">
        <div className="grid grid-cols-3 gap-3">
          {scenes.map(scene => {
            const Icon = SCENE_ICONS[scene.icon] || Wallet
            return (
              <button
                key={scene.id}
                className={`${scene.color} rounded-xl p-3 text-left active:scale-95 transition-transform`}
                onClick={() => {
                  if (scene.filters.tags?.length) {
                    setFilter('tags', scene.filters.tags)
                  }
                  if (scene.filters.categories?.length) {
                    setFilter('category', scene.filters.categories[0])
                  }
                  navigate('/search')
                }}
              >
                <Icon size={20} />
                <p className="text-xs font-medium mt-1.5">{scene.name}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{scene.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 实时动态预览 */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Radio size={14} className="text-red-500" />
            <h2 className="font-bold text-base">实时动态</h2>
            <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded-full animate-pulse">LIVE</span>
          </div>
          <button
            className="text-xs text-primary-500 flex items-center"
            onClick={() => navigate('/community')}
          >
            更多 <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-2">
          {recentPosts.map(post => (
            <div
              key={post.id}
              className="bg-white rounded-xl p-3 shadow-sm flex items-start gap-2.5"
              onClick={() => navigate('/community')}
            >
              <img src={post.userAvatar} alt="" className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium">{post.userName}</span>
                  {post.isVerified && (
                    <span className="text-[8px] px-1 py-0.5 bg-blue-50 text-blue-600 rounded">认证</span>
                  )}
                  {post.type === 'queue_status' && (
                    <span className="text-[8px] px-1 py-0.5 bg-orange-50 text-orange-600 rounded">排队</span>
                  )}
                  {post.type === 'daily_special' && (
                    <span className="text-[8px] px-1 py-0.5 bg-red-50 text-red-600 rounded">特价</span>
                  )}
                  <span className="text-[10px] text-gray-300 ml-auto">{post.createdAt}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 热门推荐 */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">热门推荐</h2>
          <button
            className="text-xs text-primary-500 flex items-center"
            onClick={() => navigate('/search')}
          >
            更多 <ChevronRight size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-3 border-b border-gray-100">
          {([['hot', '人气榜'], ['new', '好评榜'], ['cheap', '平价榜']] as const).map(([key, label]) => (
            <button
              key={key}
              className={`pb-2 text-sm ${
                activeTab === key
                  ? 'text-primary-500 border-b-2 border-primary-500 font-medium'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {hotList.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>

      {/* 最新评价 */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-base mb-3">最新评价</h2>
        <div className="space-y-3">
          {latestReviews.map(rev => {
            const restaurant = restaurants.find(r => r.id === rev.restaurantId)
            return (
            <div
              key={rev.id}
              className="bg-white rounded-xl p-3 shadow-sm"
              onClick={() => navigate(`/restaurant/${rev.restaurantId}`)}
            >
              <div className="flex items-center gap-2">
                <img src={rev.userAvatar} alt="" className="w-8 h-8 rounded-full bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium">{rev.userName}</p>
                    <span className="text-[10px] text-gray-300">评价了</span>
                    <span className="text-[10px] text-primary-500 font-medium truncate">{restaurant?.name}</span>
                  </div>
                  <StarRating rating={rev.rating} size={10} />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{rev.content}</p>
              {rev.images.length > 0 && (
                <img src={rev.images[0]} alt="" className="w-16 h-16 rounded-lg mt-2 object-cover" />
              )}
            </div>
            )
          })}
        </div>
      </div>

      {/* 模态框 */}
      <ShakeRecommend visible={showShake} onClose={() => setShowShake(false)} />
      <AACalculator visible={showAA} onClose={() => setShowAA(false)} />
    </div>
  )
}
