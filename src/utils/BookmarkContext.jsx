import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const BookmarkContext = createContext();

// Hook to use the bookmark context
export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

// Bookmark provider component
export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  
  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('mangalimited_bookmarks');
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  }, []);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('mangalimited_bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }, [bookmarks]);
  
  /**
   * Toggle a manga bookmark
   * @param {Object} manga - Manga data object
   */
  const toggleBookmark = (manga) => {
    setBookmarks((prevBookmarks) => {
      const isBookmarked = prevBookmarks.some((item) => item.id === manga.id);
      
      if (isBookmarked) {
        return prevBookmarks.filter((item) => item.id !== manga.id);
      } else {
        return [...prevBookmarks, {
          id: manga.id,
          title: manga.attributes?.title?.en || Object.values(manga.attributes?.title || {})[0] || 'Unknown',
          coverUrl: manga.coverUrl || null,
          addedAt: new Date().toISOString(),
        }];
      }
    });
  };
  
  /**
   * Check if a manga is bookmarked
   * @param {string} mangaId - Manga ID
   * @returns {boolean} - True if bookmarked
   */
  const isBookmarked = (mangaId) => {
    return bookmarks.some((item) => item.id === mangaId);
  };
  
  /**
   * Clear all bookmarks
   */
  const clearBookmarks = () => {
    setBookmarks([]);
  };
  
  // Context value
  const value = {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
  };
  
  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContext; 