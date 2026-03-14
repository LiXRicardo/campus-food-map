import { useNavigate } from 'react-router-dom'
import {
  Heart, Star, MapPin, Settings, ChevronRight, BookOpen, Award, MessageSquare,
  ShieldCheck, Ticket, Target, GraduationCap,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { restaurants } from '../data/restaurants'
import { getLevelInfo } from '../data/tasks'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useStore()

  const totalRestaurants = restaurants.length
  const progress = Math.round((user.visitedCount / totalRestaurants) * 100)
  const levelInfo = getLevelInfo(user.points)

  const menuItems = [
    { icon: Heart, label: '我的收藏', to: '/favorites', color: 'text-red-500' },
    { icon: MessageSquare, label: '我的评价', to: '/favorites', color: 'text-blue-500' },
    { icon: Target, label: '任务中心', to: '/tasks', color: 'text-orange-500', badge: '3任务' },
    { icon: Ticket, label: '代取号打赏', to: '/queue-service', color: 'text-yellow-500' },
    { icon: Award, label: '美食成就', to: '/tasks', color: 'text-purple-500' },
    { icon: BookOpen, label: '探店日记', to: '#', color: 'text-green-500' },
    { icon: Settings, label: '设置', to: '#', color: 'text-gray-500' },
  ]

  return (
    <div className="pb-20">
      {/* 头部 */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 pt-14 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{user.name}</h1>
              <button
                className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-full flex items-center gap-0.5"
                onClick={() => navigate('/auth')}
              >
                <ShieldCheck size={10} />
                {user.isVerified ? '已认证' : '去认证 →'}
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm text-primary-100">{levelInfo.icon} Lv.{levelInfo.level} {levelInfo.name}</span>
            </div>
            {user.school && (
              <div className="flex items-center gap-1 mt-0.5">
                <GraduationCap size={12} className="text-primary-200" />
                <span className="text-xs text-primary-200">{user.school} · {user.grade}</span>
              </div>
            )}
          </div>
        </div>

        {/* 数据统计 */}
        <div className="flex justify-around mt-6 text-center">
          <div>
            <p className="text-xl font-bold">{user.favoriteCount}</p>
            <p className="text-xs text-primary-200">收藏</p>
          </div>
          <div>
            <p className="text-xl font-bold">{user.reviewCount}</p>
            <p className="text-xs text-primary-200">评价</p>
          </div>
          <div>
            <p className="text-xl font-bold">{user.visitedCount}</p>
            <p className="text-xs text-primary-200">探访</p>
          </div>
          <div>
            <p className="text-xl font-bold">{user.points}</p>
            <p className="text-xs text-primary-200">积分</p>
          </div>
        </div>
      </div>

      {/* 等级进度 */}
      <div className="mx-4 -mt-4 bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span>{levelInfo.icon}</span>
            <span className="text-sm font-medium">{levelInfo.name}</span>
          </div>
          {levelInfo.nextLevel && (
            <span className="text-xs text-gray-400">
              距{levelInfo.nextLevel.name}还需{levelInfo.nextLevel.minPoints - user.points}积分
            </span>
          )}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${levelInfo.progressToNext}%` }}
          />
        </div>

        {/* 任务入口 */}
        <button
          className="w-full mt-3 bg-primary-50 rounded-lg p-2.5 flex items-center justify-between"
          onClick={() => navigate('/tasks')}
        >
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary-500" />
            <span className="text-xs font-medium text-primary-600">做任务赚积分，快速升级</span>
          </div>
          <ChevronRight size={14} className="text-primary-400" />
        </button>
      </div>

      {/* 探索进度 */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">探索进度</span>
          <span className="text-xs text-gray-400">{user.visitedCount}/{totalRestaurants}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-green-400 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          已探索 {progress}% 的校园美食，继续加油！
        </p>
      </div>

      {/* 功能列表 */}
      <div className="mx-4 mt-4 bg-white rounded-xl overflow-hidden shadow-sm">
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3.5 ${
              i < menuItems.length - 1 ? 'border-b border-gray-50' : ''
            } active:bg-gray-50`}
            onClick={() => item.to !== '#' ? navigate(item.to) : undefined}
          >
            <item.icon size={18} className={item.color} />
            <span className="text-sm">{item.label}</span>
            {item.badge && (
              <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded-full">
                {item.badge}
              </span>
            )}
            <ChevronRight size={16} className="text-gray-300 ml-auto" />
          </button>
        ))}
      </div>

      {/* 底部 */}
      <div className="flex items-center justify-center gap-1 mt-6 text-xs text-gray-300">
        <MapPin size={12} />
        <span>大学城美食地图 v2.0</span>
      </div>
    </div>
  )
}
