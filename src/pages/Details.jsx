import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../utils/apiUtils';
import { getManhuaDetails, getCoverImage, getChapters } from '../api/apiClient';
import ChapterList from '../components/ChapterList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Navbar from '../components/Navbar';
import { useBookmarks } from '../utils/BookmarkContext';

/**
 * Details page component for displaying manhua details and chapters
 * @returns {JSX.Element} - Details page component
 */
const Details = () => {
  const { id } = useParams();
  const [coverUrl, setCoverUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(id);
  
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

  // Set global loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (mangaData?.data) {
      toggleBookmark({
        id,
        attributes: mangaData.data.attributes,
        coverUrl
      });
    }
  };

  // Loading state
  if (isLoading || (mangaLoading && !mangaData) || (chaptersLoading && !chaptersData)) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f1a] text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-48 h-48 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-pink-500 animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-4 border-b-transparent border-purple-500 animate-spin animate-reverse"></div>
              <div className="absolute inset-8 rounded-full border-4 border-l-transparent border-blue-500 animate-spin" style={{ animationDuration: '3s' }}></div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Loading Manga Details</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              Getting all the juicy details for this amazing manga...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (mangaError) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f1a] text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <ErrorMessage error={mangaError} onRetry={handleRetry} />
            <div className="mt-8 text-center">
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/25"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
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
  
  // Get publication year
  const year = attributes.year || 'Unknown';

  // Generate random rating for demo
  const rating = (Math.random() * 2 + 3).toFixed(1);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f1a] text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      {/* Manga Hero Banner */}
      <div className="relative overflow-hidden">
        {/* Background Cover - Blurred */}
        {coverUrl && (
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-10 blur-2xl scale-110"
              style={{ backgroundImage: `url(${coverUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-pink-600/20 via-purple-600/20 to-blue-600/20 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-blue-900/30 z-10"></div>
            <div className="absolute inset-0 bg-white/60 dark:bg-[#0f0f1a]/80 z-20"></div>
          </div>
        )}
        
        {/* Manga Details Wrapper */}
        <div className="container mx-auto px-4 py-8 relative z-30 animate-fade-in">
          {/* Navigation and Actions */}
          <div className="flex justify-between items-center mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </Link>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmarkToggle}
                className={`p-2 rounded-full transition-colors ${
                  bookmarked
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                } backdrop-blur-sm shadow-sm`}
                aria-label={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
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
              <button 
                className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
                aria-label="Share"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Manga Overview */}
          <div className="flex flex-col lg:flex-row items-start gap-8 mb-12">
            {/* Cover Column */}
            <div className="w-full lg:w-1/3 flex-shrink-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="sticky top-24">
                <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 backdrop-blur-sm group">
                  {/* Cover Image with Gradient Overlay */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {coverUrl ? (
                      <img 
                        src={coverUrl} 
                        alt={`Cover for ${title}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500">No Cover Available</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium uppercase 
                      ${status === 'completed' 
                        ? 'bg-blue-500 text-white' 
                        : status === 'ongoing' 
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500 text-white'
                      }"
                    >
                      {status}
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-yellow-500 text-white text-xs font-medium">
                      {rating} ★
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  </div>
                  
                  {/* Quick Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          +{tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      {/* Chapter Count */}
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                          <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        </svg>
                        <span className="text-sm">{chaptersData?.data?.length || 0} ch</span>
                      </div>
                      
                      {/* Year */}
                      <div className="text-sm">{year}</div>
                    </div>
                  </div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    <div
                      className="absolute -inset-full h-full w-1/3 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine"
                      style={{ animationDuration: "1.5s" }}
                    ></div>
                  </div>
                </div>
                
                {/* Read Button */}
                {chaptersData?.data && chaptersData.data.length > 0 && (
                  <div className="mt-6 flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Link 
                      to={`/reader/${chaptersData.data[0].id}`}
                      className="w-full max-w-sm px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-medium text-center transition-all shadow-lg hover:shadow-pink-500/25 inline-flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                      Start Reading
                    </Link>
                  </div>
                )}
                
                {/* Demographics and Meta Info */}
                <div className="mt-6 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm max-w-sm mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-lg font-semibold mb-4">Information</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type</span>
                      <span className="font-medium">Manhua</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className="font-medium capitalize">{status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Published</span>
                      <span className="font-medium">{year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Demographics</span>
                      <span className="font-medium capitalize">{demographic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Chapters</span>
                      <span className="font-medium">{chaptersData?.data?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Column */}
            <div className="w-full lg:w-2/3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Title and Details */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
                
                {/* Alternative Titles */}
                {altTitles.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-sm text-gray-500 dark:text-gray-400">Alternative Titles</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      {altTitles.join(' • ')}
                    </p>
                  </div>
                )}
                
                {/* Tags/Genres */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/search?q=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/20 rounded-full text-sm transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Content Tabs */}
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-6">
                  <button 
                    className={`pb-3 px-1 font-medium relative ${
                      activeTab === 'info' 
                        ? 'text-pink-500 border-b-2 border-pink-500' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('info')}
                  >
                    About
                    {activeTab === 'info' && (
                      <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></span>
                    )}
                  </button>
                  <button 
                    className={`pb-3 px-1 font-medium relative ${
                      activeTab === 'chapters' 
                        ? 'text-pink-500 border-b-2 border-pink-500' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('chapters')}
                  >
                    Chapters
                    {activeTab === 'chapters' && (
                      <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></span>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="animate-fade-in">
                {/* Info Tab */}
                {activeTab === 'info' && (
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700/50">
                      <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
                      <p className="whitespace-pre-line">{description}</p>
                    </div>
                  </div>
                )}
                
                {/* Chapters Tab */}
                {activeTab === 'chapters' && (
                  <div>
                    <ChapterList 
                      chapters={chaptersData?.data || []} 
                      loading={chaptersLoading} 
                      error={chaptersError} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes shine {
          0% { left: -100%; opacity: 0; }
          20% { opacity: 0.5; }
          100% { left: 100%; opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes animate-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        
        .animate-reverse {
          animation: animate-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Details;