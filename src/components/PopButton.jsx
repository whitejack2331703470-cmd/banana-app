import React from 'react';

export const PopButton = ({ label, selected, onClick, colorClass, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group border-4 border-black px-4 py-3 font-display uppercase tracking-widest text-lg transition-all duration-200
        ${selected
          ? `bg-black text-white shadow-none translate-y-1 translate-x-1`
          : `${colorClass || 'bg-white'} text-black shadow-hard hover:-translate-y-1 hover:shadow-hard-lg`
        }
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-between gap-2">
        {selected && <span className="text-pop-yellow">●</span>}
        {label}
      </span>
    </button>
  );
};
