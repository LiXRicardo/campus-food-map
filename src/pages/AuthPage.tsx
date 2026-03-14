import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, GraduationCap, Camera, CheckCircle } from 'lucide-react'
import { useStore } from '../store/useStore'

type Step = 'input' | 'verifying' | 'success'

export default function AuthPage() {
  const navigate = useNavigate()
  const { user, updateUser, showToast } = useStore()
  const [step, setStep] = useState<Step>(user.isVerified ? 'success' : 'input')
  const [school, setSchool] = useState(user.school || '')
  const [studentId, setStudentId] = useState('')
  const [realName, setRealName] = useState('')
  const [grade, setGrade] = useState(user.grade || '研二')

  const handleSubmit = () => {
    if (!school || !studentId || !realName) {
      showToast('请填写完整信息', 'error')
      return
    }
    setStep('verifying')
    // 模拟验证过程
    setTimeout(() => {
      updateUser({ isVerified: true, school, grade })
      setStep('success')
      showToast('认证成功 +50积分', 'success')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold">学生认证</h1>
      </div>

      {/* 认证说明 */}
      <div className="mx-4 mt-4 bg-blue-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={18} className="text-blue-500" />
          <span className="text-sm font-medium text-blue-700">为什么需要认证？</span>
        </div>
        <ul className="text-xs text-blue-600 space-y-1 ml-6 list-disc">
          <li>认证用户评价标注「已认证」徽章，更可信</li>
          <li>解锁代取号打赏、发布特价等社区功能</li>
          <li>获得50积分奖励，提升等级更快</li>
          <li>享受学生专属优惠和活动</li>
        </ul>
      </div>

      {step === 'input' && (
        <div className="mx-4 mt-4 bg-white rounded-xl p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">学校</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-300"
              value={school}
              onChange={e => setSchool(e.target.value)}
            >
              <option value="">请选择学校</option>
              <option value="北京邮电大学">北京邮电大学</option>
              <option value="北京航空航天大学">北京航空航天大学</option>
              <option value="清华大学">清华大学</option>
              <option value="北京师范大学">北京师范大学</option>
              <option value="中国人民大学">中国人民大学</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">年级</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-300"
              value={grade}
              onChange={e => setGrade(e.target.value)}
            >
              <option value="大一">大一</option>
              <option value="大二">大二</option>
              <option value="大三">大三</option>
              <option value="大四">大四</option>
              <option value="研一">研一</option>
              <option value="研二">研二</option>
              <option value="研三">研三</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">真实姓名</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-300"
              placeholder="请输入真实姓名"
              value={realName}
              onChange={e => setRealName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">学号</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-300"
              placeholder="请输入学号"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">学生证照片</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 text-gray-400">
              <Camera size={28} />
              <span className="text-xs">点击上传学生证照片</span>
            </div>
          </div>

          <button
            className="w-full bg-primary-500 text-white rounded-full py-3 text-sm font-medium active:bg-primary-600"
            onClick={handleSubmit}
          >
            提交认证
          </button>
        </div>
      )}

      {step === 'verifying' && (
        <div className="mx-4 mt-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-600">正在验证学生身份...</p>
          <p className="text-xs text-gray-400">通常在几秒内完成</p>
        </div>
      )}

      {step === 'success' && (
        <div className="mx-4 mt-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <p className="text-base font-bold text-gray-800">认证成功！</p>
          <div className="bg-white rounded-xl p-4 w-full text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <GraduationCap size={18} className="text-primary-500" />
              <span className="font-medium">{user.school} · {user.grade}</span>
            </div>
            <p className="text-xs text-gray-400">你的评价将展示「已认证」标识</p>
            <div className="flex gap-2 justify-center mt-3">
              <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full">可信评价</span>
              <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full">代取号</span>
              <span className="text-xs px-3 py-1 bg-orange-50 text-orange-600 rounded-full">发特价</span>
            </div>
          </div>
          <button
            className="w-full bg-primary-500 text-white rounded-full py-3 text-sm font-medium mt-4"
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </div>
      )}
    </div>
  )
}
