import React from 'react';
import { formatErrorMessage } from '../utils/apiUtils';

/**
 * Error message component
 * @param {Object} props - Component props
 * @param {string} props.error - Error message
 * @param {Function} props.onRetry - Retry function
 * @returns {JSX.Element} - Error message component
 */
const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;
  
  const formattedError = formatErrorMessage(error);
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4" role="alert" aria-live="assertive">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {/* Error icon */}
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{formattedError}</p>
          {onRetry && (
            <button
              type="button"
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onRetry}
              tabIndex={0}
              aria-label="Retry request"
              onKeyDown={(e) => e.key === 'Enter' && onRetry()}
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;