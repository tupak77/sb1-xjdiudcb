import React, { InputHTMLAttributes } from 'react';
import '../styles/fancy-input.css';

interface FancyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function FancyInput({ label, ...props }: FancyInputProps) {
  return (
    <div className="fancy-input-container">
      {label && (
        <label className="block text-sm font-medium mb-2 text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="grid-background" />
        <input className="fancy-input" {...props} />
        <div className="glow-effect" />
      </div>
    </div>
  );
}