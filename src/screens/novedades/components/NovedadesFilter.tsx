
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import React, { useState, useEffect,  useRef } from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


import { useSearchParams } from 'react-router-dom';
import { fetchFiltrosForUser } from '@/lib/queries/filtros/fetchFiltrosForUser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteFiltro } from '@/lib/queries/filtros/deleteFiltro';
import { Badge } from '@/components/ui/badge';

// Define types for your data
type Novedad = {
  id: string;
  asunto: string;
  contenido: string;
  contenidoResumido: string | null;
  fecha_creada: string;
  categoria_id: string;
  estado: string;
  area_id: string;
  creador_id: string;
  portero_id: string;
  servicio_id: string;
  prioridad: string;
  isActiva: boolean | null;
  area_esperando_id: string | null;
  areas_asignadas: { id: string; nombre: string }[];
  compartida_a: { id: string; nombre: string }[];
  portero: { value: string; label: string };
  servicio: { value: string; label: string; direccion: string | null };
  creador: { id: string; nombre: string; apellido: string };
  funcionarios_asignados: { id: string; nombre: string; apellido: string }[];
  imagenes: { id: string; path: string; nombre: string; respuesta_id: string | null; novedad_id: string }[];
  respuestas: any[];
  categoria: { id: string; label: string; isGlobal: boolean; area_id: string };
  area: { id: string; nombre: string };
  visualizada_por: any[];
};

type SelectOption = {
  value: string;
  label: string;
};

type FilterParams = {
  categoria: string[];
  prioridad: string[];
  estado: string[];
  compartida_a: string[];
  areas_asignadas: string[];
  funcionarios_asignados: string[];
  portero: string[];
  servicio: string[];
  asunto: string;
  creador: string[];
  notVisualized: boolean;
  hasUnvisualizedResponses: boolean;
  contenidoWords: string[]
};

type FilterProps = {
  novedades: Novedad[];
  onFilter: (filters: FilterParams) => void;
  showFilters: boolean
 
  defaultFiltro?: FilterParams;
};

