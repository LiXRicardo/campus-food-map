import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import { restaurants } from '../data/restaurants'
import { useStore } from '../store/useStore'
import StarRating from '../components/StarRating'

const QUICK_TAGS = ['好吃', '性价比高', '环境好', '服务好', '分量足', '推荐', '会再来', '排队久']

export default function WriteReviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addReview, showToast, user } = useStore()

  const restaurant = restaurants.find(r => r.id === id)
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  if (!restaurant) {
    return <div className="flex items-center justify-center h-screen text-gray-400">餐厅不存在</div>
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = () => {
    if (!content.trim()) {
      showToast('请输入评价内容', 'error')
      return
    }

    addReview({
      id: `user-${Date.now()}`,
      restaurantId: restaurant.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      content: content.trim(),
      images: [],
      tags: selectedTags,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
    })

    showToast('评价发布成功！', 'success')
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 顶栏 */}
      <div className="sticky top-0 bg-white z-10 flex items-center gap-3 px-4 pt-12 pb-3 border-b">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-base">评价 {restaurant.name}</h1>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* 评分 */}
        <div>
          <p className="text-sm font-medium mb-2">整体评分</p>
          <div className="flex items-center gap-3">
            <StarRating rating={rating} size={28} interactive onChange={setRating} />
            <span className="text-lg font-bold text-primary-500">{rating}.0</span>
          </div>
        </div>

        {/* 快捷标签 */}
        <div>
          <p className="text-sm font-medium mb-2">快捷标签</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 文字评价 */}
        <div>
          <p className="text-sm font-medium mb-2">详细评价</p>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="分享你的用餐体验..."
            className="w-full h-32 bg-gray-50 rounded-xl p-3 text-sm outline-none resize-none"
            maxLength={500}
          />
          <p className="text-right text-xs text-gray-400 mt-1">{content.length}/500</p>
        </div>

        {/* 图片上传（模拟） */}
        <div>
          <p className="text-sm font-medium mb-2">添加图片</p>
          <button
            className="w-20 h-20 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200"
            onClick={() => showToast('图片上传功能演示', 'info')}
          >
            <Camera size={24} />
            <span className="text-[10px] mt-1">添加</span>
          </button>
        </div>

        {/* 提交 */}
        <button
          className="w-full bg-primary-500 text-white rounded-full py-3 text-sm font-medium active:bg-primary-600"
          onClick={handleSubmit}
        >
          发布评价
        </button>
      </div>
    </div>
  )
}
