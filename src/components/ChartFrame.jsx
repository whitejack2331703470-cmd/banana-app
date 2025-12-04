import React from 'react';

export const ChartFrame = ({ title, children, headerContent, bgColor = 'bg-white' }) => {
  return (
    <div className={`border-4 border-black shadow-hard-xl ${bgColor} relative`}>
      {/* Header Bar */}
      <div className="border-b-4 border-black p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
        <h2 className="text-3xl font-display uppercase tracking-tighter flex items-center gap-2">
          <div className="w-4 h-4 bg-black animate-pulse"></div>
          {title}
        </h2>
        {headerContent}
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-6 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
