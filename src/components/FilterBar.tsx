import { useStore } from '../store/useStore'
import { CAMPUSES, CATEGORIES } from '../data/restaurants'
import { SortOption } from '../types'
import TagBadge from './TagBadge'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rating', label: '评分' },
  { value: 'distance', label: '距离' },
  { value: 'price', label: '价格' },
  { value: 'popularity', label: '人气' },
]

export default function FilterBar() {
  const { filters, setFilter } = useStore()

  return (
    <div className="space-y-3">
      {/* 校区 */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CAMPUSES.map(c => (
          <TagBadge
            key={c}
            label={c}
            active={filters.campus === c}
            onClick={() => setFilter('campus', c)}
          />
        ))}
      </div>

      {/* 分类 */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(c => (
          <TagBadge
            key={c}
            label={c}
            active={filters.category === c}
            onClick={() => setFilter('category', c)}
          />
        ))}
      </div>

      {/* 排序 */}
      <div className="flex gap-2 items-center">
        {SORT_OPTIONS.map(o => (
          <TagBadge
            key={o.value}
            label={o.label}
            active={filters.sortBy === o.value}
            onClick={() => setFilter('sortBy', o.value)}
          />
        ))}
        <label className="flex items-center gap-1 ml-auto text-xs text-gray-500">
          <input
            type="checkbox"
            checked={filters.onlyOpen}
            onChange={e => setFilter('onlyOpen', e.target.checked)}
            className="rounded accent-primary-500"
          />
          营业中
        </label>
      </div>
    </div>
  )
}
