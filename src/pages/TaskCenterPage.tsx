import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Trophy, Target, CheckCircle, Lock } from 'lucide-react'
import { useStore } from '../store/useStore'
import { tasks } from '../data/tasks'
import { getLevelInfo, LEVEL_CONFIG } from '../data/tasks'

export default function TaskCenterPage() {
  const navigate = useNavigate()
  const { user, addPoints, showToast } = useStore()
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'achievement'>('daily')

  const levelInfo = getLevelInfo(user.points)
  const filteredTasks = tasks.filter(t => t.type === activeTab)

  const handleClaim = (taskId: string, points: number) => {
    addPoints(points)
    showToast(`领取成功 +${points}积分`, 'success')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="font-bold">任务中心</h1>
        </div>

        {/* 等级信息 */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{levelInfo.icon}</span>
              <div>
                <p className="text-sm font-medium">Lv.{levelInfo.level} {levelInfo.name}</p>
                <p className="text-xs text-white/70">{user.points} 积分</p>
              </div>
            </div>
            {levelInfo.nextLevel && (
              <div className="text-right">
                <p className="text-xs text-white/70">下一等级</p>
                <p className="text-sm">{levelInfo.nextLevel.icon} {levelInfo.nextLevel.name}</p>
              </div>
            )}
          </div>
          {levelInfo.nextLevel && (
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full transition-all"
                  style={{ width: `${levelInfo.progressToNext}%` }}
                />
              </div>
              <p className="text-[10px] text-white/60 mt-1">
                还需 {levelInfo.nextLevel.minPoints - user.points} 积分升级
              </p>
            </div>
          )}
        </div>

        {/* 等级路线 */}
        <div className="flex justify-between mt-4 px-2">
          {LEVEL_CONFIG.slice(0, 5).map(l => (
            <div key={l.level} className="flex flex-col items-center gap-0.5">
              <span className={`text-lg ${user.points >= l.minPoints ? '' : 'opacity-40'}`}>
                {l.icon}
              </span>
              <span className="text-[10px] text-white/70">Lv.{l.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab */}
      <div className="flex px-4 pt-4 gap-2">
        {([
          { key: 'daily' as const, label: '每日任务', icon: Target },
          { key: 'weekly' as const, label: '每周任务', icon: Star },
          { key: 'achievement' as const, label: '成就', icon: Trophy },
        ]).map(tab => (
          <button
            key={tab.key}
            className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-500 shadow-sm'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 任务列表 */}
      <div className="px-4 mt-4 space-y-2.5">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`bg-white rounded-xl p-4 shadow-sm ${task.completed ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{task.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{task.title}</h3>
                  <span className="text-xs text-primary-500 font-medium">+{task.points}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{task.description}</p>

                {/* 进度条 */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400">
                      {task.progress}/{task.target}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {Math.round((task.progress / task.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        task.completed ? 'bg-green-400' : 'bg-primary-400'
                      }`}
                      style={{ width: `${Math.min((task.progress / task.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 状态按钮 */}
              <div className="flex-shrink-0 mt-1">
                {task.completed ? (
                  <div className="flex items-center gap-0.5 text-green-500">
                    <CheckCircle size={18} />
                  </div>
                ) : task.progress >= task.target ? (
                  <button
                    className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded-full"
                    onClick={() => handleClaim(task.id, task.points)}
                  >
                    领取
                  </button>
                ) : (
                  <Lock size={16} className="text-gray-300" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 积分说明 */}
      <div className="mx-4 mt-4 bg-yellow-50 rounded-xl p-4">
        <h3 className="text-sm font-medium text-yellow-700 mb-2">积分说明</h3>
        <ul className="text-xs text-yellow-600 space-y-1">
          <li>· 完成任务获得积分，积分可提升等级</li>
          <li>· 高等级用户评价权重更高，推荐排名靠前</li>
          <li>· 代取号打赏小费也可兑换积分</li>
          <li>· 连续签到7天额外奖励50积分</li>
        </ul>
      </div>
    </div>
  )
}
