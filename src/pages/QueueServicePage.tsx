import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Ticket, Clock, MapPin, Check, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { queueServices, getWaitingServices } from '../data/queueService'

export default function QueueServicePage() {
  const navigate = useNavigate()
  const { showToast, user } = useStore()
  const [activeTab, setActiveTab] = useState<'find' | 'my'>('find')
  const [showCreate, setShowCreate] = useState(false)

  const waitingList = getWaitingServices()

  const handleAccept = (serviceId: string) => {
    showToast('已接单！请前往餐厅取号 +积分奖励', 'success')
  }

  const handleCreate = () => {
    showToast('发布成功！等待同学帮你取号', 'success')
    setShowCreate(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* 顶部 */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="font-bold">代取号打赏</h1>
        </div>
        <p className="text-sm text-white/80">在餐厅附近？帮同学取个号，赚点小费～</p>

        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{waitingList.length}</p>
            <p className="text-xs text-white/80">待接单</p>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">¥2-5</p>
            <p className="text-xs text-white/80">打赏金额</p>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">~5min</p>
            <p className="text-xs text-white/80">平均耗时</p>
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="flex mx-4 mt-4 bg-white rounded-lg p-1 shadow-sm">
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium ${
            activeTab === 'find' ? 'bg-primary-500 text-white' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('find')}
        >
          帮人取号
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium ${
            activeTab === 'my' ? 'bg-primary-500 text-white' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('my')}
        >
          我的订单
        </button>
      </div>

      {activeTab === 'find' && (
        <div className="px-4 mt-4 space-y-3">
          {/* 流程说明 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-medium mb-2">如何帮取号？</h3>
            <div className="flex items-start gap-3">
              {[
                { step: '1', text: '选择附近的取号请求' },
                { step: '2', text: '前往餐厅帮忙取号' },
                { step: '3', text: '拍照确认号码' },
                { step: '4', text: '获得打赏+积分' },
              ].map(s => (
                <div key={s.step} className="flex-1 text-center">
                  <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-xs flex items-center justify-center mx-auto font-medium">
                    {s.step}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 取号列表 */}
          {waitingList.map(service => (
            <div key={service.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={service.userAvatar} alt="" className="w-9 h-9 rounded-full bg-gray-100" />
                  <div>
                    <p className="text-sm font-medium">{service.userName}</p>
                    <p className="text-[10px] text-gray-400">{service.createdAt}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-orange-500">¥{service.reward}</span>
              </div>

              <div className="mt-3 bg-gray-50 rounded-lg p-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">{service.restaurantName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ticket size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">取号 {service.queueNumber}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">约{service.estimatedWait}min</span>
                </div>
              </div>

              <button
                className="w-full mt-3 bg-orange-500 text-white rounded-full py-2 text-sm font-medium active:bg-orange-600"
                onClick={() => handleAccept(service.id)}
              >
                接单帮取号
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'my' && (
        <div className="px-4 mt-4 space-y-3">
          {/* 历史记录 */}
          {queueServices.filter(q => q.status === 'completed').map(service => (
            <div key={service.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{service.restaurantName}</p>
                  <p className="text-xs text-gray-400">取号 {service.queueNumber} · {service.createdAt}</p>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <Check size={14} />
                  <span className="text-xs">已完成</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400">获得打赏</span>
                <span className="text-sm font-medium text-orange-500">¥{service.reward}</span>
              </div>
            </div>
          ))}

          {/* 空状态 */}
          {queueServices.filter(q => q.status === 'completed').length === 0 && (
            <div className="text-center py-12">
              <Ticket size={40} className="text-gray-200 mx-auto" />
              <p className="text-sm text-gray-400 mt-3">暂无历史记录</p>
            </div>
          )}
        </div>
      )}

      {/* 底部发布按钮 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[398px]">
        <button
          className="w-full bg-primary-500 text-white rounded-full py-3 text-sm font-medium shadow-lg active:bg-primary-600"
          onClick={() => setShowCreate(true)}
        >
          我也要找人取号
        </button>
      </div>

      {/* 发布弹窗 */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-w-[430px] mx-auto rounded-t-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">发布取号请求</h3>
              <button onClick={() => setShowCreate(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">选择餐厅</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                  <option>老四川麻辣烫</option>
                  <option>一碗拉面</option>
                  <option>韩舍·石锅拌饭</option>
                  <option>烤肉大叔</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">打赏金额</label>
                <div className="flex gap-2">
                  {[2, 3, 5].map(amt => (
                    <button
                      key={amt}
                      className="flex-1 border border-orange-300 text-orange-500 rounded-lg py-2 text-sm font-medium hover:bg-orange-50"
                    >
                      ¥{amt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">备注</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                  placeholder="例如：帮我取个号，我大概20分钟后到"
                />
              </div>
              <button
                className="w-full bg-orange-500 text-white rounded-full py-3 text-sm font-medium"
                onClick={handleCreate}
              >
                发布请求
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
