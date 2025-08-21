import React from 'react';

const NotFound = () => {
  return (
    <div className="montserrat-font flex flex-col items-center justify-center p-3 bg-black">
      <h1 className="montserrat-font text-3xl text-white">404</h1>
      <p className="montserrat-font text-2xl text-white">Page Not Found</p>
      <p className="montserrat-font text-lg text-gray-300 mt-4">The page you are looking for does not exist.</p>
      <button 
        className="montserrat-font mt-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        onClick={() => window.location.href = '/'}
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
