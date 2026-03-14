import { useStore } from '../store/useStore'
import { CheckCircle, XCircle, Info } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export default function Toast() {
  const toasts = useStore(s => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2">
      {toasts.map(t => {
        const Icon = icons[t.type]
        return (
          <div
            key={t.id}
            className={`${colors[t.type]} text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-fade-in`}
          >
            <Icon size={16} />
            {t.text}
          </div>
        )
      })}
    </div>
  )
}
