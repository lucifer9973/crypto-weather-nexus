import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RealtimeBadgeProps {
  pulse?: boolean;
}

export function RealTimeBadge({ pulse = true }: RealtimeBadgeProps) {
  return (
    <Badge variant="outline" className="flex items-center gap-1">
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      )}
      <span>Real-time</span>
    </Badge>
  );
}