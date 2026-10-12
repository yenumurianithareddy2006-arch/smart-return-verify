import React from 'react';

export const Badge = ({ status, children, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold"
  };

  const getVariantStyles = () => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'yes':
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
      case 'suspicious':
      case 'suspicious — further inspection':
      case 'no':
      case 'danger':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10';
      case 'inconclusive':
      case 'inconclusive — more evidence needed':
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10';
      case 'stored':
      case 'info':
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10';
      case 'purple':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/10';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ring-1 ring-inset ${getVariantStyles()} ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children || status}
    </span>
  );
};
