// LoadingOverlay.jsx
import React from "react";

const LoadingOverlay = ({ loading, message = "Submitting..." }) => {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <span className="mt-4 text-blue-600 text-xl font-medium">
          {message}
        </span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
