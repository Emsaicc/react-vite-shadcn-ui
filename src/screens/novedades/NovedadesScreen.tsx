
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useUser } from "@/context/UserContext";
import { fetchAllNovedadesForUser } from "@/lib/queries/novedades/GET/fetchAllNovedadesForUser"
import { useQuery } from "@tanstack/react-query"

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import NovedadesList from "./components/NovedadesList";
import TituloPagina from "@/components/ui/TituloPagina";
import NovedadDetalle from "./components/NovedadDetalle";
import { useState } from "react";
import { Novedad } from "@/types/types";
import Filter from "./components/NovedadesFilter";

dayjs.extend(utc);
dayjs.extend(timezone);



function NovedadesScreen() {
  const {data:novedades,isPending,isError} = useQuery({
    queryKey: ["novedades"],
    queryFn: () => fetchAllNovedadesForUser(),
    
  })

  interface FilterOption {
  value: string;
  label: string;
}

type FilterParams = {
  categoria: string[];
  prioridad: string[];
  estado: string[];
  compartida_a: string[];
  areas_asignadas: string[];
  funcionarios_asignados: string[];
  creador: string[];
  portero: string[];
  servicio: string[];
  asunto: string;
  notVisualized: boolean; // Added filter
  hasUnvisualizedResponses: boolean;
  contenidoWords: string[];
};
  const {user,isLoadingUser} = useUser();


  const [novedadActiva, setNovedadActiva] = useState<Novedad | null>(null);
  const [filteredNovedades, setfilteredNovedades] = useState<Novedad[]>([]);

  const handleFilter = (filters: FilterParams) => {
    const {
      categoria,
      prioridad,
      estado,
      compartida_a,
      areas_asignadas,
      funcionarios_asignados,
      portero,
      servicio,
      creador,
      asunto,
      notVisualized,
      hasUnvisualizedResponses,
      contenidoWords,
    } = filters;

    // Assuming `user.id` is available and represents the current user's ID
    const userId = user?.id;

    // Filter the novedades based on the provided filters
    const filtered = novedades?.filter((novedad :Novedad) => {
      // Extract relevant fields from novedad
      const novedadCategoria = novedad?.categoria?.label || "";
      const novedadPrioridad = novedad?.prioridad || "";
      const novedadEstado = novedad?.estado || "";
      const novedadCompartidaA =
        novedad?.compartida_a?.map((a) => a.nombre) || [];
      const novedadAsignadaA =
        novedad?.areas_asignadas?.map((a) => a.nombre) || [];
      const novedadFuncionariosAsignados =
        novedad?.funcionarios_asignados?.map(
          (f) => `${f.nombre} ${f.apellido}`
        ) || [];
      const novedadPortero = novedad?.portero?.label || "";
      const novedadServicio = novedad?.servicio?.label || "";
      const novedadCreador = `${novedad?.creador.nombre} ${novedad?.creador.apellido}`;
      const novedadAsunto = novedad?.asunto || "";
      const novedadContenido = novedad?.contenido || "";

      // Determine if the item should be included based on all filters
      const shouldInclude =
        // Apply additional filters based on the state of each filter
        (!categoria.length || categoria.includes(novedadCategoria)) &&
        (!prioridad.length || prioridad.includes(novedadPrioridad)) &&
        (!estado.length || estado.includes(novedadEstado)) &&
        (!compartida_a.length ||
          compartida_a.some((name) => novedadCompartidaA.includes(name))) &&
        (!areas_asignadas.length ||
          areas_asignadas.some((name: any) =>
            novedadAsignadaA.includes(name)
          )) &&
        (!funcionarios_asignados.length ||
          funcionarios_asignados.some((name) =>
            novedadFuncionariosAsignados.includes(name)
          )) &&
        (!portero.length || portero.includes(novedadPortero)) &&
        (!servicio.length || servicio.includes(novedadServicio)) &&
        (!creador.length || creador.includes(novedadCreador)) &&
        (asunto === "" ||
          novedadAsunto.toLowerCase().includes(asunto.toLowerCase())) &&
        (contenidoWords.length === 0 ||
          contenidoWords.some((word) =>
            novedadContenido.toLowerCase().includes(word.toLowerCase())
          )) &&
        (notVisualized == false ||
          !novedad?.visualizada_por.some((item) => item.user_id === userId)) &&
          (hasUnvisualizedResponses == false ||
            (novedad?.respuestas.length > 0 &&
              novedad?.respuestas.some(
                (respuesta: any) =>
                  !respuesta.visualizada_por.some(
                    (item: any) => item.user_id === userId
                  )
              )));
  
        return shouldInclude;
      });
  
      // Update the state with the filtered results
      setfilteredNovedades(filtered);
    };

  if(isPending || isLoadingUser ) return <LoadingSpinner size="84" texto="Cargando novedades..."/>
  if(isError) return <div>Error cargando novedades</div>
  return (

    <div>
      <TituloPagina titulo="Novedades" descripcion="Novedades empresariales" />
      <Filter showFilters={true}
              novedades={novedades}
              onFilter={handleFilter}/>
      <NovedadesList setNovedadActiva={setNovedadActiva} novedades={filteredNovedades} user={user}/>
      <NovedadDetalle novedadActiva={novedadActiva} handleRemoverVistaNovedad={setNovedadActiva} carpetas={undefined} handleAgregarNovedadAcarpeta={undefined}/>
    </div>
  )
}

export default NovedadesScreen