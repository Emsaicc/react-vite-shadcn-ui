import { AxiosError } from 'axios';
import { Servicio } from '../types/types';
import customAxios from '../utils/customAxios';

const handleApiError = (error: unknown, operation: string) => {
  const errorMessage = error instanceof AxiosError
    ? error.response?.data?.message || error.message
    : 'An unknown error occurred';
  console.error(`Error during ${operation}:`, errorMessage);
  alert(`Error: ${errorMessage}`);
  throw error;
};

export const fetchServicio = async (id: string): Promise<Servicio> => {
  try {
    const response = await customAxios.get(`/servicios/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching servicio');
    return undefined as unknown as Servicio; // Ensure a return value
  }
};

export const updateServicio = async (servicio: Servicio): Promise<Servicio | undefined> => {
  try {
    const response = await customAxios.put(`/servicios/${servicio.id}`, servicio);
    return response.data;
  } catch (error) {
    handleApiError(error, 'updating servicio');
    return undefined; // Ensure a return value
  }
};

export const deleteServicio = async (id: string): Promise<void> => {
  try {
    await customAxios.delete(`/servicios/${id}`);
  } catch (error) {
    handleApiError(error, 'deleting servicio');
  }
};

// You might also want to add a function to fetch all servicios
export const fetchAllServicios = async (): Promise<Servicio[]> => {
  try {
    const response = await customAxios.get(`/servicios`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching all servicios');
    return []; // Ensure a return value
  }
};