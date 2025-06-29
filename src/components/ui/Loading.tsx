import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4'
};

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullScreen = false,
  message = 'Loading...'
}) => {
  const spinnerClasses = `
    inline-block rounded-full border-transparent border-t-indigo-600
    animate-spin ${sizeClasses[size]}
  `;

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className={spinnerClasses} role="status" aria-label="loading" />
      {message && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading; 