import customAxios from "@/utils/customAxios";


export const removeCarpeta = async (id : string) => {
  try {
    const {data} = await customAxios.delete('/novedades/agregar-visualizacion', {data:{ id }});   
    return data;    
  } catch (error : any) {    
    throw new Error(error.response.data.message);
  }
};