import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../utils/apiUtils';
import { getManhuaDetails, getCoverImage, getChapters } from '../api/apiClient';
import ChapterList from '../components/ChapterList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Details page component for displaying manhua details and chapters
 * @returns {JSX.Element} - Details page component
 */
const Details = () => {
  const { id } = useParams();
  const [coverUrl, setCoverUrl] = useState('');
  
  // Fetch manhua details
  const { 
    data: mangaData, 
    loading: mangaLoading, 
    error: mangaError,
    refetch: refetchManga 
  } = useApi(getManhuaDetails, [id], [id]);
  
  // Fetch chapters
  const { 
    data: chaptersData, 
    loading: chaptersLoading, 
    error: chaptersError,
    refetch: refetchChapters 
  } = useApi(getChapters, [id], [id]);

  // Fetch cover image when manga data is loaded
  useEffect(() => {
    const fetchCover = async () => {
      if (mangaData?.data) {
        try {
          const url = await getCoverImage(id);
          setCoverUrl(url);
        } catch (error) {
          console.error('Error fetching cover image:', error);
        }
      }
    };

    fetchCover();
  }, [mangaData, id]);

  // Handle retry for both manga and chapters
  const handleRetry = () => {
    refetchManga();
    refetchChapters();
  };

  // Loading state
  if ((mangaLoading && !mangaData) || (chaptersLoading && !chaptersData)) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (mangaError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage error={mangaError} onRetry={handleRetry} />
        <Link 
          to="/" 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          tabIndex={0}
          aria-label="Return to home page"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // If we have manga data but no chapters data yet
  if (!mangaData?.data) return null;

  const { attributes } = mangaData.data;
  const title = attributes.title.en || Object.values(attributes.title)[0] || 'Unknown Title';
  const description = attributes.description?.en || Object.values(attributes.description || {})[0] || 'No description available';
  
  // Get alternative titles
  const altTitles = attributes.altTitles?.map(title => {
    const titleValue = Object.values(title)[0];
    return titleValue;
  }).filter(Boolean) || [];
  
  // Get tags/genres
  const tags = attributes.tags?.map(tag => tag.attributes?.name?.en || Object.values(tag.attributes?.name || {})[0]).filter(Boolean) || [];
  
  // Get status and demographic
  const status = attributes.status || 'Unknown';
  const demographic = attributes.publicationDemographic || 'Unknown';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link 
        to="/" 
        className="mb-6 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        tabIndex={0}
        aria-label="Return to home page"
      >
        &larr; Back to Home
      </Link>
      
      {/* Manga details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          {/* Cover image */}
          <div className="md:flex-shrink-0 md:w-1/3 p-4">
            {coverUrl ? (
              <img 
                src={coverUrl} 
                alt={`Cover for ${title}`} 
                className="w-full h-auto object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                {mangaLoading ? <LoadingSpinner size="md" /> : <span className="text-gray-400">No Cover</span>}
              </div>
            )}
          </div>
          
          {/* Details */}
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            
            {/* Alternative titles */}
            {altTitles.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Alternative Titles</h2>
                <ul className="text-sm text-gray-600">
                  {altTitles.map((altTitle, index) => (
                    <li key={index}>{altTitle}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Genres</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Status and demographic */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Status</h2>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Demographic</h2>
                <p className="text-sm text-gray-600 capitalize">{demographic}</p>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-sm text-gray-600 whitespace-pre-line">{description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chapters section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
        <ChapterList 
          chapters={chaptersData?.data || []} 
          loading={chaptersLoading} 
          error={chaptersError} 
        />
      </div>
    </div>
  );
};

export default Details;