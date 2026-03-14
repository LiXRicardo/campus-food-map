import { useState, useMemo } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import { restaurants, CAMPUS_CENTER } from '../data/restaurants'
import { useStore } from '../store/useStore'
import { fuzzySearch } from '../utils/search'
import { isOpen } from '../utils/businessHours'
import { haversineDistance } from '../utils/distance'
import FilterBar from '../components/FilterBar'
import RestaurantCard from '../components/RestaurantCard'
import EmptyState from '../components/EmptyState'

const HOT_KEYWORDS = ['拉面', '奶茶', '烧烤', '实惠', '夜宵', '火锅']

export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const { filters } = useStore()

  const results = useMemo(() => {
    let list = fuzzySearch(restaurants, keyword)

    // 校区筛选
    if (filters.campus !== '全部') {
      list = list.filter(r => r.campus === filters.campus)
    }
    // 分类筛选
    if (filters.category !== '全部') {
      list = list.filter(r => r.category === filters.category)
    }
    // 标签筛选
    if (filters.tags.length > 0) {
      list = list.filter(r => filters.tags.some(t => r.tags.includes(t)))
    }
    // 仅营业中
    if (filters.onlyOpen) {
      list = list.filter(r => isOpen(r.businessHours))
    }

    // 计算距离
    list = list.map(r => ({
      ...r,
      distance: haversineDistance(CAMPUS_CENTER.lat, CAMPUS_CENTER.lng, r.lat, r.lng),
    }))

    // 排序
    switch (filters.sortBy) {
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'distance': list.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0)); break
      case 'price': list.sort((a, b) => a.avgPrice - b.avgPrice); break
      case 'popularity': list.sort((a, b) => b.reviewCount - a.reviewCount); break
    }

    return list
  }, [keyword, filters])

  return (
    <div className="pb-20">
      {/* 搜索栏 */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-3 shadow-sm">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <SearchIcon size={16} className="text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="搜索餐厅、菜品、标签..."
            className="flex-1 bg-transparent text-sm outline-none"
            autoFocus
          />
          {keyword && (
            <button onClick={() => setKeyword('')}>
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* 热门搜索 */}
        {!keyword && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {HOT_KEYWORDS.map(k => (
              <button
                key={k}
                className="text-xs px-3 py-1.5 bg-gray-50 rounded-full text-gray-600"
                onClick={() => setKeyword(k)}
              >
                {k}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 筛选栏 */}
      <div className="px-4 mt-3">
        <FilterBar />
      </div>

      {/* 结果列表 */}
      <div className="px-4 mt-3 space-y-3">
        <p className="text-xs text-gray-400">共 {results.length} 个结果</p>
        {results.length === 0 ? (
          <EmptyState message="没有找到匹配的餐厅" />
        ) : (
          results.map(r => <RestaurantCard key={r.id} restaurant={r} />)
        )}
      </div>
    </div>
  )
}
