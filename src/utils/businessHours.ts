import { BusinessHours } from '../types'

export function isOpen(hours: BusinessHours): boolean {
  const now = new Date()
  const current = now.getHours() * 60 + now.getMinutes()
  const [oh, om] = hours.open.split(':').map(Number)
  const [ch, cm] = hours.close.split(':').map(Number)
  const open = oh * 60 + om
  const close = ch * 60 + cm

  // 跨午夜（如 17:00 - 02:00）
  if (close < open) {
    return current >= open || current < close
  }
  return current >= open && current < close
}

export function getBusinessStatus(hours: BusinessHours): { text: string; color: string } {
  if (isOpen(hours)) {
    return { text: `营业中 · ${hours.open}-${hours.close}`, color: 'text-green-600' }
  }
  return { text: `已打烊 · ${hours.open}-${hours.close}`, color: 'text-gray-400' }
}
