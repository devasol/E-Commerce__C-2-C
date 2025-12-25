import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any; // For spreading other props
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleImageError = () => {
    setHasError(true);
    // Set to a default placeholder image
    setImgSrc('https://via.placeholder.com/500x500/cccccc/666666?text=Image+Not+Available');
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center p-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-4 text-gray-600 font-medium">Image Not Available</p>
          <p className="text-sm text-gray-500 mt-1">The image failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      {...props}
    />
  );
};

export default ImageWithFallback;