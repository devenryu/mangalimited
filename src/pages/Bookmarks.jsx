import { useState, useEffect } from 'react';
import { useBookmarks } from '../utils/BookmarkContext';
import { Link } from 'react-router-dom';
import MangaCard from '../components/MangaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

/**
 * Bookmarks page component
 * @returns {JSX.Element} - Bookmarks page component
 */
const Bookmarks = () => {
  const { bookmarks, clearBookmarks } = useBookmarks();
  const [isGridView, setIsGridView] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'alphabetical'
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Set global loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle sorting
  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.addedAt) - new Date(a.addedAt);
    } else if (sortOrder === 'oldest') {
      return new Date(a.addedAt) - new Date(b.addedAt);
    } else if (sortOrder === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  // Handle clearing all bookmarks
  const handleClearBookmarks = () => {
    clearBookmarks();
    setShowClearConfirm(false);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f1a] text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f1a] text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-3 text-pink-500">
                  <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                </svg>
                My Bookmarks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {bookmarks.length === 0
                  ? 'You have no bookmarks yet.'
                  : `You have ${bookmarks.length} bookmark${bookmarks.length === 1 ? '' : 's'}.`}
              </p>
            </div>
            
            {bookmarks.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shadow-inner">
                  <button
                    onClick={() => setIsGridView(true)}
                    className={`p-2 rounded-md transition-all ${
                      isGridView
                        ? 'bg-white dark:bg-gray-700 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    aria-label="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsGridView(false)}
                    className={`p-2 rounded-md transition-all ${
                      !isGridView
                        ? 'bg-white dark:bg-gray-700 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    aria-label="List view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {/* Sort Order */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
                
                {/* Clear All Button */}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Clear All
                  </span>
                </button>
              </div>
            )}
          </div>
          
          {/* Confirmation Dialog */}
          {showClearConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-600 dark:text-red-400">
                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Clear All Bookmarks?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  This will remove all your bookmarked manga. This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearBookmarks}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-16 h-16 text-gray-300 dark:text-gray-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">No bookmarks yet</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                Start adding your favorite manga to bookmarks to keep track of what you want to read.
              </p>
              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/25"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  Discover Manga
                </span>
              </Link>
            </div>
          ) : isGridView ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6">
              {sortedBookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.id}
                  style={{
                    opacity: 0,
                    animation: "fadeInUp 0.6s ease-out forwards",
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <MangaCard
                    manga={{ id: bookmark.id, attributes: { title: { en: bookmark.title } } }}
                    coverUrl={bookmark.coverUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedBookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.id}
                  className="group bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden flex items-center hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
                  style={{
                    opacity: 0,
                    animation: "fadeInUp 0.6s ease-out forwards",
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div className="w-28 h-28 flex-shrink-0 relative overflow-hidden">
                    {bookmark.coverUrl ? (
                      <img
                        src={bookmark.coverUrl}
                        alt={bookmark.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Cover</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-pink-500 transition-colors">{bookmark.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                      </svg>
                      Added on {new Date(bookmark.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 flex-shrink-0">
                    <Link
                      to={`/manga/${bookmark.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks; 