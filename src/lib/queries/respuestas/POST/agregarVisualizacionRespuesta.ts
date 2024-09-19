import customAxios from "@/utils/customAxios";


export const agregarVisualizacionRespuesta = async (respuestas : string[]) => {
  try {
    const {data} = await customAxios.post('/novedades/agregar-visualizacion', { respuestas });   
    return data;    
  } catch (error : any) {
    console.log(error.response.data.message)
    console.error("Error fetching servicios:", error);
    throw new Error(error.response.data.message);
  }
};