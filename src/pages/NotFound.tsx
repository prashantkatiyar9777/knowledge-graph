import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center p-4">
      <Database className="h-16 w-16 text-slate-300 mb-4" />
      <h1 className="text-3xl font-bold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary flex items-center">
        <Home size={16} className="mr-2" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;