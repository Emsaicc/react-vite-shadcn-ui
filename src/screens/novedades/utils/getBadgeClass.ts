
export const getBadgeClass = (prioridad: string, estado:string) => {
  
    if(estado ==="FINALIZADO") return "bg-gray-300 text-black text-xs"
      switch (prioridad) {
        case 'ALTA':
          return 'bg-red-600 text-white text-xs'; // Red badge with white text
        case 'MEDIA':
          return 'bg-orange-500 text-white text-xs'; // Orange badge with white text
        case 'BAJA':
          return 'bg-gray-300 text-black text-xs'; // Light gray badge with white text
        default:
          return 'bg-gray-200 text-black text-xs'; // Default color if needed
      }
    };