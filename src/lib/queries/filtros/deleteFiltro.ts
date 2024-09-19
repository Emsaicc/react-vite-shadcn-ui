import customAxios from "@/utils/customAxios";


export const deleteFiltro = async (filtro_id : string) => {
  try {
    const {data} = await customAxios.delete(`users/filtros/${filtro_id}`);   
    return data;    
  } catch (error : any) {    
    throw new Error(error.response.data.message);
  }
};