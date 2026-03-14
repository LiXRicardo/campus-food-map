import { Routes, Route, useLocation } from 'react-router-dom'
import BottomNavBar from './components/BottomNavBar'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import SearchPage from './pages/SearchPage'
import RestaurantDetailPage from './pages/RestaurantDetailPage'
import WriteReviewPage from './pages/WriteReviewPage'
import ProfilePage from './pages/ProfilePage'
import FavoritesPage from './pages/FavoritesPage'
import CommunityPage from './pages/CommunityPage'
import AuthPage from './pages/AuthPage'
import TaskCenterPage from './pages/TaskCenterPage'
import QueueServicePage from './pages/QueueServicePage'

const HIDE_NAV_ROUTES = ['/restaurant/', '/write-review/', '/favorites', '/auth', '/tasks', '/queue-service']

export default function App() {
  const location = useLocation()
  const hideNav = HIDE_NAV_ROUTES.some(r => location.pathname.startsWith(r))

  return (
    <div className="app-container">
      <Toast />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/write-review/:id" element={<WriteReviewPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/tasks" element={<TaskCenterPage />} />
        <Route path="/queue-service" element={<QueueServicePage />} />
      </Routes>
      {!hideNav && <BottomNavBar />}
    </div>
  )
}
