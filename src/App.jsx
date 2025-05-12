import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import Details from './pages/Details'
import Reader from './pages/Reader'
import Bookmarks from './pages/Bookmarks'
import { BookmarkProvider } from './utils/BookmarkContext'
import './index.css'

function App() {
  return (
    <BookmarkProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-[#0f0f1a] transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/manga/:id" element={<Details />} />
            <Route path="/reader/:chapterId" element={<Reader />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/latest" element={<Home activeTab="latest" />} />
            <Route path="/popular" element={<Home activeTab="popular" />} />
          </Routes>
        </div>
      </Router>
    </BookmarkProvider>
  )
}

export default App
