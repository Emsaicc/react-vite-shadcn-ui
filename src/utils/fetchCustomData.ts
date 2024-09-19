import { getTokenCookie } from '../utils/cookies';

export interface FetchOptions {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: HeadersInit;
}

export const customFetch = async <T,>({ endpoint, method, body, headers }: FetchOptions): Promise<{ data: T | null; error: string | null }> => {
  let data: T | null = null;
  let error: string | null = null;

  try {
    const token = await getTokenCookie();
    console.log("llamando " + endpoint)
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // if (!res.ok) {
    //   if(res.status === 423 && endpoint !== "auth/validarJWT" && endpoint !== "auth/login"){
    //     alert("Tu sesión ha caducado, por favor vuelve a iniciarla.")
    //     window.location.href = 'https://mastersonasistencia.uy/login';
    //   }
    //     console.log(res, body)
    //   throw new Error(res.statusText);
    // }

    
    data = await res.json();
    console.log(data)
  } catch (err) {
    console.log(err)
    error = "Error fetching: " + " " + err;
  }

  return { data, error };
};


