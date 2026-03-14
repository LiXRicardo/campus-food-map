import { NavLink } from 'react-router-dom'
import { Home, Map, MessageCircle, User, Shuffle } from 'lucide-react'
import { useState } from 'react'
import ShakeRecommend from './ShakeRecommend'

const tabs = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/community', icon: MessageCircle, label: '社区' },
  { to: '#shake', icon: Shuffle, label: '吃什么', isCenter: true },
  { to: '/map', icon: Map, label: '地图' },
  { to: '/profile', icon: User, label: '我的' },
]

export default function BottomNavBar() {
  const [showShake, setShowShake] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 z-50">
        <div className="flex justify-around items-center h-14">
          {tabs.map(({ to, icon: Icon, label, isCenter }) => {
            if (isCenter) {
              return (
                <button
                  key={to}
                  className="flex flex-col items-center gap-0.5 -mt-4"
                  onClick={() => setShowShake(true)}
                >
                  <div className="w-11 h-11 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-[10px] text-primary-500 font-medium">{label}</span>
                </button>
              )
            }
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 text-xs ${
                    isActive ? 'text-primary-500' : 'text-gray-400'
                  }`
                }
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            )
          })}
        </div>
        {/* safe area bottom */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      <ShakeRecommend visible={showShake} onClose={() => setShowShake(false)} />
    </>
  )
}
