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
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";


import FileUpload from "@/components/FileUploader";

import { useUser } from "@/context/UserContext";
import { Switch } from "../switch";
import { Label } from "../label";
import customAxios from "@/utils/customAxios";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPorteros } from "@/lib/queries/porteros/fetchAllPorteros";
import { fetchAllAreasForUser } from "@/lib/queries/areas/fetchAllAreasForUser";

const formSchema = z.object({
  asunto: z.string({
    required_error: "Debes escribir un asunto para la novedad" 
  }).min(4, {
    message: "El asunto debe tener mínimo 4 carácteres.",
  }),
  prioridad: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Debes seleccionar una prioridad para la novedad" }
  ),
  crear_como: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    
  ),
  descripcion: z.string(
    {
       required_error: "Debes escribir un asunto para la novedad" 
    }
  ).min(6, {
    message: "El asunto debe tener mínimo 6 carácteres.",
    
    
  },),

  servicio: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable(),
  portero: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable(),
  categoria: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Debes seleccionar una categoría para la novedad" }
  ),

  funcionariosPrivados: z.any().default([]),

  responsablesSeguimiento: z.any().default([]),
  requiereArchivos: z.boolean().default(false),
  areasCopiadas: z.any().default([]),
  empleadosAsignados: z.any().default([]),

  // areas: z.any().default([])
});
interface CrearEditarNovedadFormProps {
  usuarioActual: any;
  setUsuario: any;
  accion: any;
  setModalOpen: any;
  handleNovedadAdd:any;
  setNovedadActiva:any;
}

