import customAxios from "@/utils/customAxios";


export const fetchAllServicios = async () => {
  try {
    const {data} = await customAxios.get('/servicios');   
    return data;    
  } catch (error : any) {
    console.log(error.response.data.message)
    console.error("Error fetching servicios:", error);
    throw new Error(error.response.data.message);
  }
};