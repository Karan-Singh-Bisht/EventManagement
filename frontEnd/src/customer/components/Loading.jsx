import React from "react";

const Loading = ({ text = "Loading" }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-600 text-xl font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
