import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApi } from '../utils/apiUtils';
import { getChapterPages } from '../api/apiClient';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Reader page component for reading manhua chapters in a continuous long-strip layout
 * @returns {JSX.Element} - Enhanced Reader page component
 */
const Reader = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [controlsVisible, setControlsVisible] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [autoHideTimeout, setAutoHideTimeout] = useState(null);
  const readerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Fetch chapter pages
  const { 
    data: pagesData, 
    loading, 
    error, 
    refetch 
  } = useApi(getChapterPages, [chapterId], [chapterId]);

  // Toggle controls visibility
  const toggleControls = useCallback(() => {
    setControlsVisible(prev => !prev);
  }, []);

  // Auto-hide controls after inactivity
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setControlsVisible(true);
    
    controlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000); // Hide controls after 3 seconds of inactivity
  }, []);

  // Setup auto-hide controls on mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      resetControlsTimeout();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseMove);
    resetControlsTimeout();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          toggleControls();
          break;
        case 'Home':
          readerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'End':
          readerContainerRef.current?.scrollTo({ 
            top: readerContainerRef.current.scrollHeight, 
            behavior: 'smooth' 
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleControls]);

  // Handle image load
  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Loading state
  if (loading && !pagesData) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900">
        <LoadingSpinner size="lg" color="text-white" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-900 p-4">
        <ErrorMessage error={error} onRetry={refetch} />
        <Link 
          to="/" 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          tabIndex={0}
          aria-label="Return to home page"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // If no pages data
  if (!pagesData || pagesData.length === 0) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-900 p-4">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No pages found for this chapter.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            tabIndex={0}
            aria-label="Return to home page"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-900 flex flex-col relative overflow-hidden"
      role="main"
      aria-label="Manhua chapter reader"
    >
      {/* Controls - visible based on state */}
      {controlsVisible && (
        <div className="fixed top-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-90 p-4 flex justify-between items-center transition-opacity duration-300">
          <Link 
            to="/" 
            className="text-white hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
            tabIndex={0}
            aria-label="Return to home"
          >
            &larr; Back to Home
          </Link>
          
          <div className="text-white">
            {pagesData.length} Pages
          </div>
          
          <button 
            className="text-white hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
            onClick={(e) => {
              e.stopPropagation();
              toggleControls();
            }}
            tabIndex={0}
            aria-label="Hide controls"
          >
            Hide Controls
          </button>
        </div>
      )}
      
      {/* Main content - Continuous scroll reader */}
      <div 
        ref={readerContainerRef}
        className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900"
        onClick={() => toggleControls()}
        onScroll={resetControlsTimeout}
      >
        <div className="w-full flex flex-col items-center">
          {/* Chapter title */}
          <div className="w-full text-center py-4 text-white text-xl font-semibold">
            Chapter {chapterId}
          </div>
          
          {/* All pages in sequence */}
          {pagesData.map((pageUrl, index) => (
            <div 
              key={index} 
              className="w-full flex justify-center mb-1 relative"
              id={`page-${index + 1}`}
            >
              {!imagesLoaded[index] && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <LoadingSpinner size="md" color="text-white" />
                </div>
              )}
              <img 
                src={pageUrl} 
                alt={`Page ${index + 1}`} 
                className="max-w-full w-full object-contain"
                onLoad={() => handleImageLoad(index)}
                loading={index < 3 ? "eager" : "lazy"} // Load first 3 images eagerly, lazy load the rest
              />
            </div>
          ))}
          
          {/* End of chapter */}
          <div className="w-full text-center py-8 text-white">
            <p className="text-lg mb-4">End of Chapter</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              tabIndex={0}
              aria-label="Return to home page"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
      
      {/* Floating scroll to top button - appears when scrolled down */}
      <button 
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-opacity duration-300 z-20"
        onClick={() => readerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        tabIndex={0}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Reader;