import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageCircle, Heart, Clock, Users, Tag, ArrowLeft,
  Send, Image, Radio, Ticket,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { getWaitingServices } from '../data/queueService'
import type { CommunityPost } from '../types'

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'queue_status', label: '排队播报' },
  { key: 'daily_special', label: '今日特价' },
  { key: 'review', label: '美食分享' },
] as const

type TabKey = typeof TABS[number]['key']

function PostCard({ post, onLike }: { post: CommunityPost; onLike: () => void }) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* 用户信息 */}
      <div className="flex items-center gap-2.5">
        <img src={post.userAvatar} alt="" className="w-9 h-9 rounded-full bg-gray-100" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium truncate">{post.userName}</span>
            {post.isVerified && (
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full flex-shrink-0">
                已认证
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400">{post.userSchool} · {post.createdAt}</p>
        </div>
        {/* 类型标签 */}
        {post.type === 'queue_status' && (
          <span className="text-[10px] px-2 py-1 bg-orange-50 text-orange-600 rounded-full flex items-center gap-0.5">
            <Radio size={10} /> 排队播报
          </span>
        )}
        {post.type === 'daily_special' && (
          <span className="text-[10px] px-2 py-1 bg-red-50 text-red-600 rounded-full flex items-center gap-0.5">
            <Tag size={10} /> 今日特价
          </span>
        )}
      </div>

      {/* 内容 */}
      <p className="text-sm text-gray-700 mt-2.5 leading-relaxed">{post.content}</p>

      {/* 关联餐厅 */}
      {post.restaurantName && (
        <button
          className="mt-2 text-xs text-primary-500 bg-primary-50 px-2.5 py-1 rounded-full"
          onClick={() => post.restaurantId && navigate(`/restaurant/${post.restaurantId}`)}
        >
          📍 {post.restaurantName}
        </button>
      )}

      {/* 排队信息卡 */}
      {post.type === 'queue_status' && post.queueInfo && (
        <div className="mt-2.5 bg-orange-50 rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">当前排队</p>
            <p className="text-lg font-bold text-orange-600">#{post.queueInfo.currentNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">预计等待</p>
            <p className="text-lg font-bold text-orange-600">
              {post.queueInfo.waitTime > 0 ? `${post.queueInfo.waitTime}分钟` : '无需等待'}
            </p>
          </div>
        </div>
      )}

      {/* 特价信息卡 */}
      {post.type === 'daily_special' && post.specialInfo && (
        <div className="mt-2.5 bg-red-50 rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">原价</p>
            <p className="text-sm text-gray-400 line-through">¥{post.specialInfo.originalPrice}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">特价</p>
            <p className="text-xl font-bold text-red-500">¥{post.specialInfo.specialPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">剩余</p>
            <p className="text-sm font-medium text-red-500">{post.specialInfo.remaining}份</p>
          </div>
        </div>
      )}

      {/* 图片 */}
      {post.images.length > 0 && (
        <div className="flex gap-2 mt-2.5 overflow-x-auto">
          {post.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* 操作栏 */}
      <div className="flex items-center gap-6 mt-3 pt-2.5 border-t border-gray-50">
        <button className="flex items-center gap-1 text-xs text-gray-400" onClick={onLike}>
          <Heart size={14} />
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center gap-1 text-xs text-gray-400">
          <MessageCircle size={14} />
          <span>{post.comments}</span>
        </button>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const navigate = useNavigate()
  const { communityPosts, likePost, showToast, user } = useStore()
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [showCompose, setShowCompose] = useState(false)
  const [composeText, setComposeText] = useState('')
  const [composeType, setComposeType] = useState<CommunityPost['type']>('general')

  const waitingServices = getWaitingServices()
  const filteredPosts = activeTab === 'all'
    ? communityPosts
    : communityPosts.filter(p => p.type === activeTab)

  const handlePublish = () => {
    if (!composeText.trim()) return
    const newPost: CommunityPost = {
      id: `cp_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userSchool: `${user.school} ${user.grade}`,
      isVerified: user.isVerified,
      type: composeType,
      content: composeText,
      images: [],
      likes: 0,
      comments: 0,
      createdAt: '刚刚',
    }
    useStore.getState().addPost(newPost)
    setComposeText('')
    setShowCompose(false)
    showToast('发布成功 +10积分', 'success')
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* 顶部 */}
      <div className="bg-white sticky top-0 z-40">
        <div className="px-4 pt-12 pb-3">
          <h1 className="text-lg font-bold">校园美食社区</h1>
          <p className="text-xs text-gray-400 mt-0.5">实时动态 · 同学真实分享</p>
        </div>

        {/* Tab */}
        <div className="flex px-4 gap-1 border-b border-gray-100">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`px-3 py-2 text-sm ${
                activeTab === tab.key
                  ? 'text-primary-500 border-b-2 border-primary-500 font-medium'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 代取号横幅 */}
      {waitingServices.length > 0 && (
        <div className="mx-4 mt-3">
          <button
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-3 flex items-center gap-3"
            onClick={() => navigate('/queue-service')}
          >
            <Ticket size={24} />
            <div className="text-left flex-1">
              <p className="text-sm font-medium">代取号打赏</p>
              <p className="text-[10px] text-white/80">{waitingServices.length} 位同学需要帮忙取号</p>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">去帮忙 →</span>
          </button>
        </div>
      )}

      {/* 动态列表 */}
      <div className="px-4 mt-3 space-y-3">
        {filteredPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => likePost(post.id)}
          />
        ))}
      </div>

      {/* 发布按钮 */}
      <button
        className="fixed bottom-20 right-4 w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center active:bg-primary-600 z-40"
        onClick={() => setShowCompose(true)}
      >
        <Send size={20} />
      </button>

      {/* 发布弹窗 */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-w-[430px] mx-auto rounded-t-2xl p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <button className="text-sm text-gray-400" onClick={() => setShowCompose(false)}>
                取消
              </button>
              <h3 className="text-sm font-medium">发布动态</h3>
              <button
                className={`text-sm font-medium ${composeText.trim() ? 'text-primary-500' : 'text-gray-300'}`}
                onClick={handlePublish}
              >
                发布
              </button>
            </div>

            {/* 类型选择 */}
            <div className="flex gap-2 mb-3">
              {[
                { key: 'general' as const, label: '日常' },
                { key: 'queue_status' as const, label: '排队播报' },
                { key: 'daily_special' as const, label: '今日特价' },
                { key: 'review' as const, label: '美食分享' },
              ].map(t => (
                <button
                  key={t.key}
                  className={`text-xs px-3 py-1.5 rounded-full ${
                    composeType === t.key
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => setComposeType(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <textarea
              className="w-full h-28 text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-primary-300"
              placeholder="分享你的美食发现..."
              value={composeText}
              onChange={e => setComposeText(e.target.value)}
              maxLength={200}
              autoFocus
            />
            <div className="flex items-center justify-between mt-2">
              <button className="text-gray-400">
                <Image size={20} />
              </button>
              <span className="text-xs text-gray-300">{composeText.length}/200</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
