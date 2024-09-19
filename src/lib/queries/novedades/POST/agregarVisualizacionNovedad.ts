import customAxios from "@/utils/customAxios";


export const agregarVisualizacionNovedad = async (novedad_id : string) => {
  try {
    const {data} = await customAxios.post('/novedades/remover-visualizacion', { novedad_id });   
    return data;    
  } catch (error : any) {
    console.log(error.response.data.message)
    console.error("Error fetching servicios:", error);
    throw new Error(error.response.data.message);
  }
};