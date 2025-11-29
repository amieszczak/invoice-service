'use client';

import React, { useState, useRef, useEffect } from 'react';
import IconButton from '../IconButton';
import styles from './ActionDropdown.module.css';

export interface DropdownAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface ActionDropdownProps {
  actions: DropdownAction[];
  disabled?: boolean;
}

export default function ActionDropdown({ actions, disabled = false }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleActionClick = (action: DropdownAction) => {
    if (!disabled) {
      action.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <IconButton
        icon="⋯"
        onClick={handleToggle}
        ariaLabel="More actions"
      />
      {isOpen && (
        <div className={styles.menu}>
          {actions.map((action) => (
            <button
              key={action.key}
              className={styles.menuItem}
              onClick={() => handleActionClick(action)}
              disabled={disabled}
            >
              <span className={styles.icon}>{action.icon}</span>
              <span className={styles.label}>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
