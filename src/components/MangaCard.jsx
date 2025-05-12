"use client"
import { Link } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner"

/**
 * MangaCard component for displaying manhua items
 * @param {Object} props - Component props
 * @param {Object} props.manga - Manga data
 * @param {string} props.coverUrl - Cover image URL
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element} - MangaCard component
 */
const MangaCard = ({ manga, coverUrl, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800/60 rounded-lg overflow-hidden aspect-[3/4] flex items-center justify-center border border-gray-700/50 backdrop-blur-sm">
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

  // Get a short description (first 100 characters)
  const description =
    attributes.description?.en || Object.values(attributes.description || {})[0] || "No description available"
  const shortDescription = description.length > 100 ? `${description.substring(0, 100)}...` : description

  // Generate random rating for demo purposes
  const rating = (Math.random() * 2 + 3).toFixed(1)

  // Generate random chapter number for demo purposes
  const chapterNumber = Math.floor(Math.random() * 100) + 1

  return (
    <Link
      to={`/manga/${id}`}
      className="group relative block bg-gray-800 rounded-lg overflow-hidden aspect-[3/4] transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-105"
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
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
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">No Cover</span>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Rating Badge */}
      <div className="absolute top-2 right-2 bg-pink-500/90 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
        {rating} ★
      </div>

      {/* New Chapter Badge - Only show for some cards randomly */}
      {Math.random() > 0.7 && (
        <div className="absolute top-2 left-2 bg-purple-600/90 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          NEW
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 z-10">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 drop-shadow-md">{title}</h3>

        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-gray-300 bg-gray-800/70 px-2 py-1 rounded-full">Ch. {chapterNumber}</span>
          <span className="text-xs text-gray-300 bg-gray-800/70 px-2 py-1 rounded-full">
            {Math.random() > 0.5 ? "Ongoing" : "Completed"}
          </span>
        </div>

        {/* Description - Only visible on hover */}
        <p className="text-sm text-gray-300 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          {shortDescription}
        </p>

        {/* Action Button - Only visible on hover */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm py-1.5 rounded-md font-medium hover:from-pink-600 hover:to-purple-700 transition-all">
            Read Now
          </button>
        </div>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-purple-500/10"></div>
        <div
          className="absolute -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 group-hover:animate-shine"
          style={{ animationDuration: "1.5s" }}
        ></div>
      </div>
    </Link>
  )
}

// Add keyframes for the shine effect
const MangaCardWithStyles = () => (
  <>
    <style jsx global>{`
      @keyframes shine {
        100% {
          left: 125%;
        }
      }
    `}</style>
    <MangaCard />
  </>
)

export default MangaCard
