import React from 'react';

interface PointItemProps {
  label: string;
  points: string;
}

export function PointItem({ label, points }: PointItemProps) {
  return (
    <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span>{label}</span>
      <span className="font-bold">{points}</span>
    </li>
  );
}