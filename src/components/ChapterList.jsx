"use client"
import { Link, useNavigate } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner"

/**
 * ChapterList component for displaying manhua chapters
 * @param {Object} props - Component props
 * @param {Array} props.chapters - Array of chapter data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @returns {JSX.Element} - ChapterList component
 */
const ChapterList = ({ chapters = [], loading = false, error = null }) => {
  const navigate = useNavigate()

  // Loading State
  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <LoadingSpinner size="md" />
        <p className="mt-4 text-gray-400 animate-pulse">Loading chapters...</p>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="py-12 text-center bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-500 mb-2">Failed to Load Chapters</h3>
        <p className="text-gray-400 max-w-md mx-auto">{error}</p>
        <button
          className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  // Empty State
  if (chapters.length === 0) {
    return (
      <div className="py-12 text-center bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700/50 mb-4">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-300 mb-2">No Chapters Available</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          This manhua doesn't have any chapters available yet. Check back later for updates.
        </p>
      </div>
    )
  }

  // Group chapters by volume if available
  const groupedChapters = chapters.reduce((acc, chapter) => {
    const volume = chapter.attributes.volume || "Chapters"
    if (!acc[volume]) {
      acc[volume] = []
    }
    acc[volume].push(chapter)
    return acc
  }, {})

  // Sort volumes numerically
  const sortedVolumes = Object.keys(groupedChapters).sort((a, b) => {
    if (a === "Chapters") return 1
    if (b === "Chapters") return -1
    return Number.parseFloat(a) - Number.parseFloat(b)
  })

  return (
    <div className="bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50 overflow-hidden">
      {sortedVolumes.map((volume) => (
        <div key={volume} className="mb-4 last:mb-0">
          {/* Volume Header */}
          <div className="px-6 py-3 bg-gray-800/70 border-b border-gray-700/50">
            <h3 className="text-lg font-bold text-white">{volume === "Chapters" ? "Chapters" : `Volume ${volume}`}</h3>
          </div>

          {/* Chapter List */}
          <ul className="divide-y divide-gray-700/30">
            {groupedChapters[volume].map((chapter, index) => {
              const { id, attributes } = chapter
              const chapterNum = attributes.chapter || "N/A"
              const title = attributes.title || `Chapter ${chapterNum}`
              const pages = attributes.pages || 0
              const publishDate = attributes.publishAt
                ? new Date(attributes.publishAt).toLocaleDateString()
                : "Unknown date"
              const isNew = publishDate && new Date(publishDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

              return (
                <li
                  key={id}
                  className="hover:bg-gray-700/30 transition-colors duration-200"
                  style={{
                    opacity: 0,
                    animation: "fadeIn 0.3s ease-out forwards",
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-200">Chapter {chapterNum}</h3>
                        {isNew && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-pink-500 text-white rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{title}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          {pages} pages
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {publishDate}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                      <button className="text-gray-400 hover:text-pink-500 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                      <Link
                        to={`/reader/${id}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                        tabIndex={0}
                        aria-label={`Read Chapter ${chapterNum}: ${title}`}
                        onKeyDown={(e) => e.key === "Enter" && navigate(`/reader/${id}`)}
                      >
                        Read Now
                      </Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default ChapterList
