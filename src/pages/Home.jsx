"use client"

import { useState, useEffect } from "react"
import { useApi } from "../utils/apiUtils"
import { fetchLatestManhua, fetchPopularManhua, fetchNewManhua, fetchManhuaByStatus, getCoverImage } from "../api/apiClient"
import SearchBar from "../components/SearchBar"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import MangaCard from "../components/MangaCard"
import Navbar from "../components/Navbar"

/**
 * Home page component
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Active tab
 * @returns {JSX.Element} - Home page component
 */
const Home = ({ activeTab: initialTab = "latest" }) => {
  const [coverUrls, setCoverUrls] = useState({})
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isLoading, setIsLoading] = useState(true)
  
  // Get appropriate API function based on active tab
  const getApiFunction = () => {
    switch (activeTab) {
      case "popular":
        return fetchPopularManhua;
      case "new":
        return fetchNewManhua;
      case "completed":
        return () => fetchManhuaByStatus("completed");
      case "ongoing":
        return () => fetchManhuaByStatus("ongoing");
      case "latest":
      default:
        return fetchLatestManhua;
    }
  };
  
  const { data, loading, error, refetch } = useApi(getApiFunction(), [12]);
  
  // Set global loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Refetch when tab changes
  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

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

  // When page is initially loading, show a full-page loader
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#0f0f1a] z-50">
        <div className="text-center">
          <div className="inline-block w-20 h-20 mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-purple-500 border-b-transparent animate-spin animate-reverse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 text-xl font-bold">ML</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading your manhua...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f1a] text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/70 via-purple-600/60 to-blue-600/50 z-10"></div>
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                animation: `float ${Math.random() * 8 + 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Hero Text */}
            <div className="mb-10 md:mb-0 md:w-1/2 animate-fade-in">
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6">
                The ultimate manga experience
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                  Manhua
                </span>
                <span className="block text-white">Limited</span>
              </h1>
              <p className="text-xl text-gray-100 mb-8 max-w-lg">
                Discover the most captivating Chinese comics with our premium collection updated daily
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <SearchBar onSearch={handleSearch} />
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Fantasy', 'Action', 'Romance', 'Cultivation'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => handleSearch(tag)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Manga Preview */}
            <div className="w-full md:w-1/2 flex justify-end">
              <div className="relative h-[350px] w-full max-w-lg">
                {featuredManga.map((manga, index) => (
                  <div
                    key={manga.id}
                    className="absolute rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-white/10"
                    style={{
                      width: "80%",
                      height: "90%",
                      top: `${index * 8}%`,
                      right: `${index * 8}%`,
                      zIndex: 3 - index,
                      transform: `rotate(${index * 3 - 3}deg)`,
                      animation: "fadeInRight 0.7s ease-out forwards",
                      animationDelay: `${0.2 + index * 0.2}s`,
                      opacity: 0,
                    }}
                  >
                    <div className="relative w-full h-full bg-gradient-to-b from-transparent to-black/90">
                      {coverUrls[manga?.id] ? (
                        <img
                          src={coverUrls[manga.id] || "/placeholder.svg"}
                          alt={manga.attributes.title.en || Object.values(manga.attributes.title)[0]}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="text-lg font-bold text-white truncate drop-shadow-md">
                          {manga.attributes.title.en || Object.values(manga.attributes.title)[0]}
                        </h3>
                        <div className="flex items-center mt-2">
                          <span className="px-2 py-1 bg-pink-500/70 rounded-md text-white text-xs font-medium">
                            Read Now
                          </span>
                        </div>
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
              className="fill-white dark:fill-[#0f0f1a]"
            ></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="mb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="flex overflow-x-auto hide-scrollbar space-x-8">
            {["latest", "popular", "new", "completed", "ongoing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-lg font-medium capitalize whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? "text-pink-500 border-b-2 border-pink-500 relative" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></span>
                )}
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
            <p className="mt-4 text-gray-500 dark:text-gray-400">Discovering amazing manhua...</p>
          </div>
        )}

        {/* Manhua Grid */}
        {data?.data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6">
              {data.data.map((manga, index) => (
                <div
                  key={manga.id}
                  style={{
                    opacity: 0,
                    animation: "fadeInUp 0.6s ease-out forwards",
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  <MangaCard manga={manga} coverUrl={coverUrls[manga.id]} />
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="flex justify-center mt-14">
              <button
                onClick={() => refetch([24])}
                className="group relative overflow-hidden px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <span className="relative z-10 flex items-center">
                  <span>Load More</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-500/20 dark:to-purple-600/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity"></div>
              </button>
            </div>
          </>
        )}
      </section>
      
      {/* Add keyframes for animations */}
      <style jsx global>{`
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
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px) rotate(var(--rotation, 0deg));
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(var(--rotation, 0deg));
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes animate-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        
        .animate-reverse {
          animation: animate-reverse 1.5s linear infinite;
        }
        
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  )
}

export default Home
