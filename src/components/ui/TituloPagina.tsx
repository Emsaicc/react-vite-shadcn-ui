import React from 'react';
import { Separator } from './separator';

interface TituloPaginaProps {
  titulo: string;
  descripcion: string;
  tamanio? : string;
}

const TituloPagina: React.FC<TituloPaginaProps> = ({ titulo, descripcion, tamanio = "text-4xl" }) => {
  return (
    <div>
      <span className={tamanio}>{titulo}</span>
      <p className='text-muted-foreground'>{descripcion}</p>
      <Separator className='mb-4' />
    </div>
  );
};

export default TituloPagina;
