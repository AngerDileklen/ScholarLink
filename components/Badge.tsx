import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'info' | 'neutral' | 'warning';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', icon }) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </span>
  );
};