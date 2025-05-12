/**
 * API Client for MangaDex API
 * Provides functions for fetching manhua data
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mangadex.org';

/**
 * Fetch the latest updated manhua
 * @param {number} limit - Number of results to return (default: 10)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise<Object>} - Latest manhua data
 */
export const fetchLatestManhua = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/manga?order[latestUploadedChapter]=desc&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching latest manhua:', error);
    throw error;
  }
};

/**
 * Search for manhua by title
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return (default: 10)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise<Object>} - Search results
 */
export const searchManhua = async (query, limit = 10, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/manga?title=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching manhua:', error);
    throw error;
  }
};

/**
 * Get details for a specific manhua
 * @param {string} mangaId - The ID of the manhua
 * @returns {Promise<Object>} - Manhua details
 */
export const getManhuaDetails = async (mangaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/manga/${mangaId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching manhua details:', error);
    throw error;
  }
};

/**
 * Get cover image URL for a manhua
 * @param {string} mangaId - The ID of the manhua
 * @returns {Promise<string>} - Cover image URL
 */
export const getCoverImage = async (mangaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cover?manga[]=${mangaId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const { attributes, relationships } = data.data[0];
      const fileName = attributes.fileName;
      
      // Find the manga ID in relationships if not provided
      const relatedMangaId = mangaId || relationships.find(rel => rel.type === 'manga')?.id;
      
      if (relatedMangaId && fileName) {
        return `https://uploads.mangadex.org/covers/${relatedMangaId}/${fileName}`;
      }
    }
    
    throw new Error('Cover image not found');
  } catch (error) {
    console.error('Error fetching cover image:', error);
    throw error;
  }
};

/**
 * Get chapters for a manhua
 * @param {string} mangaId - The ID of the manhua
 * @param {number} limit - Number of results to return (default: 100)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise<Object>} - Chapter list
 */
export const getChapters = async (mangaId, limit = 100, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};

/**
 * Get pages for a chapter
 * @param {string} chapterId - The ID of the chapter
 * @returns {Promise<Array<string>>} - Array of page URLs
 */
export const getChapterPages = async (chapterId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/at-home/server/${chapterId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const { baseUrl, chapter } = data;
    const { hash, data: pageFilenames } = chapter;
    
    // Construct the full URLs for each page
    const pageUrls = pageFilenames.map(
      (filename) => `${baseUrl}/data/${hash}/${filename}`
    );
    
    return pageUrls;
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    throw error;
  }
};

/**
 * Fetch popular manhua
 * @param {number} limit - Number of results to return (default: 20)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise<Object>} - Popular manhua data
 */
export const fetchPopularManhua = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/manga?order[followedCount]=desc&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular manhua:', error);
    throw error;
  }
};

/**
 * Fetch newly added manhua
 * @param {number} limit - Number of results to return (default: 20)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise<Object>} - New manhua data
 */
export const fetchNewManhua = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/manga?order[createdAt]=desc&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching new manhua:', error);
    throw error;
  }
};

/**
 * Fetch manhua by status
 * @param {string} status - Status to filter by ('ongoing', 'completed', 'hiatus', 'cancelled')
 * @param {number} limit - Number of results to return (default: 20)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise<Object>} - Filtered manhua data
 */
export const fetchManhuaByStatus = async (status, limit = 20, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/manga?status[]=${status}&order[latestUploadedChapter]=desc&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${status} manhua:`, error);
    throw error;
  }
};

/**
 * Get author information
 * @param {string} authorId - The ID of the author
 * @returns {Promise<Object>} - Author data
 */
export const getAuthorInfo = async (authorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/author/${authorId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching author info:', error);
    throw error;
  }
};

/**
 * Fetch manga statistics
 * @param {string} mangaId - The ID of the manga
 * @returns {Promise<Object>} - Manga statistics
 */
export const getMangaStatistics = async (mangaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics/manga/${mangaId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching manga statistics:', error);
    throw error;
  }
};

// Export all functions as a default object
export default {
  fetchLatestManhua,
  searchManhua,
  getManhuaDetails,
  getCoverImage,
  getChapters,
  getChapterPages,
  fetchPopularManhua,
  fetchNewManhua,
  fetchManhuaByStatus,
  getAuthorInfo,
  getMangaStatistics
};