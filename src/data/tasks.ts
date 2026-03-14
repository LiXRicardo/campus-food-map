import { Task } from '../types'

export const tasks: Task[] = [
  // 每日任务
  {
    id: 't1',
    title: '今日签到',
    description: '每日打开APP签到一次',
    type: 'daily',
    points: 5,
    progress: 1,
    target: 1,
    completed: true,
    icon: '📅',
  },
  {
    id: 't2',
    title: '发布动态',
    description: '在社区发布一条美食动态',
    type: 'daily',
    points: 10,
    progress: 0,
    target: 1,
    completed: false,
    icon: '📝',
  },
  {
    id: 't3',
    title: '排队播报员',
    description: '发布一条实时排队信息',
    type: 'daily',
    points: 15,
    progress: 0,
    target: 1,
    completed: false,
    icon: '📢',
  },
  {
    id: 't4',
    title: '点赞达人',
    description: '给3条社区动态点赞',
    type: 'daily',
    points: 5,
    progress: 1,
    target: 3,
    completed: false,
    icon: '👍',
  },
  // 每周任务
  {
    id: 't5',
    title: '美食评论家',
    description: '本周写3条餐厅评价',
    type: 'weekly',
    points: 30,
    progress: 1,
    target: 3,
    completed: false,
    icon: '⭐',
  },
  {
    id: 't6',
    title: '探店先锋',
    description: '本周去2家没去过的餐厅',
    type: 'weekly',
    points: 25,
    progress: 0,
    target: 2,
    completed: false,
    icon: '🗺️',
  },
  {
    id: 't7',
    title: '代取号帮手',
    description: '本周完成1次代取号服务',
    type: 'weekly',
    points: 20,
    progress: 0,
    target: 1,
    completed: false,
    icon: '🎫',
  },
  // 成就
  {
    id: 't8',
    title: '初级食客',
    description: '累计探访5家餐厅',
    type: 'achievement',
    points: 50,
    progress: 5,
    target: 5,
    completed: true,
    icon: '🍜',
  },
  {
    id: 't9',
    title: '美食达人',
    description: '累计探访20家餐厅',
    type: 'achievement',
    points: 100,
    progress: 8,
    target: 20,
    completed: false,
    icon: '🔥',
  },
  {
    id: 't10',
    title: '评价专家',
    description: '累计写10条评价',
    type: 'achievement',
    points: 80,
    progress: 3,
    target: 10,
    completed: false,
    icon: '✍️',
  },
  {
    id: 't11',
    title: '社区之星',
    description: '单条动态获得50个赞',
    type: 'achievement',
    points: 120,
    progress: 34,
    target: 50,
    completed: false,
    icon: '🌟',
  },
  {
    id: 't12',
    title: '热心快递员',
    description: '累计完成10次代取号服务',
    type: 'achievement',
    points: 150,
    progress: 2,
    target: 10,
    completed: false,
    icon: '🏃',
  },
]

export const getTasksByType = (type: Task['type']) => tasks.filter(t => t.type === type)

export const LEVEL_CONFIG = [
  { level: 1, name: '美食小白', minPoints: 0, icon: '🥚' },
  { level: 2, name: '觅食新手', minPoints: 50, icon: '🍙' },
  { level: 3, name: '美食探索者', minPoints: 150, icon: '🍜' },
  { level: 4, name: '校园吃货', minPoints: 350, icon: '🍔' },
  { level: 5, name: '美食达人', minPoints: 600, icon: '🔥' },
  { level: 6, name: '资深食评家', minPoints: 1000, icon: '👨‍🍳' },
  { level: 7, name: '美食传说', minPoints: 2000, icon: '🏆' },
]

export const getLevelInfo = (points: number) => {
  const level = [...LEVEL_CONFIG].reverse().find(l => points >= l.minPoints)!
  const nextLevel = LEVEL_CONFIG.find(l => l.minPoints > points)
  return {
    ...level,
    nextLevel,
    progressToNext: nextLevel
      ? ((points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100
      : 100,
  }
}
