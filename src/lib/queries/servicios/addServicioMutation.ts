import customAxios from "@/utils/customAxios";

import { AxiosError } from "axios";

export interface ServicioType {
    nombre: string;
    descripcion: string;
    theme: string;
    imagen: string;
}

export interface UpdateServicioType extends ServicioType {
    id: string;
}

export const addServicioMutation = async (servicio: ServicioType | UpdateServicioType) => {
    console.log("servicio", servicio.theme);
     
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
        console.log("data", data);

        return data.data;
    } catch (error) {
        console.log("error", error);
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            throw new Error(error.response?.data?.message || "Error al procesar el servicio");
        }
        console.log(error);
        throw new Error("Error inesperado al procesar el servicio");
    }
};