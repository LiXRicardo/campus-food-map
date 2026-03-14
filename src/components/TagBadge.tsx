interface Props {
  label: string
  active?: boolean
  onClick?: () => void
  color?: string
}

export default function TagBadge({ label, active, onClick, color }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
        active
          ? 'bg-primary-500 text-white'
          : color || 'bg-gray-100 text-gray-600'
      }`}
    >
      {label}
    </button>
  )
}
