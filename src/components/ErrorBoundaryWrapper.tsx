'use client';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useEffect } from 'react';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-red-400">Something went wrong</h2>
        <p className="mb-4">We apologize for the inconvenience. Please try again or contact support if the issue persists.</p>
        <div className="p-4 bg-gray-900 rounded mb-4 overflow-auto max-h-40">
          <p className="font-mono text-xs text-red-300">{error.message}</p>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  // Log errors to console for debugging
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
} 