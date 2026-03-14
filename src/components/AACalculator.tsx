import { useState } from 'react'
import { X, Plus, Minus, Users, Calculator } from 'lucide-react'

interface Props {
  visible: boolean
  onClose: () => void
}

export default function AACalculator({ visible, onClose }: Props) {
  const [items, setItems] = useState([
    { name: '', price: 0 },
  ])
  const [people, setPeople] = useState(2)

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0)
  const perPerson = people > 0 ? Math.ceil(total / people * 100) / 100 : 0

  const addItem = () => {
    setItems([...items, { name: '', price: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: 'name' | 'price', value: string | number) => {
    setItems(items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ))
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
      <div className="bg-white w-full max-w-[430px] mx-auto rounded-t-2xl max-h-[85vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-primary-500" />
            <h2 className="font-bold">AA计算器</h2>
          </div>
          <button onClick={onClose}>
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* 人数选择 */}
          <div className="bg-primary-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary-500" />
                <span className="text-sm font-medium">用餐人数</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm active:bg-gray-50"
                  onClick={() => setPeople(Math.max(1, people - 1))}
                >
                  <Minus size={16} className="text-gray-600" />
                </button>
                <span className="text-xl font-bold text-primary-500 w-8 text-center">{people}</span>
                <button
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm active:bg-gray-50"
                  onClick={() => setPeople(people + 1)}
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* 菜品列表 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">菜品明细</h3>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-300"
                    placeholder="菜品名称"
                    value={item.name}
                    onChange={e => updateItem(index, 'name', e.target.value)}
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">¥</span>
                    <input
                      type="number"
                      className="w-full border border-gray-200 rounded-lg pl-6 pr-2 py-2 text-sm text-right focus:outline-none focus:border-primary-300"
                      placeholder="0"
                      value={item.price || ''}
                      onChange={e => updateItem(index, 'price', Number(e.target.value))}
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      className="text-gray-300 active:text-red-400"
                      onClick={() => removeItem(index)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              className="w-full mt-2 border border-dashed border-gray-200 rounded-lg py-2 text-sm text-gray-400 flex items-center justify-center gap-1"
              onClick={addItem}
            >
              <Plus size={14} /> 添加菜品
            </button>
          </div>

          {/* 结果 */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-white/70">总计</span>
              <span className="text-lg font-bold">¥{total.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/20 pt-3 flex justify-between items-center">
              <span className="text-sm text-white/70">每人应付</span>
              <span className="text-2xl font-bold">¥{perPerson.toFixed(2)}</span>
            </div>
          </div>

          {/* 快捷金额 */}
          <div>
            <p className="text-xs text-gray-400 mb-2">快捷输入总金额</p>
            <div className="flex gap-2">
              {[50, 80, 100, 150, 200].map(amount => (
                <button
                  key={amount}
                  className="flex-1 border border-gray-200 rounded-lg py-2 text-sm text-gray-600 active:bg-primary-50 active:border-primary-300"
                  onClick={() => setItems([{ name: '聚餐', price: amount }])}
                >
                  ¥{amount}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
