import axios from 'axios';
import { getTokenCookie } from './cookies';

const customAxios = axios.create({

  baseURL: import.meta.env.VITE_PUBLIC_SERVER_URL,
});

customAxios.interceptors.request.use(async (config) => {
  const token = await getTokenCookie();
  if (token) {

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 423) {
      alert("Tu sesión ha caducado, por favor inicia sesión de nuevo")
      window.location.href = '/login'; // Redirect to the desired URL
    }

    return Promise.reject(error);
  }

);

export default customAxios;