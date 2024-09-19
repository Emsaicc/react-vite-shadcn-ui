import dayjs from 'dayjs';

// Define the type for the function return value
type DateDetails = {
  dayName: string;
  dayNumber: number;
  monthName: string;
  hour: number | string
  minutes: number | string
};

// Define the function to get date details including hour
export const getDateDetails = (dateStr: string): DateDetails => {
  // Parse the date string into a Day.js object
  const date = dayjs(dateStr);

  // Define the translation maps
  const daysInSpanish: Record<string, string> = {
    'Monday': 'Lunes',
    'Tuesday': 'Martes',
    'Wednesday': 'Miércoles',
    'Thursday': 'Jueves',
    'Friday': 'Viernes',
    'Saturday': 'Sábado',
    'Sunday': 'Domingo',
  };

  const monthsInSpanish: Record<string, string> = {
    'January': 'Enero',
    'February': 'Febrero',
    'March': 'Marzo',
    'April': 'Abril',
    'May': 'Mayo',
    'June': 'Junio',
    'July': 'Julio',
    'August': 'Agosto',
    'September': 'Septiembre',
    'October': 'Octubre',
    'November': 'Noviembre',
    'December': 'Diciembre',
  };

  // Extract day number, day name, month name, and hour
  const dayNumber = date.date();
  const dayName = daysInSpanish[date.format('dddd')] || date.format('dddd');
  const monthName = monthsInSpanish[date.format('MMMM')] || date.format('MMMM');
  const hour = date.hour() < 10 ? `0${date.hour()}` : date.hour()
  const minutes = date.minute() < 10 ? `0${date.minute()}` : date.minute()

  return {
    dayName,
    dayNumber,
    monthName,
    hour,
    minutes
  };
};

// Example usage
// const dateStr = '2024-08-12 20:28:27.804'; // Date with time
// const dateDetails = getDateDetails(dateStr);

// console.log(`Day Name: ${dateDetails.dayName}`); // Output: Lunes
// console.log(`Day Number: ${dateDetails.dayNumber}`); // Output: 12
// console.log(`Month Name: ${dateDetails.monthName}`); // Output: Agosto
// console.log(`Hour: ${dateDetails.hour}`); // Output: 20