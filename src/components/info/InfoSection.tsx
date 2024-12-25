import React from 'react';
import type { ReactNode } from 'react';

interface InfoSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export function InfoSection({ title, icon, children }: InfoSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}