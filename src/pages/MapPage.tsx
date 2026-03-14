import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { Star, MapPin, Navigation } from 'lucide-react'
import { restaurants, CAMPUS_CENTER } from '../data/restaurants'
import { Restaurant } from '../types'
import { getBusinessStatus } from '../utils/businessHours'

// Fix default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Restaurant | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current).setView(
      [CAMPUS_CENTER.lat, CAMPUS_CENTER.lng],
      16
    )
    mapInstance.current = map

    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      attribution: '&copy; 高德地图',
      maxZoom: 18,
      subdomains: '1234',
    }).addTo(map)

    restaurants.forEach(r => {
      const marker = L.marker([r.lat, r.lng])
        .addTo(map)
        .bindTooltip(r.name, { direction: 'top', offset: [0, -10] })

      marker.on('click', () => setSelected(r))
    })

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  const status = selected ? getBusinessStatus(selected.businessHours) : null

  return (
    <div className="h-screen relative">
      <div ref={mapRef} className="h-full w-full" />

      {/* 定位按钮 */}
      <button
        className="absolute top-4 right-4 z-[1000] bg-white rounded-full p-2.5 shadow-lg"
        onClick={() => {
          mapInstance.current?.setView([CAMPUS_CENTER.lat, CAMPUS_CENTER.lng], 16)
        }}
      >
        <Navigation size={20} className="text-primary-500" />
      </button>

      {/* 底部面板 */}
      {selected && (
        <div
          className="absolute bottom-20 left-4 right-4 z-[1000] bg-white rounded-2xl p-4 shadow-xl"
          onClick={() => navigate(`/restaurant/${selected.id}`)}
        >
          <div className="flex gap-3">
            <img
              src={selected.coverImage}
              alt={selected.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{selected.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{selected.rating}</span>
                <span className="text-xs text-gray-400">· {selected.category}</span>
                <span className="text-xs text-primary-500 ml-auto">¥{selected.avgPrice}/人</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                <MapPin size={12} />
                <span className="truncate">{selected.address}</span>
              </div>
              <span className={`text-xs mt-1 inline-block ${status?.color}`}>
                {status?.text}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
