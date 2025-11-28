'use client';

import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
}

export default function IconButton({ 
  icon, 
  onClick, 
  ariaLabel,
  className = '' 
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {icon}
    </button>
  );
}
