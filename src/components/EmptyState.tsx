import { SearchX } from 'lucide-react'

interface Props {
  message?: string
}

export default function EmptyState({ message = '暂无数据' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <SearchX size={48} strokeWidth={1.5} />
      <p className="mt-3 text-sm">{message}</p>
    </div>
  )
}
