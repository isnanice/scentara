import { Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Footer from './components/Footer.jsx'
import PWABadge from './components/PWABadge.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import HomePage from './pages/HomePage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import PerfumeDetailPage from './pages/PerfumeDetailPage.jsx'
import NotesPage from './pages/NotesPage.jsx'
import NoteDetailPage from './pages/NoteDetailPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import BrandsPage from './pages/BrandsPage.jsx'
import ScentProfilesPage from './pages/ScentProfilesPage.jsx'
import ComparePage from './pages/ComparePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import './App.css'

function App() {
  return (
    <div className="shell">
      <ScrollToTop />
      <Header />

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/katalog" element={<CatalogPage />} />
          <Route path="/bandingkan" element={<ComparePage />} />
          <Route path="/parfum/:id" element={<PerfumeDetailPage />} />
          <Route path="/brand" element={<BrandsPage />} />
          <Route path="/aroma" element={<ScentProfilesPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:id" element={<NoteDetailPage />} />
          <Route path="/ulasan" element={<ReviewsPage />} />
          <Route path="/favorit" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tentang" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <PWABadge />
      <BottomNav />
    </div>
  )
}

export default App
