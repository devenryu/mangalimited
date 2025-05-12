import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from '../utils/apiUtils';
import { searchManhua, getCoverImage } from '../api/apiClient';
import MangaCard from '../components/MangaCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * SearchResults page component
 * @returns {JSX.Element} - SearchResults page component
 */
const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [coverUrls, setCoverUrls] = useState({});
  const { data, loading, error, refetch } = useApi(
    searchManhua, 
    [searchQuery, 20], 
    [searchQuery]
  );

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Search Results</h1>
      
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      </div>
      
      {/* Search Results */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Manhua'}
        </h2>
        
        {/* Error Message */}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        
        {/* Loading State */}
        {loading && !data && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}
        
        {/* No Results */}
        {data?.data && data.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found for "{searchQuery}"</p>
          </div>
        )}
        
        {/* Results Grid */}
        {data?.data && data.data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.data.map((manga) => (
              <MangaCard 
                key={manga.id} 
                manga={manga} 
                coverUrl={coverUrls[manga.id]} 
                isLoading={loading && !coverUrls[manga.id]}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResults;