import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApi } from '../utils/apiUtils';
import { searchManhua, getCoverImage } from '../api/apiClient';
import MangaCard from '../components/MangaCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Navbar from '../components/Navbar';

/**
 * SearchResults page component
 * @returns {JSX.Element} - SearchResults page component
 */
const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [coverUrls, setCoverUrls] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const { data, loading, error, refetch } = useApi(
    searchManhua, 
    [searchQuery, 24], 
    [searchQuery]
  );

  // Set global loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Fetch cover images when manga data is loaded
  useEffect(() => {
    const fetchCovers = async () => {
      if (data?.data) {
        const urls = {};
        
        // Fetch cover images for each manga
        await Promise.all(
          data.data.map(async (manga) => {
            try {
              const coverUrl = await getCoverImage(manga.id);
              urls[manga.id] = coverUrl;
            } catch (error) {
              console.error(`Error fetching cover for ${manga.id}:`, error);
            }
          })
        );
        
        setCoverUrls(urls);
      }
    };

    fetchCovers();
  }, [data]);

  // Handle search
  const handleSearch = (query) => {
    // The SearchBar component will handle navigation
  };

  // Global loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f1a] text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <div className="fixed inset-0 flex items-center justify-center bg-white/70 dark:bg-[#0f0f1a]/70 backdrop-blur-sm z-50">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse">Searching for manga...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f1a] text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <div 
            className="text-center animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">Search Results</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-pink-500/20 dark:bg-pink-500/30 rounded -z-10"></span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {searchQuery 
                ? `Showing results for "${searchQuery}"`
                : 'Browse our entire collection'
              }
            </p>
          </div>
          
          {/* Enhanced Search Bar */}
          <div 
            className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700/50 mb-12 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
            
            {/* Popular Tags */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {['Action', 'Fantasy', 'Romance', 'Comedy', 'Drama', 'Cultivation', 'Martial Arts'].map(tag => (
                  <Link 
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-pink-100 dark:hover:bg-pink-800/30 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Results Section */}
        <div 
          className="max-w-7xl mx-auto animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          {/* Results Info */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-pink-500">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
              </svg>
              {data?.data ? `Found ${data.data.length} results` : 'Searching...'}
            </h2>
            
            {/* Sort Dropdown - Could be implemented */}
            <div className="hidden md:block">
              <select 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="newest">Sort by: Newest</option>
                <option value="popular">Sort by: Popularity</option>
              </select>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="animate-fade-in mb-8">
              <ErrorMessage error={error} onRetry={refetch} />
            </div>
          )}
          
          {/* Loading State */}
          {loading && !data && (
            <div className="flex flex-col items-center justify-center py-32">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">Searching for manga...</p>
            </div>
          )}
          
          {/* No Results */}
          {data?.data && data.data.length === 0 && (
            <div className="bg-white dark:bg-gray-800/60 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700/50 shadow-md animate-fade-in">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400 dark:text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                We couldn't find any manga matching "{searchQuery}". Try using different keywords or browse our collection.
              </p>
              <Link 
                to="/"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/25"
              >
                Browse Popular Manga
              </Link>
            </div>
          )}
          
          {/* Results Grid */}
          {data?.data && data.data.length > 0 && (
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
                  <MangaCard 
                    manga={manga} 
                    coverUrl={coverUrls[manga.id]} 
                    isLoading={loading && !coverUrls[manga.id]}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination - Could be implemented */}
          {data?.data && data.data.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => refetch([searchQuery, 24])}
                className="group relative overflow-hidden px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <span className="relative z-10 flex items-center">
                  <span>Load More</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-500/20 dark:to-purple-600/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity"></div>
              </button>
            </div>
          )}
        </div>
      </div>
      
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SearchResults;