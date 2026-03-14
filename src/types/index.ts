export interface MenuItem {
  name: string
  price: number
  image?: string
  isSignature?: boolean
}

export interface BusinessHours {
  open: string  // "HH:mm"
  close: string // "HH:mm"
}

export interface Restaurant {
  id: string
  name: string
  coverImage: string
  images: string[]
  category: string
  tags: string[]
  priceRange: [number, number]
  avgPrice: number
  rating: number
  reviewCount: number
  address: string
  campus: string
  lat: number
  lng: number
  phone: string
  businessHours: BusinessHours
  description: string
  menu: MenuItem[]
  features: string[]
  distance?: number
}

export interface Review {
  id: string
  restaurantId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  content: string
  images: string[]
  tags: string[]
  createdAt: string
  likes: number
  isVerified?: boolean
}

export interface Scene {
  id: string
  name: string
  icon: string
  description: string
  color: string
  filters: {
    tags?: string[]
    maxPrice?: number
    categories?: string[]
  }
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
  level: number
  reviewCount: number
  favoriteCount: number
  visitedCount: number
  school: string
  grade: string
  isVerified: boolean
  points: number
}

export type SortOption = 'rating' | 'distance' | 'price' | 'popularity'

export interface FilterState {
  campus: string
  category: string
  priceRange: [number, number] | null
  sortBy: SortOption
  tags: string[]
  onlyOpen: boolean
}

export interface ToastMessage {
  id: string
  text: string
  type: 'success' | 'error' | 'info'
}

// ===== 新增类型 =====

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userSchool: string
  isVerified: boolean
  type: 'review' | 'queue_status' | 'daily_special' | 'general'
  content: string
  images: string[]
  restaurantId?: string
  restaurantName?: string
  queueInfo?: {
    currentNumber: number
    waitTime: number
  }
  specialInfo?: {
    originalPrice: number
    specialPrice: number
    remaining: number
  }
  likes: number
  comments: number
  createdAt: string
}

export interface QueueService {
  id: string
  userId: string
  userName: string
  userAvatar: string
  restaurantId: string
  restaurantName: string
  status: 'waiting' | 'accepted' | 'completed'
  queueNumber: string
  estimatedWait: number
  reward: number
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'achievement'
  points: number
  progress: number
  target: number
  completed: boolean
  icon: string
}
