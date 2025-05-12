/**
 * Utility functions for API handling
 */

/**
 * Custom hook for handling API requests with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @returns {Object} - { data, loading, error, refetch }
 */
import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunction, initialArgs = [], dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (args = initialArgs) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement retry logic with exponential backoff
      let retries = 0;
      const maxRetries = 2;
      let delay = 1000; // Start with 1 second delay
      
      while (retries <= maxRetries) {
        try {
          const result = await apiFunction(...args);
          setData(result);
          return result;
        } catch (err) {
          if (retries === maxRetries) {
            throw err; // Rethrow if we've exhausted retries
          }
          
          // Only retry on network errors, not on API errors
          if (!err.message.includes('API error')) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            retries++;
          } else {
            throw err; // Don't retry API errors
          }
        }
      }
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, ...dependencies]);

  useEffect(() => {
    fetchData(initialArgs);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Format error messages for display
 * @param {string} error - Error message
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return '';
  
  // Handle common API errors
  if (error.includes('404')) {
    return 'The requested content was not found. Please try again later.';
  }
  
  if (error.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  if (error.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return error;
};

/**
 * Cache API responses
 * @type {Object}
 */
const apiCache = {
  cache: new Map(),
  ttl: 10 * 60 * 1000, // 10 minutes in milliseconds
  
  /**
   * Get cached response
   * @param {string} key - Cache key
   * @returns {any} - Cached response or null
   */
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const { data, timestamp } = cached;
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return data;
  },
  
  /**
   * Set cached response
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
  }
};

export { apiCache };

export default {
  useApi,
  formatErrorMessage,
  apiCache
};