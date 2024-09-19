import { QUERY_KEY } from '@/lib/queries/queryKeys';
import { Novedad } from '@/types/types';
import customAxios from '@/utils/customAxios';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';




const fetcNovedades = async (): Promise<Novedad[]> => {
    try {
        const {data} = await customAxios.get('/novedades');   
        return data;    
      } catch (error : any) {
        console.log(error.response.data.message)
        console.error("Error fetching novedades:", error);
        throw new Error(error.response.data.message);
      }
};

interface UseTodos {
  novedades: Novedad[];
  isLoading: boolean;
  isFetching: boolean;
  error?: any;
  setUserFilter: Dispatch<SetStateAction<string | null>>;
}



export const useTodos = (): UseTodos => {
  const [userFilter, setUserFilter] = useState<string | null>(null);

  const filterNovedadByCreador = useCallback(
    (todos: Novedad[]) => {
      if (!userFilter) return todos;
      return todos.filter((novedad) => novedad.creador_id === userFilter);
    },
    [userFilter]
  );

  const {
    data: novedades = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.novedades],
    queryFn: fetcNovedades,
    refetchOnWindowFocus: false,
    retry: 2,
    select: filterNovedadByCreador,
  });

  return {
    novedades,
    isLoading,
    isFetching,
    error: error,
    setUserFilter,
  };
};