import React from 'react';

export default function Badge({ variant = 'default', children, className = '' }) {
  const styles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    present: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    absent: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
    published: 'bg-blue-50 text-blue-700 border-blue-200',
    draft: 'bg-slate-100 text-slate-600 border-slate-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-500 border-slate-200'
  };

  const selectedStyle = styles[variant] || styles.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${selectedStyle} ${className}`}>
      {children}
    </span>
  );
}
