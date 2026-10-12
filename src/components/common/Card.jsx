import React from 'react';

export const Card = ({ children, className = "", hover = true, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 transition-all duration-300 ${
        hover ? 'hover:-translate-y-1 hover:shadow-soft-lg hover:border-blue-300' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
