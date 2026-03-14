import { create } from 'zustand'
import { FilterState, ToastMessage, UserProfile, Review, CommunityPost } from '../types'
import { communityPosts as mockPosts } from '../data/community'

interface AppState {
  // 筛选
  filters: FilterState
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void

  // 收藏
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  // 用户评价（本地新增）
  userReviews: Review[]
  addReview: (review: Review) => void

  // 用户信息
  user: UserProfile
  updateUser: (partial: Partial<UserProfile>) => void

  // Toast
  toasts: ToastMessage[]
  showToast: (text: string, type?: ToastMessage['type']) => void
  removeToast: (id: string) => void

  // 社区动态
  communityPosts: CommunityPost[]
  addPost: (post: CommunityPost) => void
  likePost: (postId: string) => void

  // 积分
  addPoints: (amount: number) => void
}

const defaultFilters: FilterState = {
  campus: '全部',
  category: '全部',
  priceRange: null,
  sortBy: 'rating',
  tags: [],
  onlyOpen: false,
}

const defaultUser: UserProfile = {
  id: 'me',
  name: '噜噜',
  avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Me',
  level: 3,
  reviewCount: 3,
  favoriteCount: 0,
  visitedCount: 8,
  school: '北京邮电大学',
  grade: '研二',
  isVerified: true,
  points: 180,
}

export const useStore = create<AppState>((set, get) => ({
  filters: { ...defaultFilters },
  setFilter: (key, value) =>
    set(state => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),

  favorites: ['r1', 'r2', 'r9'],
  toggleFavorite: (id) =>
    set(state => {
      const exists = state.favorites.includes(id)
      const favorites = exists
        ? state.favorites.filter(f => f !== id)
        : [...state.favorites, id]
      const showText = exists ? '已取消收藏' : '已收藏'
      setTimeout(() => get().showToast(showText, 'success'), 0)
      return {
        favorites,
        user: { ...state.user, favoriteCount: favorites.length },
      }
    }),
  isFavorite: (id) => get().favorites.includes(id),

  userReviews: [],
  addReview: (review) =>
    set(state => ({
      userReviews: [review, ...state.userReviews],
      user: { ...state.user, reviewCount: state.user.reviewCount + 1 },
    })),

  user: { ...defaultUser, favoriteCount: 3 },
  updateUser: (partial) =>
    set(state => ({ user: { ...state.user, ...partial } })),

  toasts: [],
  showToast: (text, type = 'success') => {
    const id = Date.now().toString()
    set(state => ({ toasts: [...state.toasts, { id, text, type }] }))
    setTimeout(() => get().removeToast(id), 2000)
  },
  removeToast: (id) =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  // 社区动态
  communityPosts: [...mockPosts],
  addPost: (post) =>
    set(state => ({ communityPosts: [post, ...state.communityPosts] })),
  likePost: (postId) =>
    set(state => ({
      communityPosts: state.communityPosts.map(p =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ),
    })),

  // 积分
  addPoints: (amount) =>
    set(state => ({
      user: { ...state.user, points: state.user.points + amount },
    })),
}))
