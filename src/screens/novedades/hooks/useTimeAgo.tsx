import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

interface TimeAgo {
  mensaje: string;
  dias: number | null;
}

const useTimeAgo = (fechaCreada: string): TimeAgo => {
  const [timeAgo, setTimeAgo] = useState<TimeAgo>({ mensaje: "", dias: null });

  const updateTimeAgo = () => {
    // console.log(`Fecha creada: ${fechaCreada}`); // Log the input date string
    const createdTime = dayjs(fechaCreada).tz('America/Montevideo');
    // console.log(`Parsed Montevideo time: ${createdTime.format()}`); // Log the converted time

    const now = dayjs().tz('America/Montevideo');
    const diffInMinutes = now.diff(createdTime, 'minute');
    const diffInHours = now.diff(createdTime, 'hour');
    const diffInDays = now.diff(createdTime, 'day');
    // console.log({ now: now.format(), diffInMinutes, diffInHours, diffInDays });

    if (diffInMinutes < 5) {
      setTimeAgo({ mensaje: `Ahora`, dias: null });
    } else if (diffInMinutes < 60) {
      setTimeAgo({ mensaje: `Hace ${diffInMinutes} minuto(s)`, dias: null });
    } else if (diffInDays < 1) {
      setTimeAgo({ mensaje: `Hace ${diffInHours} hora(s)`, dias: null });
    } else {
      setTimeAgo({ mensaje: `Hace ${diffInDays} día(s)`, dias: diffInDays });
    }
  };

  useEffect(() => {
    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [fechaCreada]); // Ensure the effect runs when fechaCreada changes

  return timeAgo;
};

export default useTimeAgo;
