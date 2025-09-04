import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An error occurred';
  
  return (
<div className="min-h-screen flex items-center justify-center bg-surface-50">
<div className="w-full max-w-md p-8 bg-surface-100 rounded-lg border border-error/30 text-center" style={{boxShadow: '0 0 40px rgba(255, 51, 102, 0.2)'}}>
<h1 className="text-2xl font-bold text-error mb-4 tracking-wide" style={{textShadow: '0 0 10px rgba(255, 51, 102, 0.5)'}}>Authentication Error</h1>
<p className="text-surface-800 mb-6 tracking-wide">{errorMessage}</p>
<Link to="/login" className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-surface-50 rounded-md hover:from-primary-400 hover:to-accent-400 transition-colors tracking-wider" style={{boxShadow: '0 0 15px rgba(0, 212, 255, 0.4)'}}>
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;