const Filter: React.FC<FilterProps> = ({ novedades, onFilter, showFilters, defaultFiltro }) => {

  const [categorias, setCategorias] = useState<SelectOption[]>([]);
  const [prioridades, setPrioridades] = useState<SelectOption[]>([]);
  const [estados, setEstados] = useState<SelectOption[]>([]);
  const [compartidaA, setCompartidaA] = useState<SelectOption[]>([]);
  const [funcionariosAsignados, setFuncionariosAsignados] = useState<SelectOption[]>([]);
  const [porteros, setPorteros] = useState<SelectOption[]>([]);
  const [servicios, setServicios] = useState<SelectOption[]>([]);
  const [areasAsignadas, setAreasAsignadas] = useState<SelectOption[]>([]);
  const [creadores, setCreadores] = useState<SelectOption[]>([]);
  const [contenidoWords, setContenidoWords] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const [filtrosCustomState, setFiltrosCustomState] = useState<any[]>([]);
  const [defaultFiltroState, setDefaultFiltroState] = useState<any[]>([]);

  const [selectedCategorias, setSelectedCategorias] = useState<MultiValue<SelectOption>>([
  ]);
  const [selectedPrioridades, setSelectedPrioridades] = useState<MultiValue<SelectOption>>([]);
  const [selectedEstados, setSelectedEstados] = useState<MultiValue<SelectOption>>([]);
  const [selectedCompartidaA, setSelectedCompartidaA] = useState<MultiValue<SelectOption>>([]);
  const [selectedAreasAsignadas, setSelectedAreasAsignadas] = useState<MultiValue<SelectOption>>([]);
  const [selectedFuncionariosAsignados, setSelectedFuncionariosAsignados] = useState<MultiValue<SelectOption>>([]);
  const [selectedPorteros, setSelectedPorteros] = useState<MultiValue<SelectOption>>([]);
  const [selectedServicios, setSelectedServicios] = useState<MultiValue<SelectOption>>([]);
  const [selectedCreadores, setSelectedCreadores] = useState<MultiValue<SelectOption>>([]);
  const [selectedNotVisualized, setSelectedNotVisualized] = useState<boolean>(false);
  const [selectedhasUnvisualizedResponses, setSelectedhasUnvisualizedResponses] = useState<boolean>(false);
  const [modalOpenFiltros, setModalOpenFiltros] = useState(false);
  const [showFiltrosGuardados, setShowFiltrosGuardados] = useState(false);
 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermContenido, setsearchTermContenido] = useState('');
  const [filteredNovedadesCount, setFilteredNovedadesCount] = useState(0);

  
  const [searchParams,setSearchParams] = useSearchParams();
  

 
  const handleAddFiltro = (filtro: any) => {
    console.log(filtro)
    if (filtro.isDefault) {
      setFiltrosCustomState(prevState => 
        prevState.map(f => ({ ...f, isDefault: false }))
      );
    }
    setFiltrosCustomState(prevState => [...prevState, filtro]);
  }
    
  useEffect(() => {
    console.log("ran")
    const asuntoQuery = searchParams.get('asunto');
    if (asuntoQuery) {
      setSearchTerm(asuntoQuery);
    }

    const contenidoQuery = searchParams.get('contenido');
    if (contenidoQuery) {
      setsearchTermContenido(contenidoQuery);
      setContenidoWords(contenidoQuery.split(' '));
    }

    const categoriasQuery = searchParams.get('categorias');
    if (categoriasQuery) {
      setSelectedCategorias(categoriasQuery.split(',').map(c => ({ value: c, label: c })));
    }

    const prioridadesQuery = searchParams.get('prioridades');
    if (prioridadesQuery) {
      setSelectedPrioridades(prioridadesQuery.split(',').map(p => ({ value: p, label: p })));
    }

    const estadosQuery = searchParams.get('estados');
    if (estadosQuery) {
      setSelectedEstados(estadosQuery.split(',').map(e => ({ value: e, label: e })));
    }

    const compartidaAQuery = searchParams.get('compartida_a');
    if (compartidaAQuery) {
      setSelectedCompartidaA(compartidaAQuery.split(',').map(c => ({ value: c, label: c })));
    }

    const areasAsignadasQuery = searchParams.get('areas_asignadas');
    if (areasAsignadasQuery) {
      setSelectedAreasAsignadas(areasAsignadasQuery.split(',').map(a => ({ value: a, label: a })));
    }

    const funcionariosAsignadosQuery = searchParams.get('funcionarios_asignados');
    if (funcionariosAsignadosQuery) {
      setSelectedFuncionariosAsignados(funcionariosAsignadosQuery.split(',').map(f => ({ value: f, label: f })));
    }

    const porterosQuery = searchParams.get('porteros');
    if (porterosQuery) {
      setSelectedPorteros(porterosQuery.split(',').map(p => ({ value: p, label: p })));
    }

    const serviciosQuery = searchParams.get('servicios');
    if (serviciosQuery) {
      setSelectedServicios(serviciosQuery.split(',').map(s => ({ value: s, label: s })));
    }

    const creadoresQuery = searchParams.get('creadores');
    if (creadoresQuery) {
      setSelectedCreadores(creadoresQuery.split(',').map(c => ({ value: c, label: c })));
    }

    const notVisualizedQuery = searchParams.get('notVisualized');
    if (notVisualizedQuery) {
      setSelectedNotVisualized(notVisualizedQuery === 'true');
    }

    const hasUnvisualizedResponsesQuery = searchParams.get('hasUnvisualizedResponses');
    if (hasUnvisualizedResponsesQuery) {
      setSelectedhasUnvisualizedResponses(hasUnvisualizedResponsesQuery === 'true');
    }

    // Apply filters when the component mounts
    const initialFilters: FilterParams = {
      categoria: categoriasQuery ? categoriasQuery.split(',') : defaultFiltro?.categoria || [],
      prioridad: prioridadesQuery ? prioridadesQuery.split(',') : defaultFiltro?.prioridad || [],
      estado: estadosQuery ? estadosQuery.split(',') : defaultFiltro?.estado || [],
      compartida_a: compartidaAQuery ? compartidaAQuery.split(',') : defaultFiltro?.compartida_a || [],
      areas_asignadas: areasAsignadasQuery ? areasAsignadasQuery.split(',') : defaultFiltro?.areas_asignadas || [],
      funcionarios_asignados: funcionariosAsignadosQuery ? funcionariosAsignadosQuery.split(',') : defaultFiltro?.funcionarios_asignados || [],
      portero: porterosQuery ? porterosQuery.split(',') : defaultFiltro?.portero || [],
      servicio: serviciosQuery ? serviciosQuery.split(',') : defaultFiltro?.servicio || [],
      creador: creadoresQuery ? creadoresQuery.split(',') : defaultFiltro?.creador || [],
      asunto: asuntoQuery || defaultFiltro?.asunto || '',
      notVisualized: notVisualizedQuery === 'true' || defaultFiltro?.notVisualized || false,
      hasUnvisualizedResponses: hasUnvisualizedResponsesQuery === 'true' || defaultFiltro?.hasUnvisualizedResponses || false,
      contenidoWords: contenidoQuery ? contenidoQuery.split(' ') : defaultFiltro?.contenidoWords || []
    };

    onFilter(initialFilters);
    setFilteredNovedadesCount(filterNovedades(novedades, initialFilters)?.length);

  }, []);

  const {data:filtros,isLoading:isLoadingFiltros,isError:isErrorFiltros} = useQuery({
    queryKey:['filtros'],
    queryFn:fetchFiltrosForUser
  })


  // Extract unique options from novedades
  useEffect(() => {
    
    const extractOptions = (key: keyof Novedad, mapFunc: (item: any) => string) => {
      return Array.from(
        new Set(novedades?.flatMap((novedad) => novedad[key] ? (Array.isArray(novedad[key]) ? novedad[key].map(mapFunc) : [mapFunc(novedad[key])]) : []))
      ).map(option => ({ value: option, label: option }));
    };

    setCategorias(extractOptions('categoria', (categoria) => categoria.label));
    setPrioridades(extractOptions('prioridad', (prioridad) => prioridad));
    setEstados(extractOptions('estado', (estado) => estado));
    setCompartidaA(extractOptions('compartida_a', (item) => item.nombre));
    setAreasAsignadas(extractOptions('areas_asignadas', (item) => item.nombre));
    setFuncionariosAsignados(extractOptions('funcionarios_asignados', (item) => `${item.nombre} ${item.apellido}`));
    setPorteros(extractOptions('portero', (portero) => portero.label));
    setServicios(extractOptions('servicio', (servicio) => servicio.label));
    setCreadores(extractOptions('creador', (creador) => `${creador.nombre} ${creador.apellido}`));
  }, []);

  const updateURL = (filters: FilterParams) => {
    
    const params = new URLSearchParams();
    if (filters.asunto) params.set('asunto', filters.asunto);
    if (filters.contenidoWords.length > 0) params.set('contenido', filters.contenidoWords.join(' '));
    if (filters.categoria.length > 0) params.set('categorias', filters.categoria.join(','));
    if (filters.prioridad.length > 0) params.set('prioridades', filters.prioridad.join(','));
    if (filters.estado.length > 0) params.set('estados', filters.estado.join(','));
    if (filters.compartida_a.length > 0) params.set('compartida_a', filters.compartida_a.join(','));
    if (filters.areas_asignadas.length > 0) params.set('areas_asignadas', filters.areas_asignadas.join(','));
    if (filters.funcionarios_asignados.length > 0) params.set('funcionarios_asignados', filters.funcionarios_asignados.join(','));
    if (filters.portero.length > 0) params.set('porteros', filters.portero.join(','));
    if (filters.servicio.length > 0) params.set('servicios', filters.servicio.join(','));
    if (filters.creador.length > 0) params.set('creadores', filters.creador.join(','));
    if (filters.notVisualized) params.set('notVisualized', 'true');
    if (filters.hasUnvisualizedResponses) params.set('hasUnvisualizedResponses', 'true');

    setSearchParams(`?${params.toString()}`);
  };

  const resetFilters = () => {
    setSelectedCategorias([]);
    setSelectedPrioridades([]);
    setSelectedEstados([]);
    setSelectedCompartidaA([]);
    setSelectedAreasAsignadas([]);
    setSelectedFuncionariosAsignados([]);
    setSelectedPorteros([]);
    setSelectedServicios([]);
    setSelectedCreadores([]);
    setSelectedNotVisualized(false);
    setSelectedhasUnvisualizedResponses(false);
    setSearchTerm('');
    setsearchTermContenido('');
    setContenidoWords([]);
    updateURL({
        categoria: [],
        prioridad: [],
        estado: [],
        compartida_a: [],
        areas_asignadas: [],
        funcionarios_asignados: [],
        portero: [],
        servicio: [],
        creador: [],
        asunto: '',
        notVisualized: false,
        hasUnvisualizedResponses: false,
        contenidoWords: []
    });
    onFilter({
        categoria: [],
        prioridad: [],
        estado: [],
        compartida_a: [],
        areas_asignadas: [],
        funcionarios_asignados: [],
        portero: [],
        servicio: [],
        creador: [],
        asunto: '',
        notVisualized: false,
        hasUnvisualizedResponses: false,
        contenidoWords: []
    });
    setFilteredNovedadesCount(filterNovedades(novedades, {
        categoria: [],
        prioridad: [],
        estado: [],
        compartida_a: [],
        areas_asignadas: [],
        funcionarios_asignados: [],
        portero: [],
        servicio: [],
        creador: [],
        asunto: '',
        notVisualized: false,
        hasUnvisualizedResponses: false,
        contenidoWords: []
    }).length);
  }

