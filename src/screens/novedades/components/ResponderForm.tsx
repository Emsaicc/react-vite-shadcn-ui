"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useEffect, useState } from "react";


import customFetch from "@/utils/fetchCustomData";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CustomTextEditor from "../editor-custom/EditorCustom";

import FileUpload from "@/components/FileUploader";
;
import { useUser } from "@/context/UserContext";
import { Novedad } from "@/types/customTypes";
import { getTokenCookie } from "@/utils/cookies";
import useCustomFetch from "@/hooks/useAuthFetch";
import Image from "next/image";

const formSchema = z.object({
  
    crear_como: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    
    
  ).optional(),
  funcionariosPrivados: z.any().default([]),
  areasCopiadas: z.any().default([]),  
  areas_asignadas: z.any().default([]),  
  funcionarios_asignados: z.any().default([]),  
  cambiar_estado: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    
    
  ).optional(),  
  contenido: z.string().min(6, {
    message: "El asunto debe tener mínimo 6 carácteres.",
  }),
  requiereArchivos: z.boolean().default(false),  
 

  // areas: z.any().default([])
});
interface CrearEditarNovedadFormProps {
  
  handleRespuestaAdd: any;
  accion: any;
  setModalOpen: any;
  novedadActiva: Novedad
  canComment: boolean;

}

