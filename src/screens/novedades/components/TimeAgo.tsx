"use client"
import { Badge } from '@/components/ui/badge';

import React from 'react';
import useTimeAgo from '../hooks/useTimeAgo';
// Adjust the import path as needed

interface TimeAgoBadgeProps {
  fechaCreada: any;
  estado: string;
}

const TimeAgoBadge: React.FC<TimeAgoBadgeProps> = ({ fechaCreada, estado }) => {
  const timeAgo = useTimeAgo(fechaCreada);

  const getBadgeColor = () => {
    if (estado === 'FINALIZADO') {
      return 'bg-gray-300 text-black '; // Light gray for FINALIZADO state
    }

    if (timeAgo.dias !== null) {
      if (timeAgo.dias >= 6) {
        return 'bg-red-500'; // Red for more than 6 days
      } else if (timeAgo.dias >= 3) {
        return 'bg-orange-400'; // Orange for more than 3 days
      }
    }

    return 'bg-gray-300 text-black'; // Default color for less than 3 days or other cases
  };

  return (
    <Badge className={`text-xs flex-shrink-0 ${getBadgeColor()}`}>
      {timeAgo.mensaje}
      </Badge>
    
  );
};

export default TimeAgoBadge;