//   const applyFilter = (filterString: string) => {
//     resetFilters();
//     setSearchParams(filterString);
    
//     // Parse the filter string and apply the filters
//     const params = new URLSearchParams(filterString);
//     const newFilters: FilterParams = {
//       categoria: params.get('categorias')?.split(',') || [],
//       prioridad: params.get('prioridades')?.split(',') || [],
//       estado: params.get('estados')?.split(',') || [],
//       compartida_a: params.get('compartida_a')?.split(',') || [],
//       areas_asignadas: params.get('areas_asignadas')?.split(',') || [],
//       funcionarios_asignados: params.get('funcionarios_asignados')?.split(',') || [],
//       portero: params.get('porteros')?.split(',') || [],
//       servicio: params.get('servicios')?.split(',') || [],
//       creador: params.get('creadores')?.split(',') || [],
//       asunto: params.get('asunto') || '',
//       notVisualized: params.get('notVisualized') === 'true',
//       hasUnvisualizedResponses: params.get('hasUnvisualizedResponses') === 'true',
//       contenidoWords: params.get('contenido')?.split(' ') || []
//     };

//     onFilter(newFilters);
//     setFilteredNovedadesCount(filterNovedades(novedades, newFilters)?.length);
//   };
  const filterNovedades = (novedades: Novedad[], filters: FilterParams) => {
    return novedades?.filter(novedad => {
      const matchesCategoria = filters.categoria.length === 0 || filters.categoria.includes(novedad.categoria.label);
      const matchesPrioridad = filters.prioridad.length === 0 || filters.prioridad.includes(novedad.prioridad);
      const matchesEstado = filters.estado.length === 0 || filters.estado.includes(novedad.estado);
      const matchesCompartidaA = filters.compartida_a.length === 0 || novedad.compartida_a.some(c => filters.compartida_a.includes(c.nombre));
      const matchesAreasAsignadas = filters.areas_asignadas.length === 0 || novedad.areas_asignadas.some(a => filters.areas_asignadas.includes(a.nombre));
      const matchesFuncionariosAsignados = filters.funcionarios_asignados.length === 0 || novedad.funcionarios_asignados.some(f => filters.funcionarios_asignados.includes(`${f.nombre} ${f.apellido}`));
      const matchesPortero = filters.portero.length === 0 || filters.portero.includes(novedad.portero.label);
      const matchesServicio = filters.servicio.length === 0 || filters.servicio.includes(novedad.servicio.label);
      const matchesCreador = filters.creador.length === 0 || filters.creador.includes(`${novedad.creador.nombre} ${novedad.creador.apellido}`);
      const matchesAsunto = !filters.asunto || novedad.asunto.includes(filters.asunto);
      const matchesContenidoWords = filters.contenidoWords.length === 0 || filters.contenidoWords.every(word => novedad.contenido.includes(word));
      const matchesNotVisualized = !filters.notVisualized || !novedad.visualizada_por.length;
      const matchesHasUnvisualizedResponses = !filters.hasUnvisualizedResponses || novedad.respuestas.some(r => !r.visualizada_por.length);

      return matchesCategoria && matchesPrioridad && matchesEstado && matchesCompartidaA && matchesAreasAsignadas && matchesFuncionariosAsignados && matchesPortero && matchesServicio && matchesCreador && matchesAsunto && matchesContenidoWords && matchesNotVisualized && matchesHasUnvisualizedResponses;
    });
  };

  

  const handleFilterChange = (key: keyof FilterParams, setter: React.Dispatch<React.SetStateAction<MultiValue<SelectOption>>>) => (newValue: MultiValue<SelectOption>) => {
    setter(newValue);
    const selectedValues = newValue.map(option => option.value);
  
    const filters = {
      categoria: key === 'categoria' ? selectedValues : selectedCategorias.map(option => option.value),
      prioridad: key === 'prioridad' ? selectedValues : selectedPrioridades.map(option => option.value),
      estado: key === 'estado' ? selectedValues : selectedEstados.map(option => option.value),
      compartida_a: key === 'compartida_a' ? selectedValues : selectedCompartidaA.map(option => option.value),
      areas_asignadas: key === 'areas_asignadas' ? selectedValues : selectedAreasAsignadas.map(option => option.value),
      funcionarios_asignados: key === 'funcionarios_asignados' ? selectedValues : selectedFuncionariosAsignados.map(option => option.value),
      portero: key === 'portero' ? selectedValues : selectedPorteros.map(option => option.value),
      servicio: key === 'servicio' ? selectedValues : selectedServicios.map(option => option.value),
      creador: key === 'creador' ? selectedValues : selectedCreadores.map(option => option.value),
      asunto: searchTerm,
      notVisualized: selectedNotVisualized,
      hasUnvisualizedResponses: selectedhasUnvisualizedResponses,
      contenidoWords: contenidoWords
    };

    updateURL(filters);
    onFilter(filters);
    setFilteredNovedadesCount(filterNovedades(novedades, filters).length);
    
  };

  const handleCheckboxChange = (key: 'notVisualized' | 'hasUnvisualizedResponses') => (event: boolean) => {
    const newValue = event;
    if (key === 'notVisualized') {
      setSelectedNotVisualized(newValue);
    } else if (key === 'hasUnvisualizedResponses') {
      setSelectedhasUnvisualizedResponses(newValue);
    }
  
    const filters = {
      categoria: selectedCategorias.map(option => option.value),
      prioridad: selectedPrioridades.map(option => option.value),
      estado: selectedEstados.map(option => option.value),
      compartida_a: selectedCompartidaA.map(option => option.value),
      areas_asignadas: selectedAreasAsignadas.map(option => option.value),
      funcionarios_asignados: selectedFuncionariosAsignados.map(option => option.value),
      portero: selectedPorteros.map(option => option.value),
      servicio: selectedServicios.map(option => option.value),
      creador: selectedCreadores.map(option => option.value),
      asunto: searchTerm,
      notVisualized: key === 'notVisualized' ? newValue : selectedNotVisualized,
      hasUnvisualizedResponses: key === 'hasUnvisualizedResponses' ? newValue : selectedhasUnvisualizedResponses,
      contenidoWords: contenidoWords
    };

    updateURL(filters);
    onFilter(filters);
    setFilteredNovedadesCount(filterNovedades(novedades, filters).length);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    
    const filters = {
      categoria: selectedCategorias.map(option => option.value),
      prioridad: selectedPrioridades.map(option => option.value),
      estado: selectedEstados.map(option => option.value),
      compartida_a: selectedCompartidaA.map(option => option.value),
      areas_asignadas: selectedAreasAsignadas.map(option => option.value),
      funcionarios_asignados: selectedFuncionariosAsignados.map(option => option.value),
      portero: selectedPorteros.map(option => option.value),
      servicio: selectedServicios.map(option => option.value),
      creador: selectedCreadores.map(option => option.value),
      asunto: newSearchTerm,
      notVisualized: selectedNotVisualized,
      hasUnvisualizedResponses: selectedhasUnvisualizedResponses,
      contenidoWords: contenidoWords
    };

    updateURL(filters);
    onFilter(filters);
    setFilteredNovedadesCount(filterNovedades(novedades, filters).length);
  };

  const deleteFilter = async (id: number) => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este filtro?")
    if(confirm) {
        const {mutate : deleteFiltroS, isPending:isPendingDeleteFiltro} = await useMutation({
            mutationFn: deleteFiltro,
            onSuccess: ()=> {
             queryClient.invalidateQueries({ queryKey: ["filtros"] });
            },
            onError: (error)=> {
              console.log(error)
              alert("Error al borrar el filtro");
            }
          });
          try {
            await deleteFiltroS(id.toString());
          }catch(error){
            console.log(error)
          }



          
    
  }
  }
 

  const handleShowFiltrosGuardados = () => {
    setShowFiltrosGuardados((prev) => !prev);
  }
  const handleSearchChangeContenido = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTermContenido = event.target.value;
    setsearchTermContenido(searchTermContenido);
    const palabras = searchTermContenido.split(' ')
    setContenidoWords(palabras);
    
    const filters = {
      categoria: selectedCategorias.map(option => option.value),
      prioridad: selectedPrioridades.map(option => option.value),
      estado: selectedEstados.map(option => option.value),
      compartida_a: selectedCompartidaA.map(option => option.value),
      areas_asignadas: selectedAreasAsignadas.map(option => option.value),
      funcionarios_asignados: selectedFuncionariosAsignados.map(option => option.value),
      portero: selectedPorteros.map(option => option.value),
      servicio: selectedServicios.map(option => option.value),
      creador: selectedCreadores.map(option => option.value),
      asunto: searchTerm,
      notVisualized: selectedNotVisualized,
      hasUnvisualizedResponses: selectedhasUnvisualizedResponses,
      contenidoWords: palabras
    };

    updateURL(filters);
    onFilter(filters);
    setFilteredNovedadesCount(filterNovedades(novedades, filters).length);
  };

  return (
    
    <div className='grid grid-cols-1 gap-y-2'>
      
      <div className='lg:grid lg:grid-cols-2 lg:gap-y-2 lg:gap-x-2'>
        <div className='mt-4 lg:col-span-2'>Filtros rápidos:</div>
        <div>
      <Label htmlFor="asunto">Asunto</Label>
          <Input
            id="asunto"
            type="text"
            placeholder="Filtar por asunto "
            value={searchTerm}
            onChange={handleSearchChange}
          /></div>

<div>
          <Label htmlFor="contenidoWords">Contenido</Label>
          <Input
           placeholder="Buscar en el contenido de la novedad"
            id="contenidoWords"
            type="text"
            value={searchTermContenido}
            onChange={handleSearchChangeContenido}
          />
          </div>

          <div className='col-span-2'>
          <Label htmlFor="categorias">Categorías</Label>
          <Select
            id="categorias"
            placeholder="Filtar por categoría(s)"
            options={categorias}
            isMulti
            value={selectedCategorias}
            onChange={handleFilterChange('categoria', setSelectedCategorias)}
          />
          </div>
          <div className='col-span-2'>
          <Label htmlFor="estados">Estado</Label>
          <Select
            id="estados"
            options={estados}
            placeholder="Filtar por estado(s)"
            isMulti
            value={selectedEstados}
            onChange={handleFilterChange('estado', setSelectedEstados)}
          />
          </div>
<div className='flex items-center space-x-2'>
      <Label  className="flex-shrink-0" htmlFor="notVisualized">Mostrar novedades nuevas</Label>
          <Switch
            id="notVisualized"
            checked={selectedNotVisualized}
            onCheckedChange={handleCheckboxChange('notVisualized')}
          />
          </div>
          
          <div className='lg:flex lg:items-center space-x-2'>

          <Label className='flex-shrink-1' htmlFor="hasUnvisualizedResponses">Mostrar novedades con nuevas respuestas </Label>
          <Switch
            id="hasUnvisualizedResponses"
            checked={selectedhasUnvisualizedResponses}
            onCheckedChange={handleCheckboxChange('hasUnvisualizedResponses')}
          />
          </div>
         
         
  </div>
  <div className='mt-10 grid grid-cols-3 gap-4 w-full'>
    {filtros && showFiltrosGuardados && filtros.map((filtro : any) => (
      <div 
        key={filtro.id} 
        // onClick={() => router.push(`?${filtro.filtro}`)} 
        className="flex flex-col hover:cursor-pointer items-start justify-between border-2 border-solid border-primary/75 rounded-lg p-4 space-y-2"
      >
        <div className='flex justify-between w-full'>
          <span className="font-semibold">{filtro.nombre}</span>
          {filtro.isDefault && <Badge className='bg-green-500'>Filtro inicial</Badge>}
        </div>
        <div className="flex space-x-2">
          <Badge 
            variant="destructive" 
            onClick={(e) => {
              e.stopPropagation();
              deleteFilter(filtro.id);
            }}
          >
            Eliminar
          </Badge>
          
        </div>
      </div>
    ))}
  </div>
  
      {showFilters && (

        <div className=' p-4 border-2 border-solid border-primary rounded-xl'>
          <div>Más filtros: </div>
          

          <Label htmlFor="prioridades">Prioridades</Label>
          <Select
            id="prioridades"
            options={prioridades}
            placeholder="Filtar por prioridad(es)"
            isMulti
            value={selectedPrioridades}
            onChange={handleFilterChange('prioridad', setSelectedPrioridades)}
          />

         

          <Label htmlFor="compartidaA">Compartida A</Label>
          <Select
            id="compartidaA"
            options={compartidaA}
            placeholder="Filtar por área(s) a la(s) que se compartió "
            isMulti
            value={selectedCompartidaA}
            onChange={handleFilterChange('compartida_a', setSelectedCompartidaA)}
          />

          <Label htmlFor="areasAsignadas">Areas Asignadas</Label>
          <Select
            id="areasAsignadas"
            options={areasAsignadas}
            placeholder="Filtar por área(s) a la(s) que se asignó "
            isMulti
            value={selectedAreasAsignadas}
            onChange={handleFilterChange('areas_asignadas', setSelectedAreasAsignadas)}
          />

          <Label htmlFor="funcionariosAsignados">Funcionarios Asignados</Label>
          <Select
            id="funcionariosAsignados"
            placeholder="Filtar por funcionario(s) a los que se asignó "
            options={funcionariosAsignados}
            isMulti
            value={selectedFuncionariosAsignados}
            onChange={handleFilterChange('funcionarios_asignados', setSelectedFuncionariosAsignados)}
          />

          <Label htmlFor="porteros">Porteros</Label>
          <Select
            id="porteros"
            options={porteros}
            placeholder="Filtar por funcionario(s) sobre quien(es) es la novedad "
            isMulti
            value={selectedPorteros}
            onChange={handleFilterChange('portero', setSelectedPorteros)}
          />

          <Label htmlFor="servicios">Servicios</Label>
          <Select
            id="servicios"
            options={servicios}
            placeholder="Filtar por servicio(s) sobre los cuales es la novedad "
            isMulti
            value={selectedServicios}
            onChange={handleFilterChange('servicio', setSelectedServicios)}
          />

          <Label htmlFor="creadores">Creadores</Label>
          <Select
            id="creadores"
            options={creadores}
            placeholder="Filtar por funcionario quien creó la novedad "
            isMulti
            value={selectedCreadores}
            onChange={handleFilterChange('creador', setSelectedCreadores)}
          />


          
        
<div className='w-full col-span-2'>
           {/* <Button className='w-full' onClick={applyPendingFilters}>Aplicar filtros</Button> */}
           <Button className='w-full' onClick={resetFilters}>Limpiar filtros</Button>
         </div>
          <div className='my-2'>
            <Dialog open={modalOpenFiltros} onOpenChange={setModalOpenFiltros}>
              <DialogTrigger asChild>
                <Button className='w-full' >Guardar filtros</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  {/* <GuardarFiltroForm setModalOpenFiltros={setModalOpenFiltros} addFiltro={handleAddFiltro}/> */}
                </DialogHeader>
              </DialogContent>
            </Dialog>
            
            </div>
          <div className='my-2'><Button className='w-full' onClick={handleShowFiltrosGuardados}>{showFiltrosGuardados ? "Ocultar filtros guardados" : "Mostrar filtros guardados"}</Button></div>
        </div>
        
        
      )}
      <div className='mt-4'>Novedades encontradas: {filteredNovedadesCount}</div>
    </div>
  );
};

export default Filter;
