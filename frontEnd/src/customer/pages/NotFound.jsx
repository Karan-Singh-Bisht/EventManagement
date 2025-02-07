import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4">
      <h1 className="text-9xl font-extrabold mb-8">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-8 text-lg text-center">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/">
        <button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
          Go Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
