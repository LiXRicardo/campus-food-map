import { Restaurant } from '../types'

export function fuzzySearch(restaurants: Restaurant[], keyword: string): Restaurant[] {
  if (!keyword.trim()) return restaurants
  const kw = keyword.toLowerCase().trim()
  return restaurants.filter(r =>
    r.name.toLowerCase().includes(kw) ||
    r.category.toLowerCase().includes(kw) ||
    r.tags.some(t => t.toLowerCase().includes(kw)) ||
    r.description.toLowerCase().includes(kw) ||
    r.menu.some(m => m.name.toLowerCase().includes(kw)) ||
    r.address.toLowerCase().includes(kw)
  )
}
