import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SearchBar component with debounced input
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Search callback function
 * @param {string} props.initialQuery - Initial search query
 * @param {boolean} props.autoNavigate - Whether to automatically navigate to search results page
 * @returns {JSX.Element} - SearchBar component
 */
const SearchBar = ({ onSearch, initialQuery = '', autoNavigate = true }) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const navigate = useNavigate();

  // Debounce the search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timerId);
  }, [query]);

  // Call onSearch when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch?.(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  // Handle search submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (query.trim() && autoNavigate) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [query, navigate, autoNavigate]);

  // Handle input change
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for manhua..."
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search for manhua"
            tabIndex={0}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <button
          type="submit"
          className="absolute right-0 top-0 mt-2 mr-2 bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Submit search"
          tabIndex={0}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;