export function CrearRespuestaForm({
  canComment,
  handleRespuestaAdd,
  accion,
  setModalOpen,
  novedadActiva
  
  
}: CrearEditarNovedadFormProps) {
 
  const { user } = useUser();
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isEnviado, setIsEnviado] = useState(false);
  const [empleadosParaSelect, setempleadosParaSelect] = useState<any>(undefined);

  const [files, setFiles] = useState<File[]>([]);
  const [requiereArchivos, setRequiereArchivos] = useState<boolean>(false);
  const [isNovedadSubida, setIsNovedadSubida] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [funcionariosAllParaSelect, setfuncionariosAllParaSelect] = useState<any>(undefined);
  const [isLoadingAllFuncionarios, setisLoadingAllFuncionarios] = useState(false);
  const [showNovedadActiva, setShowNovedadActiva] = useState(false);
  console.log(user)



  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        setisLoadingAllFuncionarios(true);
        const token = await getTokenCookie();
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
  
        console.log("DATA FETCH USUARIOS:");
        console.log(data);
  
        const uniqueFuncionariosMap = new Map<
          string,
          { label: string; value: string; imagen: string, roles: any }
        >();
  
        data?.forEach((empleado: any) => {
          console.log(empleado.roles)
          if (!uniqueFuncionariosMap.has(empleado.id)) {
            uniqueFuncionariosMap.set(empleado.id, {
              label: empleado.nombre + " " + empleado.apellido,
              value: empleado.id,
              imagen: empleado.imagen,
              roles: empleado.roles,
            });
          }
        });
  
        setfuncionariosAllParaSelect(Array.from(uniqueFuncionariosMap.values()));
      } catch (error) {
        console.log(error);
      } finally {
        setisLoadingAllFuncionarios(false);
      }
    };
  
    fetchFuncionarios();
  }, []);

 
  
  const {
    data: areasGenerales,
    loading: loadingAreasGenerales,
    error: errorAreasGenerales,
  } = useCustomFetch<any>({
    endpoint: "areas/con-funcionarios",
    method: "GET",
  });
 

  const areasGeneralesSelect = areasGenerales?.map((area: any) => ({
    label: area.nombre,
    value: area.id,
  }));


 

 

  console.log();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crear_como:user?.areas[0]
    },
  });

  useEffect(() => {
    const subscription = form.watch(
      (value, { name, type }) => {
        getUniqueEmpleados(value.areas_asignadas, areasGenerales);
      }
      // {console.log(value.responsablesSeguimiento, name, type)}
    );

    // Iterate over areasWithEmpleados to find empleados
    const getUniqueEmpleados = (
      areasInicial: any[],
      areasWithEmpleados: any[]
    ): boolean => {
      // Create a set of area IDs from areasInicial
      console.log(areasInicial, areasWithEmpleados);
      const areaIdsSet = new Set(areasInicial?.map((area: any) => area.value));

      // Create a map to track unique empleados by ID
      const uniqueEmpleadosMap = new Map<
        string,
        { label: string; value: string, imagen:string,roles:any }
      >();

      // Iterate over areasWithEmpleados to find empleados
      areasWithEmpleados?.forEach((area: any) => {
        console.log(area)
        if (areaIdsSet.has(area.id)) {
          area.empleados?.forEach((empleado: any) => {
            console.log(empleado)
            if (!uniqueEmpleadosMap.has(empleado.id)) {
              uniqueEmpleadosMap.set(empleado.id, {
                label: empleado.nombre + " " + empleado.apellido,
                value: empleado.id,
                imagen:empleado.imagen,
                roles:empleado.roles,
              });
            }
          });
        }
      });

      // Convert the map to an array
      setempleadosParaSelect(Array.from(uniqueEmpleadosMap.values()));
      return true;
    };
    // return () => subscription.unsubscribe()
  }, [form.watch, areasGenerales]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(files);
    setisSubmitting(true)
   
    
    if (accion == "agregar") {
      try {
        console.log(values);
        
        // if(!requiereArchivos) setModalOpen(false);
        const imagenes: { path: string; nombre: string;}[] = files.map(file => ({
          path: `${file.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9.]/g, '')}`,
          nombre: file.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9.]/g, ''),
         
        }));
        console.log(imagenes)
        // setIsNovedadSubida(true);
        const { data, error } = await customFetch<any>({
          endpoint: 'novedades/respuestas',
          method: 'POST',
          body: { 
            area:values.crear_como?.value,        
            novedad_id:novedadActiva.id,  
            cambiar_estado:values.cambiar_estado ? values.cambiar_estado.label : null,
            contenido: values.contenido,
            copiadoPrivado:values.funcionariosPrivados?.map((empleado: any) => empleado.value),
            areasCopiadas: values.areasCopiadas?.map((area: any) => area.value),
            funcionarios_asignados:values.funcionarios_asignados?.map((empleado: any) => empleado.value),
            areas_asignadas: values.areas_asignadas?.map((empleado: any) => empleado.value),
            imagenes: imagenes 
           },
        });
        console.log(data)

         if(files.length != 0){
          const formData = new FormData();
          files.forEach((file) => {
            formData.append('files', file);
            
          });

          const token = await getTokenCookie();
          formData.append('respuestaId', data.id);
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${process.env.NEXT_PUBLIC_SERVER_URL}/fileupload/respuesta`, true);

          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.upload.onprogress = (event: any) => {
            if (event.lengthComputable) {
              const percentCompleted = Math.round((event.loaded * 100) / event.total);
              setProgress((prevProgress) => ({
                ...prevProgress,
                total: percentCompleted,
              }));
            }
          };

    xhr.onload = () => {
      if (xhr.status === 201) {
        console.log(xhr)
        console.log('Respuesta subida con éxito.');
        
      } else {
        alert('Tu Respuesta se creó, pero hubo un error al cargar los archivos');
        console.error('Upload failed', xhr.status, xhr.statusText);
      }
    };

    xhr.onerror = () => {
      alert('Tu Respuesta se creó, pero hubo un error al cargar los archivos.');
      console.error('Upload failed');
    };

    xhr.send(formData);
    console.log(Array.isArray(files)); 
    const imagenes = files.map(file => {          
     const path = `${data.id}${file.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9.]/g, '')}}`;
     return {
       path,
       nombre: file.name,
     };
   });
   console.log(imagenes)
   data.imagenes = imagenes;
   console.log(data)
         }
        
        console.log(data)
        handleRespuestaAdd(data)
        // setNovedadActiva(data)
        setModalOpen(false)
        !values.cambiar_estado ? alert("Respuesta agregada correctamente") : alert("Respuesta agregada correctamente, estado modificado a: " + values.cambiar_estado.label)
        
        console.log(error)
        // setUsuario(data)
        
        setisSubmitting(false);
      } catch (error) {
        console.log(error)
        setisSubmitting(false);
        alert(`No se ha podido agregar la respuesta: ${error}`);
      }
    } else {
      try {
        
        // console.log({ id: novedadActual.id, ...values });
        // console.log(data);
        // console.log(error);
        // setUsuario(data);
        // setisSubmitting(false);

        // alert("Usuario modificado correctamente");
      } catch (error) {
        setisSubmitting(false);
        alert("No se ha podido modificar el usuario");
      }
    }
  }

  // useEffect(() => {
  //   const subscription = form.watch(
  //     (value, { name, type }) => {
  //       getUniqueEmpleados(value.responsablesSeguimiento, areasGenerales);
  //     }
  //     // {console.log(value.responsablesSeguimiento, name, type)}
  //   );

  //   // Iterate over areasWithEmpleados to find empleados
  //   const getUniqueEmpleados = (
  //     areasInicial: any[],
  //     areasWithEmpleados: any[]
  //   ): boolean => {
  //     // Create a set of area IDs from areasInicial
  //     console.log(areasInicial, areasWithEmpleados);
  //     const areaIdsSet = new Set(areasInicial?.map((area: any) => area.value));

  //     // Create a map to track unique empleados by ID
  //     const uniqueEmpleadosMap = new Map<
  //       string,
  //       { label: string; value: string, imagen:string }
  //     >();

  //     // Iterate over areasWithEmpleados to find empleados
  //     areasWithEmpleados?.forEach((area: any) => {
  //       if (areaIdsSet.has(area.id)) {
  //         area.empleados?.forEach((empleado: any) => {
  //           if (!uniqueEmpleadosMap.has(empleado.id)) {
  //             uniqueEmpleadosMap.set(empleado.id, {
  //               label: empleado.nombre + " " + empleado.apellido,
  //               value: empleado.id,
  //               imagen:empleado.imagen,
  //             });
  //           }
  //         });
  //       }
  //     });

  //     // Convert the map to an array
  //     setempleadosParaSelect(Array.from(uniqueEmpleadosMap.values()));
  //     return true;
  //   };
  //   // return () => subscription.unsubscribe()
  // }, [form.watch, areasGenerales]);

 
    // if(error || errorAreas || errorAreasGenerales) return "No se ha podido cargar el contenido"

    if ( loadingAreasGenerales || isLoadingAllFuncionarios)
    return (
      <div className="  justify-center m-auto">
        <LoadingSpinner size={"65"} showLabel={true} />
      </div>
    );
  return (
    <div>
      <Button onClick={() => setShowNovedadActiva(!showNovedadActiva)}>
        {showNovedadActiva ? 'Ocultar' : 'Mostrar'} Contenido de la Novedad
      </Button>
      {showNovedadActiva && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold">Contenido de la Novedad:</h3>
          <div dangerouslySetInnerHTML={{ __html: novedadActiva.contenido }} />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`space-y-8 mt-4 ${isNovedadSubida && "hidden"}`}
          id="edit-user-form"
        >



            <FormField
            control={form.control}
            name="crear_como"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crear Como</FormLabel>
                <FormControl>
                  <Select
                    placeholder="Seleccionar"
                    isDisabled={user.areas == 1}
                    defaultValue={user?.areas[0]}
                    options={user?.areas}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  El area con el cual se realizará tu respuesta<br></br>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

                  


          <FormField
            control={form.control}
            name="contenido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido</FormLabel>
                <FormControl>
                  <CustomTextEditor description="" onChange={field.onChange} />
                </FormControl>
                <FormDescription>                 
                  El contenido de tu respuesta
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
         
                   

          <div className="grid grid-cols-1 gap-y-4">
           
          <FormField
            control={form.control}
            name="cambiar_estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Select
                  isDisabled={!canComment}
                    placeholder="Estado"
                    defaultValue={[]}
                    options={[
                      { label: "PENDIENTE", value: "PENDIENTE" },
                      { label: "FINALIZADO", value: "FINALIZADO" },
                      { label: "EN PROCESO", value: "EN PROCESO" },
                    ]}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  En caso de querer cambiar el estado de la novedad, puedes seleccionar una opción<br></br>
                  {!canComment && <span className="text-red-500">No puedes cambiar el estado de la novedad, ya que solo fuiste copiado en ella</span>}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

                

<FormField
            control={form.control}
            name="areas_asignadas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asignar áreas</FormLabel>
                <FormDescription>
                Si desea involucrar a otra área en la resolución de ésta novedad, seleccionela aquí.</FormDescription>
                <FormMessage />
                <FormControl>
                  <Select
                    isMulti
                    placeholder="Seleccionar"
                    defaultValue={[]}
                    options={areasGeneralesSelect}
                    {...field}
                  />
                </FormControl>
               
              </FormItem>
            )}
          />

<FormField
            control={form.control}
            name="funcionarios_asignados"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asignar funcionario </FormLabel>
                <FormDescription>
                En caso de querer agregar otro funcionario el cual debe darle seguimiento a la novedad, seleccionalo aquí
                <p><b>Para poder seleccionar un Funcionario, DEBES seleccionar su área arriba.</b></p>
                </FormDescription>
                <FormControl>
                  <Select
                    isMulti
                    placeholder="Seleccionar"
                    defaultValue={[]}
                    options={empleadosParaSelect}
                    {...field}
                    formatOptionLabel={(user) => (
                      <div className="h-full flex gap-4 items-center">
                        <div>
                          <Image
                            src={`${user?.imagen ? user.imagen : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} `}
                              
                            
                            width={50}
                            height={50}
                            alt="Imagen"
                          />
                        </div>
                        <div>
                          
                          <span>{user.label} {user?.roles?.map((rol: any) => (
                          <p key={rol.id}>{rol.nombre} </p>
                          ))}</span>
                        </div>
                      </div>
                    )}
                  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
            control={form.control}
            name="areasCopiadas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copiar área(s):</FormLabel>
                <FormDescription>
                Si quieres copiar a otra(s) área(s) para que pueda visualizar ésta novedad, seleccionalas aquí               
                </FormDescription>
                <FormControl>
                  <Select
                 
                    isMulti
                    placeholder="Seleccionar"
                    defaultValue={[]}
                    options={areasGeneralesSelect}
                    {...field}
                  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
<FormField
            control={form.control}
            name="funcionariosPrivados"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copiar a funcionarios(s):</FormLabel>
                <FormDescription>
                Si quieres copiar a otro(s) funcionario(s) para que pueda visualizar ésta novedad, seleccionales aquí       
                  <br></br>
                </FormDescription>
                <FormControl>
                <Select
                    isMulti
                    placeholder="Seleccionar"
                    defaultValue={[]}
                    options={funcionariosAllParaSelect}
                    {...field}
                    formatOptionLabel={(user) => (
                      <div className="h-full flex gap-4 items-center">
                        <div>
                          <Image
                            src={`${user?.imagen ? user.imagen : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} `}
                              
                            objectFit="contain"
                            
                            width={50}
                            height={50}
                            alt="Imagen"
                          />
                        </div>
                        <div>
                          <span>{user.label}</span>
                        </div>
                      </div>
                    )}
                  />
                </FormControl>
               
                <FormMessage />
              </FormItem>
            )}
          />

          </div>

          <FileUpload
      changeModal={setModalOpen}
      onFilesSelected={setFiles} />
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? <LoadingSpinner size={"24"} /> : "Enviar"}
          </Button>
         
        </form>
      </Form>
      
    </div>
  );
}
