import customAxios from "@/utils/customAxios";


export const fetchAllPorteros = async (novedadId:string) => {
  try {
    const {data} = await customAxios.get(`/novedades/get-one-by-id/?&novedad=${novedadId}`);   
    return data;    
  } catch (error : any) {
    console.log(error.response.data.message)
    console.error("Error fetching servicios:", error);
    throw new Error(error.response.data.message);
  }
};