export function CrearEditarNovedadForm({
  usuarioActual: novedadActual,
  setUsuario,
  accion,
  setModalOpen,
  handleNovedadAdd,
  setNovedadActiva
}: CrearEditarNovedadFormProps) {
  const [mostrarInformacionRoles, setMostrarInfoRoles] = useState(false);
  const { user } = useUser();
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isEnviado, setIsEnviado] = useState(false);
  const [allFuncionarios, setAllfuncionarios] = useState([]);
  const [isLoadingAllFuncionarios, setisLoadingAllFuncionarios] = useState(false);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [loadingPorteros, setLoadingPorteros] = useState(false);
  const [porteros, setPorteros] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleadosParaSelect, setempleadosParaSelect] = useState<any>(undefined);
  const [funcionariosAllParaSelect, setfuncionariosAllParaSelect] = useState<any>(undefined);
  const empleadosMap: { [key: string]: any } = {};
  
  const [files, setFiles] = useState<File[]>([]);
  const [requiereArchivos, setRequiereArchivos] = useState<boolean>(false);
  const [isNovedadSubida, setIsNovedadSubida] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  console.log(user)

  // const [isLoading, setIsLoading] = useState(true);
 

  const { data: roles, isLoading : loading, error } = useQuery({
    queryKey: ["servicios"],
    retry: 1,
    queryFn: fetchAllPorteros,
  });

  const { data: areas, isLoading : loadingAreas,error: errorAreas } = useQuery({
    queryKey: ["servicios"],
    retry: 1,
    queryFn: fetchAllAreasForUser,
  });





  const {
    data: areasGenerales,
    loading: loadingAreasGenerales,
    error: errorAreasGenerales,
  } = useCustomFetch<any>({
    endpoint: "areas/con-funcionarios",
    method: "GET",
  });

  console.log(areas)
  const areasGeneralesSelect = areasGenerales?.map((area: any) => ({
    label: area.nombre,
    value: area.id,
  }));

  function handleSearchServicios(parameter: any) {
    return function (event: any) {
      // Clear the previous timeout (if any)
      const query = event.target.value;
      clearTimeout(parameter.timeoutId);

      // Get the search query from the input field

      // Set a new timeout with an anonymous function
      parameter.timeoutId = setTimeout(() => {
        delayedSearchServicios(query);
      }, 1000);
    };
  }

  const getUniqueEmpleados = (areas: any): any[] => {
    const allEmpleados = areas.flatMap((area: any) => area.empleados);
    const uniqueEmpleados: any[] = [];

    const empleadoIds = new Set();

    allEmpleados.forEach((empleado: any) => {
      if (!empleadoIds.has(empleado.id)) {
        empleadoIds.add(empleado.id);
        uniqueEmpleados.push({ label: empleado.nombre, value: empleado.id });
      }
    });

    return uniqueEmpleados;
  };

  const delayedSearchServicios = async (query: string) => {
    setLoadingServicios(true);
    const token = await getTokenCookie();
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servicios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ buscarQuery: query }),
    })
      .then((res) => res.json())
      .then((data) => {
        setServicios(data);
        setLoadingServicios(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoadingServicios(false);
      });
  };

  function handleSearchFuncionarios(parameter: any) {
    return function (event: any) {
      // Clear the previous timeout (if any)
      const query = event.target.value;
      clearTimeout(parameter.timeoutId);

      // Get the search query from the input field

      // Set a new timeout with an anonymous function
      parameter.timeoutId = setTimeout(() => {
        delayedSearchFuncionarios(query);
      }, 1000);
    };
  }




  const delayedSearchFuncionarios = async (query: string) => {
    setLoadingPorteros(true);
    const token = await getTokenCookie();
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/porteros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ buscarQuery: query }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPorteros(data);
        console.log("PORTEROS:");
        setLoadingPorteros(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoadingPorteros(false);
      });
  };

  const categoriasParaSelect = Array.from(
    new Set(
      areas?.areas?.flatMap((area: any) =>
        area?.categorias.map((categoria: any) =>
          JSON.stringify({
            label: categoria.label,
            value: categoria.id,
          })
        )
      )
    )
  ).map((str) => JSON.parse(str as string));

  console.log();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asunto: novedadActual?.asunto || "",
      crear_como:{
        label:user.areas[0].label,
        value:user.areas[0].value
      },
      servicio: null,
      portero: null,
    },
  });
  const empleadosAsignados = form.watch("empleadosAsignados", false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(files);
    setisSubmitting(true)  
    
    if (accion == "agregar") {
      try {
        console.log(values);
        
        // if(!requiereArchivos) setModalOpen(false);
        
        // setIsNovedadSubida(true);
        const { data, error } = await customFetch<any>({
          endpoint: 'novedades',
          method: 'POST',
          body: { 
            asunto:values.asunto,
            prioridad:values.prioridad.value,
            descripcion: values.descripcion,
            servicio: values.servicio?.value,
            portero: values.portero?.value,
            area:values.crear_como?.value,
            categoria: values.categoria.value,
            responsablesSeguimiento: values.responsablesSeguimiento?.map((responsable: any) => responsable.value),
            areasCopiadas: values.areasCopiadas?.map((area: any) => area.value),
            empleadosAsignados: values.empleadosAsignados?.map((empleado: any) => empleado.value),
            copiadoPrivado:values.funcionariosPrivados?.map((empleado: any) => empleado.value),
          
           },
        });
        console.log(error)
        console.log(data)
        

         if(files.length != 0){
          const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
      
    });

    const token = await getTokenCookie();
    formData.append('novedadId', data.id);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${process.env.NEXT_PUBLIC_SERVER_URL}/fileupload`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event: any) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        const fileName = files[0].name; // Assuming you upload files one by one
        setProgress((prevProgress) => ({
          ...prevProgress,
          [fileName]: percentCompleted,
        }));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        console.log(xhr)
        console.log('Novedad subida con éxito.');
        
      } else {
        alert('Tu novedad se creó, pero hubo un error al cargar los archivos');
        console.error('Upload failed', xhr.status, xhr.statusText);
      }
    };

    xhr.onerror = () => {
      alert('Tu novedad se creó, pero hubo un error al cargar los archivos.');
      console.error('Upload failed');
    };

    xhr.send(formData);
    console.log(Array.isArray(files)); 
    const imagenes = files.map(file => {          
     const path = `${data.id}${file.name.replace(/\s+/g, '')}`;
     return {
       path,
       nombre: file.name,
     };
   });
   console.log(imagenes)
   data.imagenes = imagenes;
   console.log(data)
         }
        
        
        handleNovedadAdd(data)
        setNovedadActiva(data)
        setModalOpen(false)
        alert("Novedad agregada correctamente")
        console.log(error)
        // setUsuario(data)
        
        setisSubmitting(false);
      } catch (error) {
        console.log(error)
        setisSubmitting(false);
        alert(`No se ha podido crear la novedad: ${error}`);
      }
    } else {
      try {
        const { data, error } = await customFetch({
          endpoint: "users/modificar",
          method: "PUT",
          body: {
            id: novedadActual?.id,
            asunto: values.asunto,
            prioridad: values.prioridad,

            // roles: [
            //   ...values.roles,
            //   ...rolesParaSelect,
            // ],
            // areas: [
            //   ...values.areas,
            //   ...areasParaSelect,
            // ],
          },
        });
        console.log({ id: novedadActual.id, ...values });
        console.log(data);
        console.log(error);
        setUsuario(data);
        setisSubmitting(false);

        alert("Usuario modificado correctamente");
      } catch (error) {
        setisSubmitting(false);
        alert("No se ha podido modificar el usuario");
      }
    }
  }

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
  
  

  useEffect(() => {
    const subscription = form.watch(
      (value, { name, type }) => {
        getUniqueEmpleados(value.responsablesSeguimiento, areasGenerales);
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

  if (loading || loadingAreas || loadingAreasGenerales || isLoadingAllFuncionarios)
    return (
      <div className="  justify-center m-auto">
        <LoadingSpinner size={"65"} showLabel={true} />
      </div>
    );
    // if(error || errorAreas || errorAreasGenerales) return "No se ha podido cargar el contenido"
  return (
    <div>
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
                    options={user?.areas}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  El área con el cual crearás la novedad<br></br>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


        

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Select
                    placeholder="Seleccionar"
                    defaultValue={[]}
                    options={categoriasParaSelect}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  La categoria de la novedad a crearse<br></br>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asunto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asunto</FormLabel>
                <FormControl>
                  <Input placeholder="Asunto de la novedad" {...field} />
                </FormControl>
                <FormDescription>
                  Asunto de la novedad a crearse, intenta ser descriptivo para
                  que el usuario sepa de que trata.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prioridad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <FormControl>
                  <Select
                    placeholder="Prioridad"
                    defaultValue={[]}
                    options={[
                      { label: "BAJA", value: "BAJA" },
                      { label: "MEDIA", value: "MEDIA" },
                      { label: "ALTA", value: "ALTA" },
                    ]}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Selecciona la prioridad de esta novedad<br></br>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="servicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servicio</FormLabel>
                <FormControl>
                  <Select
                    noOptionsMessage={() => "Comienza a escribir para buscar"}
                    placeholder="Seleccionar"
                    onChange={field.onChange}
                    defaultValue={field.value}
                    isClearable={true}
                    isLoading={loadingServicios}
                    onKeyDown={handleSearchServicios({ timeoutId: null })}
                    options={servicios}
                  />
                </FormControl>
                <FormDescription>
                  En caso de que la novedad corresponda a un servicio,
                  seleccionelo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funcionario</FormLabel>
                <FormControl>
                  <Select
                    noOptionsMessage={() => "Comienza a escribir para buscar"}
                    placeholder="Seleccionar"
                    onChange={field.onChange}
                    isClearable={true}
                    defaultValue={field.value}
                    isLoading={loadingPorteros}
                    onKeyDown={handleSearchFuncionarios({ timeoutId: null })}
                    options={porteros}
                  />
                </FormControl>
                <FormDescription>
                  En caso de que la novedad corresponda a un funcionario,
                  seleccionelo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <CustomTextEditor description="" onChange={field.onChange} />
                </FormControl>
                <FormDescription>                 
                  
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsablesSeguimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área de referencia</FormLabel>
                <FormDescription>
                Seleccione el área dentro de la cual está el o los <b>responsables de resolver la novedad</b>. En caso de querer asignar a toda un área, o a varias, no seleccione ningún funcionario en el campo <b>*Funcionario(s) asignado(s)*</b>.</FormDescription>
                <FormMessage />
                <FormControl>
                  <Select
                    required
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
            name="empleadosAsignados"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funcionario(s) asignado(s) </FormLabel>
                <FormDescription>
                Elige uno o más funcionarios <b>quienes serán responsables de resolver ésta novedad</b>. Solo estos funcionarios podrán ver la novedad dentro de su área.
                <b>Para poder seleccionar un Funcionario, DEBES seleccionar su área arriba.</b>
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
            name="funcionariosPrivados"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copiar a funcionarios(s):</FormLabel>
                <FormDescription>
                  Si quieres que otro(s) funcionario(s) reciban una copia de la novedad, selecciónalos aquí.
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

          <FormField
            control={form.control}
            name="areasCopiadas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copiar area(s):</FormLabel>
                <FormDescription>
                Si quieres que otra(s) área(s) reciban una copia de la novedad, selecciónala(s) aquí. Todos los miembros de estas áreas recibirán una copia de la novedad.                 
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

          <div className="flex items-center space-x-2">
           

            
          </div>

          <FileUpload
          progreso={progress}
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
