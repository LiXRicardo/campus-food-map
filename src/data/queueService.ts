import { QueueService } from '../types'

const AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Carol',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Dave',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Eve',
]

export const queueServices: QueueService[] = [
  {
    id: 'qs1',
    userId: 'u1',
    userName: '小明',
    userAvatar: AVATARS[0],
    restaurantId: 'r1',
    restaurantName: '老四川麻辣烫',
    status: 'waiting',
    queueNumber: 'A042',
    estimatedWait: 25,
    reward: 3,
    createdAt: '5分钟前',
  },
  {
    id: 'qs2',
    userId: 'u2',
    userName: '学霸君',
    userAvatar: AVATARS[1],
    restaurantId: 'r2',
    restaurantName: '一碗拉面',
    status: 'waiting',
    queueNumber: 'B018',
    estimatedWait: 35,
    reward: 5,
    createdAt: '12分钟前',
  },
  {
    id: 'qs3',
    userId: 'u3',
    userName: '干饭王',
    userAvatar: AVATARS[2],
    restaurantId: 'r3',
    restaurantName: '韩舍·石锅拌饭',
    status: 'accepted',
    queueNumber: 'C007',
    estimatedWait: 10,
    reward: 2,
    createdAt: '20分钟前',
  },
  {
    id: 'qs4',
    userId: 'u4',
    userName: '奶茶控',
    userAvatar: AVATARS[3],
    restaurantId: 'r5',
    restaurantName: '烤肉大叔',
    status: 'waiting',
    queueNumber: 'D025',
    estimatedWait: 30,
    reward: 4,
    createdAt: '8分钟前',
  },
  {
    id: 'qs5',
    userId: 'u5',
    userName: '觅食者',
    userAvatar: AVATARS[4],
    restaurantId: 'r6',
    restaurantName: '铁板の诱惑',
    status: 'completed',
    queueNumber: 'E003',
    estimatedWait: 0,
    reward: 3,
    createdAt: '45分钟前',
  },
]

export const getWaitingServices = () => queueServices.filter(q => q.status === 'waiting')
export const getServicesByRestaurant = (restaurantId: string) =>
  queueServices.filter(q => q.restaurantId === restaurantId)
