import React from 'react';

interface ChartFrameProps {
  title: string;
  bgColor: string;
  borderColor?: string;
  children: React.ReactNode;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  headerContent?: React.ReactNode;
}

export const ChartFrame: React.FC<ChartFrameProps> = ({ 
  title, 
  bgColor, 
  children,
  onAnalyze,
  isAnalyzing,
  headerContent
}) => {
  return (
    <div className={`p-6 border-4 border-black shadow-hard-lg ${bgColor} relative group overflow-hidden`}>
       {/* Background Halftone Pattern Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-4 border-b-4 border-black pb-2 bg-white px-4 -mx-2 transform -skew-x-6 gap-y-2">
        <h2 className="text-3xl font-display uppercase tracking-tighter text-black transform skew-x-6">
          {title}
        </h2>
        
        <div className="flex items-center gap-4 transform skew-x-6">
          {headerContent}
          {onAnalyze && (
            <button 
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="bg-black text-white px-3 py-1 font-bold text-xs hover:bg-pop-pink hover:text-black transition-colors border-2 border-transparent hover:border-black"
            >
              {isAnalyzing ? 'THINKING...' : 'WARHOLIZE'}
            </button>
          )}
        </div>
      </div>
      
      <div className="relative bg-white border-4 border-black p-2 shadow-hard-sm">
        {children}
      </div>
    </div>
  );
};