import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Shuffle, RotateCw, MapPin, Star } from 'lucide-react'
import { restaurants } from '../data/restaurants'

interface Props {
  visible: boolean
  onClose: () => void
}

export default function ShakeRecommend({ visible, onClose }: Props) {
  const navigate = useNavigate()
  const [isShaking, setIsShaking] = useState(false)
  const [result, setResult] = useState<typeof restaurants[0] | null>(null)
  const [showResult, setShowResult] = useState(false)

  const doShake = useCallback(() => {
    setIsShaking(true)
    setShowResult(false)

    // 随机选择一个营业中的餐厅
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const currentTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

    const openRestaurants = restaurants.filter(r => {
      return currentTime >= r.businessHours.open && currentTime <= r.businessHours.close
    })

    const pool = openRestaurants.length > 0 ? openRestaurants : restaurants
    const random = pool[Math.floor(Math.random() * pool.length)]

    setTimeout(() => {
      setResult(random)
      setIsShaking(false)
      setShowResult(true)
    }, 1200)
  }, [])

  useEffect(() => {
    if (visible && !result) {
      doShake()
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl w-full max-w-[350px] overflow-hidden">
        {/* 顶部 */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 py-5 relative">
          <button className="absolute top-3 right-3" onClick={onClose}>
            <X size={20} className="text-white/70" />
          </button>
          <div className="flex items-center gap-2">
            <Shuffle size={20} />
            <h2 className="font-bold text-base">今天吃什么？</h2>
          </div>
          <p className="text-xs text-white/70 mt-1">选择困难？让命运来决定！</p>
        </div>

        {/* 内容 */}
        <div className="p-5">
          {isShaking && (
            <div className="flex flex-col items-center py-8">
              <div className="text-5xl animate-bounce">🎲</div>
              <p className="text-sm text-gray-500 mt-4 animate-pulse">正在为你选择...</p>
            </div>
          )}

          {showResult && result && (
            <div className="animate-fade-in">
              <div className="text-center mb-4">
                <p className="text-xs text-gray-400">今天推荐你吃</p>
                <h3 className="text-xl font-bold mt-1">{result.name}</h3>
              </div>

              <img
                src={result.coverImage}
                alt={result.name}
                className="w-full h-40 object-cover rounded-xl"
              />

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{result.rating}</span>
                    <span className="text-xs text-gray-400">· {result.category}</span>
                  </div>
                  <span className="text-sm text-primary-500 font-medium">¥{result.avgPrice}/人</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} />
                  <span>{result.address}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {result.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 bg-gray-100 text-gray-600 rounded-full py-2.5 text-sm font-medium flex items-center justify-center gap-1"
                  onClick={doShake}
                >
                  <RotateCw size={14} />
                  换一家
                </button>
                <button
                  className="flex-1 bg-primary-500 text-white rounded-full py-2.5 text-sm font-medium"
                  onClick={() => {
                    onClose()
                    navigate(`/restaurant/${result.id}`)
                  }}
                >
                  就它了！
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
