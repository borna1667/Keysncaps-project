import React from 'react';

interface ErrorMessageProps {
  error: string;
  reset?: () => void;
}

/**
 * A standardized error message component for production use.
 * Prevents leaking sensitive error details in production.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, reset }) => {
  // In production, we should show generic error messages
  const isProduction = import.meta.env.MODE === 'production';
  const displayError = isProduction 
    ? 'An error occurred. Please try again later.' 
    : error;

  return (
    <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-md my-4 relative" role="alert">
      <div className="font-medium">Error</div>
      <div className="text-sm mt-1">{displayError}</div>
      {reset && (
        <button 
          onClick={reset}
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
