import customAxios from "@/utils/customAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface ServicioType {
    nombre: string;
    email: string;    
    imagen?: string;
}

export interface UpdateServicioType extends ServicioType {
    id: string;
}

export const usePostServicios = (onSuccess: (data: any) => void, onError: (error: any) => void) => {
    const queryClient = useQueryClient();

    const mutateServicio = async (servicio: ServicioType | UpdateServicioType) => {
      
        try {
            let data;
            if ('id' in servicio) { // Siempre va a recibir un servicio, si recibe un id, es un update
                // If id is present, it's an update operation
                const { id } = servicio;
                data = await customAxios.patch(`/servicios/${id}`, servicio);
            } else {
                // Otherwise, it's a create operation
                data = await customAxios.post("/servicios", servicio);
            }
            queryClient.invalidateQueries({ queryKey: ["servicios"] });
            return data.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data?.message || "Error al procesar el servicio");
            }
            console.log(error);
            throw new Error("Error inesperado al procesar el servicio");
        }
    };

    const mutation = useMutation({
        mutationFn: mutateServicio,
        onSuccess,
        onError
    });

    return {
        ...mutation,
        isPending: mutation.isPending
    };
};