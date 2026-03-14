import { Star } from 'lucide-react'

interface Props {
  rating: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({ rating, size = 14, interactive, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={size}
            className={
              i <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }
          />
        </button>
      ))}
    </div>
  )
}
