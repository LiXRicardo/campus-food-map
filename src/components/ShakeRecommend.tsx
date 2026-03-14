import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Shuffle, RotateCw, MapPin, Star } from 'lucide-react'
import { restaurants } from '../data/restaurants'

interface Props {
  visible: boolean
  onClose: () => void
}

const CATEGORY_ICONS: Record<string, string> = {
  '中餐': '🍚',
  '日料': '🍣',
  '韩餐': '🥘',
  '奶茶': '🧋',
  '快餐': '🍔',
  '烧烤': '🍢',
  '火锅': '🍲',
  '西餐': '🍝',
  '甜品': '🍰',
  '小吃': '🥟',
}

export default function ShakeRecommend({ visible, onClose }: Props) {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [result, setResult] = useState<typeof restaurants[0] | null>(null)

  const categories = useMemo(() => {
    const set = new Set(restaurants.map(r => r.category))
    return Array.from(set)
  }, [])

  const doShake = useCallback((category: string) => {
    setIsShaking(true)
    setResult(null)

    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const pool = restaurants.filter(r => {
      const isOpen = currentTime >= r.businessHours.open && currentTime <= r.businessHours.close
      const matchCategory = r.category === category
      return matchCategory && (isOpen || true)
    })

    const finalPool = pool.length > 0 ? pool : restaurants.filter(r => r.category === category)
    const random = finalPool[Math.floor(Math.random() * finalPool.length)]

    setTimeout(() => {
      setResult(random)
      setIsShaking(false)
    }, 1000)
  }, [])

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat)
    doShake(cat)
  }

  const handleBack = () => {
    setSelectedCategory(null)
    setResult(null)
    setIsShaking(false)
  }

  const handleClose = () => {
    setSelectedCategory(null)
    setResult(null)
    setIsShaking(false)
    onClose()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl w-full max-w-[350px] overflow-hidden">
        {/* 顶部 */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 py-5 relative">
          <button className="absolute top-3 right-3" onClick={handleClose}>
            <X size={20} className="text-white/70" />
          </button>
          <div className="flex items-center gap-2">
            <Shuffle size={20} />
            <h2 className="font-bold text-base">今天吃什么？</h2>
          </div>
          <p className="text-xs text-white/70 mt-1">
            {selectedCategory ? `已选：${CATEGORY_ICONS[selectedCategory] || ''} ${selectedCategory}` : '先选个品类，再帮你随机推荐！'}
          </p>
        </div>

        {/* 内容 */}
        <div className="p-5">
          {/* 第一步：选品类 */}
          {!selectedCategory && (
            <div>
              <p className="text-sm text-gray-500 mb-3 text-center">想吃什么类型？</p>
              <div className="grid grid-cols-5 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-gray-50 hover:bg-primary-50 active:bg-primary-100 transition-colors"
                    onClick={() => handleSelectCategory(cat)}
                  >
                    <span className="text-2xl">{CATEGORY_ICONS[cat] || '🍽️'}</span>
                    <span className="text-[11px] text-gray-600">{cat}</span>
                  </button>
                ))}
              </div>
              <button
                className="w-full mt-3 bg-primary-50 text-primary-600 rounded-full py-2.5 text-sm font-medium flex items-center justify-center gap-1"
                onClick={() => {
                  const randomCat = categories[Math.floor(Math.random() * categories.length)]
                  handleSelectCategory(randomCat)
                }}
              >
                <Shuffle size={14} />
                随便吃点
              </button>
            </div>
          )}

          {/* 第二步：推荐结果 */}
          {selectedCategory && isShaking && (
            <div className="flex flex-col items-center py-8">
              <div className="text-5xl animate-bounce">{CATEGORY_ICONS[selectedCategory] || '🎲'}</div>
              <p className="text-sm text-gray-500 mt-4 animate-pulse">正在从{selectedCategory}里挑选...</p>
            </div>
          )}

          {selectedCategory && !isShaking && result && (
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
                  onClick={handleBack}
                >
                  换品类
                </button>
                <button
                  className="flex-1 bg-gray-100 text-gray-600 rounded-full py-2.5 text-sm font-medium flex items-center justify-center gap-1"
                  onClick={() => doShake(selectedCategory)}
                >
                  <RotateCw size={14} />
                  换一家
                </button>
                <button
                  className="flex-1 bg-primary-500 text-white rounded-full py-2.5 text-sm font-medium"
                  onClick={() => {
                    handleClose()
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
