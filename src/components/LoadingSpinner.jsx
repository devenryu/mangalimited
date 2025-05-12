import React from 'react';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.color - Color of the spinner
 * @returns {JSX.Element} - Loading spinner component
 */
const LoadingSpinner = ({ size = 'md', color = 'text-blue-600' }) => {
  // Map size to Tailwind classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex justify-center items-center">
      <div className={`${spinnerSize} ${color} animate-spin`} role="status" aria-label="Loading">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default LoadingSpinner;