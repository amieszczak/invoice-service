'use client';

import React from 'react';
import styles from './IconButton.module.css';

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
      className={`${styles.button} ${className}`}
    >
      {icon}
    </button>
  );
}
