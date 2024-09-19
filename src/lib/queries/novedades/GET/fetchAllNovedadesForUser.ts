import customAxios from "@/utils/customAxios";


export const fetchAllNovedadesForUser = async () => {
  try {
    const {data} = await customAxios.get(`/novedades`);   
    return data;    
  } catch (error : any) {
    console.log("Error fetcheando novedades", error.message)    
    throw new Error(error.message);
  }
};