"use client"
import { Link } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner"
import { useBookmarks } from "../utils/BookmarkContext"

/**
 * MangaCard component for displaying manhua items
 * @param {Object} props - Component props
 * @param {Object} props.manga - Manga data
 * @param {string} props.coverUrl - Cover image URL
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element} - MangaCard component
 */
const MangaCard = ({ manga, coverUrl, isLoading = false }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  if (isLoading) {
    return (
      <div className="bg-gray-800/60 rounded-xl overflow-hidden aspect-[3/4] flex items-center justify-center border border-gray-700/50 backdrop-blur-sm shadow-lg">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="md" />
          <span className="text-gray-400 text-xs mt-2">Loading...</span>
        </div>
      </div>
    )
  }

  if (!manga) return null

  const { id, attributes } = manga
  const title = attributes.title.en || Object.values(attributes.title)[0] || "Unknown Title"
  const bookmarked = isBookmarked(id);

  // Get a short description (first 100 characters)
  const description =
    attributes.description?.en || Object.values(attributes.description || {})[0] || "No description available"
  const shortDescription = description.length > 100 ? `${description.substring(0, 100)}...` : description

  // Generate random rating for demo purposes
  const rating = (Math.random() * 2 + 3).toFixed(1)

  // Generate random chapter number for demo purposes
  const chapterNumber = Math.floor(Math.random() * 100) + 1
  
  // Generate random status for demo purposes
  const status = Math.random() > 0.5 ? "Ongoing" : "Completed"
  
  // Handle bookmark toggle
  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark({
      id,
      attributes,
      coverUrl
    });
  };

  return (
    <div className="group relative block rounded-xl overflow-hidden shadow-md hover:shadow-xl aspect-[3/4] transition-all duration-300 hover:scale-[1.03]">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -z-10"></div>
      
      {/* Card Content */}
      <div className="absolute inset-0 bg-gray-800 dark:bg-gray-900/95 rounded-xl overflow-hidden z-0">
        {/* Cover Image */}
        <div className="absolute inset-0 overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl || "/placeholder.svg"}
              alt={`Cover for ${title}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-gray-400">No Cover</span>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-10">
          {/* Left Badge */}
          <div className="flex space-x-2">
            {/* New Chapter Badge - Only show for some cards randomly */}
            {Math.random() > 0.7 && (
              <div className="bg-purple-600/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                NEW
              </div>
            )}
            
            {/* Status Badge */}
            <div className={`text-white text-xs font-medium px-2 py-1 rounded-full ${
              status === "Ongoing" 
                ? "bg-green-600/80" 
                : "bg-blue-600/80"
            }`}>
              {status}
            </div>
          </div>
          
          {/* Rating Badge */}
          <div className="bg-yellow-500/90 text-white text-xs font-medium px-2 py-1 rounded-full">
            {rating} ★
          </div>
        </div>
        
        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkToggle}
          className={`absolute right-3 top-12 z-20 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
            bookmarked
              ? 'bg-yellow-500 text-white translate-y-0'
              : 'bg-black/40 text-white/80 translate-y-12 group-hover:translate-y-0'
          }`}
          aria-label={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d={
                bookmarked
                  ? "M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                  : "M6.75 3.75h10.5a1.5 1.5 0 011.5 1.5v14.357a.75.75 0 01-1.154.632L12 17.21l-5.596 3.03a.75.75 0 01-1.154-.632V5.25a1.5 1.5 0 011.5-1.5z"
              }
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Content */}
        <Link to={`/manga/${id}`} className="absolute inset-x-0 bottom-0 p-4 z-10">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-2 drop-shadow-md">
            {title}
          </h3>

          {/* Chapter Info */}
          <div className="flex items-center mb-2.5 text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
            </svg>
            <span>Ch. {chapterNumber}</span>
          </div>

          {/* Description - Only visible on hover */}
          <div className="relative overflow-hidden h-0 group-hover:h-16 transition-all duration-300">
            <p className="text-sm text-gray-300 line-clamp-3">
              {shortDescription}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-3 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/25">
              Read Now
            </button>
          </div>
        </Link>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-10">
        <div
          className="absolute -inset-full h-full w-1/3 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine"
          style={{ animationDuration: "1.5s" }}
        ></div>
      </div>
    </div>
  )
}

// Add keyframes for the shine effect in global CSS
const MangaCardWithStyles = () => (
  <>
    <style jsx global>{`
      @keyframes shine {
        0% { left: -100%; opacity: 0; }
        20% { opacity: 0.5; }
        100% { left: 100%; opacity: 0; }
      }
    `}</style>
    <MangaCard />
  </>
)

export default MangaCard
