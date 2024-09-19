import { Camera, Clock, Clock1, Delete, LocateIcon, MoreVertical, Pencil, PersonStandingIcon } from "lucide-react"
import { FC } from "react"

interface MarcaProps {
    marca: any
}

export const Marca: FC<MarcaProps> = ({ marca }) => {
  
    return (       
     
        <div>
        {/* Tarjeta usuario resoluciones grandes */}
        <div key={marca.id} className="hidden sm:grid grid-cols-10 items-center text-xs border-b">
          <div className="col-span-1 flex flex-col items-center justify-center text-center text-text-secondary font-semibold border-r-2 border-neutral-200 py-2">
            <span>Martes</span>
            <span className='text-base'>14</span>
            <span>Febrero</span>
          </div>
        
          <div className="col-span-2 flex items-center justify-center">
            <p className="text-base">             
             {marca.local?.nombre}
            </p>
          </div>
          <div className="col-span-2 flex items-center justify-center space-x-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden aspect-w-1 aspect-h-1">
              <div
                className="w-full h-full bg-gray-300 flex items-center justify-center"
              >
                <PersonStandingIcon className="text-gray-500" size={24} />
              </div>
            </div>
            <button
              className="flex flex-col items-center justify-center text-sm"
             >
              <b className="font-semibold">{marca.funcionario?.nombre} {marca.funcionario?.apellido}</b>
            </button>
          </div>
          <div className="col-span-2 flex items-center justify-center space-x-4">
           
            
              <b className="font-semibold">13:00 - 14:00</b>
            
          </div>
          
          <div className='col-span-2 flex items-center justify-center space-x-4 pr-4'>
            <button>
              <Pencil size={20} />
            </button>
            <button type='button' >
              <Delete size={20} />
            </button>
            <button type='button' >
              <Camera size={20} />
            </button>
          </div>
          
        </div>
  
        {/* Tarjeta usuario resoluciones pequeñas */}
  
        <div className='flex flex-col text-xs space-y-4 sm:hidden py-2'>
          <div className='flex justify-between items-center'>
            <span className="flex space-x-2 items-center text-oficial font-semibold">
              Lunes 14 de Agosto
            </span>
            <button>
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden aspect-w-1 aspect-h-1">
              <div
                className="w-full h-full bg-gray-300 flex items-center justify-center"
              >
                <PersonStandingIcon className="text-gray-500" size={24} />
              </div>
            </div>
            <button
              className="flex flex-col space-y-2"
            >
              <b className="font-semibold text-sm">{marca.funcionario.nombre} {marca.funcionario.apellido}</b>
            </button>
          </div>
          <div className='flex justify-evenly'>
            <div className="flex items-center justify-center space-x-2">
              <Clock size={15} className="text-neutral-700" />
              <span>13:00 - 14:00</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <LocateIcon size={15} className="text-neutral-700" />
              <span>{marca.local?.nombre}</span>
            </div>
          </div>
        </div>
  
        {/* Modal component y se determina que componente se muestra */}
       
      </div>
      
    )
}