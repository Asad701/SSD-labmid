import React from 'react';

const Loading = () => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Outer Circle */}
      <div className="absolute w-32 h-32 rounded-full border-8 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent animate-spin"></div>

      {/* Middle Circle */}
      <div className="absolute w-24 h-24 rounded-full border-6 border-t-transparent border-r-transparent border-b-green-400 border-l-green-400 animate-spin" style={{ animationDirection: 'reverse' }}></div>

      {/* Inner Circle */}
      <div className="absolute w-16 h-16 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-blue-400 border-l-transparent animate-spin"></div>
    </div>
  );
};

export default Loading;
