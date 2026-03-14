import { Scene } from '../types'

export const scenes: Scene[] = [
  {
    id: 'cheap',
    name: '穷学生套餐',
    icon: 'Wallet',
    description: '15元以下吃饱',
    color: 'bg-green-100 text-green-700',
    filters: { maxPrice: 15 },
  },
  {
    id: 'date',
    name: '约会餐厅',
    icon: 'Heart',
    description: '环境好适合约会',
    color: 'bg-pink-100 text-pink-700',
    filters: { tags: ['约会', '安静', '精致'] },
  },
  {
    id: 'latenight',
    name: '深夜食堂',
    icon: 'Moon',
    description: '22点后还营业',
    color: 'bg-indigo-100 text-indigo-700',
    filters: { tags: ['夜宵', '深夜营业'] },
  },
  {
    id: 'gathering',
    name: '聚餐推荐',
    icon: 'Users',
    description: '适合多人聚餐',
    color: 'bg-orange-100 text-orange-700',
    filters: { tags: ['聚餐'], categories: ['火锅', '烧烤'] },
  },
  {
    id: 'breakfast',
    name: '早餐去哪',
    icon: 'Sun',
    description: '早起觅食指南',
    color: 'bg-yellow-100 text-yellow-700',
    filters: { tags: ['早餐'] },
  },
  {
    id: 'spicy',
    name: '无辣不欢',
    icon: 'Flame',
    description: '嗜辣者的天堂',
    color: 'bg-red-100 text-red-700',
    filters: { tags: ['麻辣', '酸辣'] },
  },
]
