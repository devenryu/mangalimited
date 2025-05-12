import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import Details from './pages/Details'
import Reader from './pages/Reader'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/manga/:id" element={<Details />} />
          <Route path="/reader/:chapterId" element={<Reader />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
