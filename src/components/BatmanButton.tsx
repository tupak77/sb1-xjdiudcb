import React from 'react';

interface BatmanButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function BatmanButton({ onClick, children, className = '' }: BatmanButtonProps) {
  return (
    <button 
      className={`batman-button ${className}`}
      onClick={onClick}
      type="button"
    >
      <div className="batman-button-content">
        {children}
      </div>
    </button>
  );
}