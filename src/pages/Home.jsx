"use client"

import { useState, useEffect } from "react"
import { useApi } from "../utils/apiUtils"
import { fetchLatestManhua, getCoverImage } from "../api/apiClient"
import SearchBar from "../components/SearchBar"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"

/**
 * Home page component
 * @returns {JSX.Element} - Home page component
 */
const Home = () => {
  const [coverUrls, setCoverUrls] = useState({})
  const [activeTab, setActiveTab] = useState("latest")
  const { data, loading, error, refetch } = useApi(fetchLatestManhua, [12])

  // Fetch cover images when manga data is loaded
  useEffect(() => {
    const fetchCovers = async () => {
      if (data?.data) {
        const urls = {}

        // Fetch cover images for each manga
        await Promise.all(
          data.data.map(async (manga) => {
            try {
              const coverUrl = await getCoverImage(manga.id)
              urls[manga.id] = coverUrl
            } catch (error) {
              console.error(`Error fetching cover for ${manga.id}:`, error)
            }
          }),
        )

        setCoverUrls(urls)
      }
    }

    fetchCovers()
  }, [data])

  // Handle search
  const handleSearch = (query) => {
    // Search functionality will be handled by the SearchBar component
    // which will navigate to the search results page
  }

  // Featured manga (using first 3 items from data)
  const featuredManga = data?.data?.slice(0, 3) || []

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-rose-900/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-40"></div>

        {/* Animated particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:w-1/2">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                  Manhua
                </span>
                <span className="block">Limited</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Discover the most captivating Chinese comics with our premium collection updated daily
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <SearchBar onSearch={handleSearch} />
                <div className="absolute -bottom-12 left-0 text-sm text-gray-400">
                  Popular: Fantasy, Action, Romance, Cultivation
                </div>
              </div>
            </div>

            {/* Featured Manga Preview */}
            <div className="w-full md:w-1/2 flex justify-end">
              <div className="relative h-[300px] w-full max-w-md">
                {featuredManga.map((manga, index) => (
                  <div
                    key={manga.id}
                    className="absolute rounded-lg overflow-hidden shadow-[0_0_25px_rgba(255,0,130,0.3)] border border-pink-500/30"
                    style={{
                      width: "70%",
                      height: "90%",
                      top: `${index * 10}%`,
                      right: `${index * 10}%`,
                      zIndex: 3 - index,
                      transform: `rotate(${index * 5 - 5}deg)`,
                      transition: "all 0.5s ease",
                    }}
                  >
                    <div className="relative w-full h-full bg-gradient-to-b from-transparent to-black/80">
                      {coverUrls[manga?.id] ? (
                        <img
                          src={coverUrls[manga.id] || "/placeholder.svg"}
                          alt={manga.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 p-3 w-full">
                        <h3 className="text-sm font-bold truncate">{manga.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              className="fill-[#0f0f1a]"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="mb-12 border-b border-gray-800">
          <div className="flex overflow-x-auto hide-scrollbar space-x-8">
            {["latest", "popular", "new", "completed", "ongoing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-lg font-medium capitalize whitespace-nowrap transition-all ${
                  activeTab === tab ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 animate-fade-in">
            <ErrorMessage error={error} onRetry={refetch} />
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="flex flex-col items-center justify-center py-32">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-400">Discovering amazing manhua...</p>
          </div>
        )}

        {/* Manhua Grid with improved styling */}
        {data?.data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {data.data.map((manga, index) => (
                <div
                  key={manga.id}
                  className="group relative"
                  style={{
                    opacity: 0,
                    animation: "fadeInUp 0.6s ease-out forwards",
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-800 aspect-[3/4] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:scale-105">
                    {/* Manga Cover */}
                    {coverUrls[manga.id] ? (
                      <img
                        src={coverUrls[manga.id] || "/placeholder.svg"}
                        alt={manga.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-pink-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {(Math.random() * 2 + 3).toFixed(1)} ★
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-sm font-bold mb-2 line-clamp-2">{manga.title}</h3>
                      <div className="flex space-x-2">
                        <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded-full transition-colors">
                          Read
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-full transition-colors">
                          + List
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Title (visible when not hovering) */}
                  <h3 className="mt-2 text-sm font-medium text-gray-300 line-clamp-1 group-hover:opacity-0 transition-opacity">
                    {manga.title}
                  </h3>
                  <p className="text-xs text-gray-500 group-hover:opacity-0 transition-opacity">
                    Ch. {Math.floor(Math.random() * 100) + 1}
                  </p>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-12 text-center">
              <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                Load More
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && data?.data?.length === 0 && (
          <div className="text-center py-32 bg-gray-900/50 rounded-2xl">
            <div className="inline-block p-6 rounded-full bg-gray-800/80 mb-6">
              <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No Manhua Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any manhua matching your criteria. Try adjusting your filters or check back later.
            </p>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 mt-20 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                Manhua Limited
              </h2>
              <p className="text-gray-400 mt-2">The ultimate destination for manhua enthusiasts</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                Contact
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                Terms
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Manhua Limited. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              {["Facebook", "Twitter", "Instagram", "Discord"].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-pink-500 text-sm transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default Home
