import customAxios from "@/utils/customAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDeleteServicios = (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
    const queryClient = useQueryClient();
  

    const deleteServicio = async ({ id, activar }: { id: string, activar?: boolean }) => {
        try {
            const { data } = await customAxios.delete(`/servicios/${id}/${activar}`);
            queryClient.invalidateQueries({ queryKey: ["servicios"] });
            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data?.message || "Error al eliminar el servicio");
            }
            console.log(error);
            throw new Error("Error inesperado al eliminar el servicio");
        }
    };

    const mutation = useMutation({
        mutationFn: deleteServicio,
        onSuccess,
        onError
    });

    return {
        ...mutation,
        isPending: mutation.isPending
    };
};