import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import parse from "html-react-parser";

import { useUser } from '@/context/UserContext';
import { Novedad, Respuesta } from '@/types/types';
import { getBadgeClass } from '../utils/getBadgeClass';
import { CrearRespuestaForm } from './ResponderForm';



 

interface NovedadDetalleProps {
  novedadActiva: any; // Replace 'any' with the appropriate type for novedadActiva
  handleRemoverVistaNovedad: (novedad: any) => void; // Replace 'any' with the appropriate type for novedad
  carpetas: any
  handleAgregarNovedadAcarpeta:any
}


const NovedadDetalle: React.FC<NovedadDetalleProps> = ({ novedadActiva, handleRemoverVistaNovedad, carpetas, handleAgregarNovedadAcarpeta }) => {
  console.log(novedadActiva)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenAgregarAcarpeta, setmodalOpenAgregarAcarpeta] = useState(false);
    const {user} = useUser();
    const [novedadActivaState, setNovedadActiva] = useState<Novedad>();

    

    const canComment = () => {
      if (!user || !novedadActivaState) {
        
        return false;
      }
    
      // Extract user area IDs and novedad's assigned area IDs
      const userAreaIds: any[] = user.areas.map((area: any) => area.value);
      const novedadAreaIds: any[] = novedadActivaState.areas_asignadas.map((area: any) => area?.id);
    
      
    
      // Check if any of the user's areas are in novedad's assigned areas
      const hasAssignedArea = userAreaIds.some((userAreaId: any) => novedadAreaIds.includes(userAreaId));
     
      // Check if the user is in the funcionarios_asignados list
      const isAssignedFuncionario = novedadActivaState.funcionarios_asignados.some((funcionario: any) => funcionario.id === user.id);
     
    
      // User can comment if they have an area in novedad's assigned areas, 
      // if they are in the funcionarios_asignados list, or if they are the creator
      const canUserComment = (
        hasAssignedArea || // Check if any assigned area matches user's areas
        isAssignedFuncionario || // Check if user is in the funcionarios_asignados list
        user?.id === novedadActivaState.creador_id // Check if the user is the creator of the novedad
      );
      
    
      return canUserComment;
    };
    

    // useEffect(() => {
    //     console.log(user)
    //     const userAreas: string[] = user?.areas.map((area: any) => area.value);
    //     if(user){
    //       socket.emit('joinRooms',{rooms:userAreas})
    //     }
      
        
    //   }, [user])
    useEffect(() => {
        setNovedadActiva(novedadActiva)
    
      
    }, [novedadActiva])
    
    

   
    
    

    
      
  return (
    <div className={`${novedadActivaState ? "md:flex" : "md:hidden"} md:w-[35%] p-4 fixed top-0 right-0 w-full h-full flex-col bg-white border-l border-gray-300 overflow-y-auto`}>
      {/* Title section */}
      <div className="w-full px-10 text-xl">
        <span className='text-3xl'>
          {novedadActivaState
            ? ` Detalles de la novedad: ${novedadActivaState?.asunto}`
            : "Selecciona una novedad para ver sus detalles"}
        </span>
        <br />
        <div className="my-2 grid grid-cols-1 2xl:grid-cols-3 gap-2">
          {novedadActivaState ? (
            <Badge className={`${getBadgeClass(novedadActivaState?.prioridad,novedadActivaState?.estado)} text-center hover:bg-red-600`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Prioridad: {novedadActivaState?.prioridad}
          </Badge>
          ) : (
            ""
          )}
          <Button onClick={() => handleRemoverVistaNovedad(novedadActivaState)}>
            Marcar como no leída
          </Button>
          

          <Dialog open={modalOpenAgregarAcarpeta} onOpenChange={setmodalOpenAgregarAcarpeta}>
          <DialogTrigger asChild>

          <Button>
            Guardar en carpeta
          </Button>
          </DialogTrigger>
          <DialogContent className="overflow-y-scroll max-h-screen">
            <DialogHeader>
              <DialogTitle>Agregar novedad a carpeta</DialogTitle>
              <DialogDescription>
               {/* <GuardarEnCarpetaForm setmodalOpenAgregarAcarpeta={setmodalOpenAgregarAcarpeta} novedad={ novedadActivaState} carpetas={carpetas} handleAgregarNovedadAcarpeta={handleAgregarNovedadAcarpeta}/> */}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
</Dialog>
        </div>
        <Separator className='mb-4' />
      </div>

      {/* Right side content */}
      <div className="flex-grow overflow-auto mt-4 text-xl">
        <Card className="rounded-t-3xl text-xl bg-gray-50 ">
          <CardHeader className="rounded-t-3xl ">
            <CardTitle>{novedadActivaState?.asunto} - {novedadActivaState?.categoria?.label} </CardTitle>
            <CardDescription>
              Creado por: {`${novedadActivaState?.creador.nombre || ""} ${novedadActivaState?.creador.apellido || ""}`} el{" "}
              {novedadActivaState && `${dayjs(novedadActivaState?.fecha_creada).tz('America/Montevideo').format('DD/MM/YYYY HH:mm')}`}
              <br />
              <br />
              <span className="text-base">
                {novedadActivaState?.portero && `* Esta novedad está relacionada al funcionario: `}<strong>{novedadActivaState?.portero?.label}</strong>
                <br />
                {novedadActivaState?.servicio && "* Esta novedad está relacionada al servicio: "}<strong>{novedadActivaState?.servicio?.label}</strong>
              </span>
           
            </CardDescription>
          </CardHeader>

          <CardContent className="p-2 pl-7 ">

         


            {novedadActivaState?.areas_asignadas && novedadActivaState?.areas_asignadas.length !== 0 && (
              <div>
                <p className='text-base'>Areas Asignadas: </p>
                <div className="mx-1 my-1">
                  {novedadActivaState?.areas_asignadas?.map((area: any) => (
                    <Badge key={area?.id} className="mx-1 my-1">{area.nombre}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {novedadActivaState?.funcionarios_asignados && novedadActivaState?.funcionarios_asignados.length !== 0 && (
              <div>
                <Separator className="my-2" />
                <p>Funcionarios Asignados: </p>
                {novedadActivaState?.funcionarios_asignados?.map((funcionario: any) => (
                  <Badge key={funcionario?.id} className="mx-1 my-1">{funcionario.nombre} {funcionario.apellido}</Badge>
                ))}
                
              </div>
            )}
           
           <Separator className="my-2 border-2" />
            <p className="mb-2 text-base font-semibold
            ">Contenido de la novedad:</p>
            <div className="border border-solid border-gray-300 rounded-xl text-sm md:text-lg p-4 bg-gray-100 pl-4">
              {novedadActivaState && parse(novedadActivaState?.contenido)}
            </div>
            <Separator className="my-4" />
            <p>Archivos adjuntos:</p>
            <div>
              {novedadActivaState?.imagenes && novedadActivaState.imagenes.length > 0 ? (
                <ul className="ml-8">
                  {novedadActiva.imagenes.map((imagen: any) => (
                    <li key={imagen.path} className="my-1">
                      <a className="text-blue-600" href={`https://masterson-space.nyc3.cdn.digitaloceanspaces.com/${imagen.path}`} target="_blank" rel="noopener noreferrer">
                        {imagen.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm'>No hay archivos adjuntos.</p>
              )}

              <Separator className='my-4'/>
            </div>
          </CardContent>
          <CardFooter>
            {novedadActivaState?.compartida_a && novedadActivaState?.compartida_a.length !== 0 && (
              <div>
                <div>
                <p>Áreas copiadas: </p>
                {novedadActivaState?.compartida_a?.map((area: any) => (
                  <Badge key={area?.id} className="mx-1 my-1">{area.nombre}</Badge>
                ))}
              </div>


              </div>

              
            )}
            
            <div className='mt-4'>
           
           {novedadActivaState?.copiadoPrivado && novedadActivaState?.copiadoPrivado.length !== 0 && (
           <div>
             <p>Funcionarios Copiados: </p>
             {novedadActivaState?.copiadoPrivado?.map((funcionario: any) => (
               <Badge key={funcionario?.id} className="mx-1 my-1">{funcionario.nombre} {funcionario.apellido}</Badge>
             ))}
             <Separator className="my-4" />
           </div>
         )}
           </div>
          </CardFooter>
        </Card>
        <div>
        {novedadActivaState?.visualizada_por &&
  novedadActivaState?.visualizada_por.length !== 0 &&
   (
    <div>

      
      <p className='text-sm mt-4'>Visto por:</p>
      <div className="mx-1 px-2 break-words my-1">
        {novedadActivaState?.visualizada_por?.map((area: any) => (
          <span key={area.user_id}>{area.user_id != "16b36e4d-dbc2-4656-8062-4aec6f1a6542" && area.user_id != "a90b1be1-557f-48b4-ac8b-945b5a28a02e"  && <span key={area?.id} className="mx-1 text-muted-foreground text-sm my-1">{area.user?.nombre} {area.user?.apellido} </span>}</span>
        ))}
      </div>
    </div>
)}
            
            <p className='text-1xl mt-4'>Respuestas:</p>
            {novedadActivaState?.respuestas?.map((respuesta: Respuesta) => (
                    <Card  key={respuesta?.id} className='my-4 mx-4 bg-gray-100'>
                    <CardHeader>
                   
                      <CardTitle>{respuesta?.creador?.nombre} {respuesta?.creador?.apellido} comentó: </CardTitle>                      
                    </CardHeader>
                    <CardContent>                   
                    {(typeof respuesta?.contenido === 'string') && parse(respuesta?.contenido)}

                   <br></br> <span className='text-sm '>Fecha:{` ${dayjs(respuesta?.fecha_creada).tz('America/Montevideo').format('DD/MM/YYYY HH:mm')}`}</span>
                    </CardContent>
                    <CardFooter>

                    
            <div>
            
              {respuesta?.imagenes && respuesta.imagenes.length > 0 ? (
                <div>
                  <p>Archivos adjuntos:</p>
                <ul className="ml-8">
                  {respuesta.imagenes.map((imagen: any) => (
                    <li key={imagen.path} className="my-1">
                      <a className="text-blue-600" href={`https://masterson-space.nyc3.cdn.digitaloceanspaces.com/${imagen.path}`} target="_blank" rel="noopener noreferrer">
                        {imagen.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
                </div>
              ) : (
               ""
              )}
            </div>
                        
                   
                    </CardFooter>
                  </Card>
            ))}

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          
                    <Button 
                      disabled={novedadActiva?.estado === "FINALIZADO" && novedadActiva?.creador?.id !== user?.id} 
                      className='self-center mx-auto'
                  onClick={() => {                  
                    
                      setModalOpen(true); // Only open the modal if the user can comment
                    
                    
                  }}
          >
            Responder
          </Button>
          

          <DialogContent
            className="h-[70%] min-w-[50%] overflow-auto"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>Agregando nueva respuesta</DialogTitle>
              <Separator />
              <DialogDescription>
                {/* <CrearRespuestaForm
                canComment={canComment()}
                setModalOpen={setModalOpen}
                novedadActiva={novedadActiva}
                accion="agregar"
                handleRespuestaAdd={handleRespuestaAdd}
                /> */}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              {/* <Button type="submit" form="edit-user-form">Confirm</Button> */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
};

export default NovedadDetalle;
