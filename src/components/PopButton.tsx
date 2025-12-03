import React from 'react';

interface PopButtonProps {
  label: string;
  onClick: () => void;
  selected?: boolean;
  colorClass?: string;
  className?: string;
}

export const PopButton: React.FC<PopButtonProps> = ({ 
  label, 
  onClick, 
  selected = false, 
  colorClass = 'bg-pop-cyan',
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden font-display uppercase tracking-widest text-lg px-6 py-3
        border-4 border-black transition-all duration-200 transform
        ${selected 
          ? `${colorClass} text-black shadow-hard translate-x-[-2px] translate-y-[-2px]` 
          : 'bg-gray-100 text-gray-400 border-gray-400 hover:bg-white hover:text-black hover:border-black'
        }
        ${className}
      `}
    >
      <span className="relative z-10">{label}</span>
      {selected && (
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/halftone-dots.png')] bg-repeat"></div>
      )}
    </button>
  );
};