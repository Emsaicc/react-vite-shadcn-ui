import customAxios from "@/utils/customAxios";


export const removerVisualizacionNovedad = async (novedad_id : string) => {
  try {
    const {data} = await customAxios.post('/novedades/agregar-visualizacion', { novedad_id });   
    return data;    
  } catch (error : any) {    
    throw new Error(error.response.data.message);
  }
};