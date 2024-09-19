import customAxios from "@/utils/customAxios";


export const fetchAllPorteros = async () => {
  try {
    const {data} = await customAxios.get('/porteros');   
    return data;    
  } catch (error : any) {
    console.log(error.response.data.message)
    console.error("Error fetching servicios:", error);
    throw new Error(error.response.data.message);
  }
};