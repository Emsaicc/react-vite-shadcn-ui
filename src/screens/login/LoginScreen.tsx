// pages/login.tsx
"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

import { useUser } from '@/context/UserContext';

import { setTokenCookie } from '@/utils/cookies';


import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Isotipo from "../../../../public/Isotipo.png";


const LoginScreen = () => {
 
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [cedula, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isIngresando, setIsIngresando] = useState(false);


  //VOLVER A ACTIVAR PARA LA SELECCION DE EMPRESA
  // useEffect(() => {
  //   const hostname = window.location.hostname;
  //   if (!hostname.includes('.')) {
  //     navigate('/landing');
  //   }
  // }, [navigate]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsIngresando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ cedula, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data: any = await res.json();
        console.log(data);
        setTokenCookie(data.token);

        // Set user data in context and local storage
        setUser({        
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          roles: data.roles,
          subordinados: data.subordinados,
          permisos: data.permisos,
          areas: data.areas,
          imagen: data.imagen,
          filtrosCustom: data.filtrosCustom,
          filtroDefault: data.filtroDefault,          
        });
        
        navigate('/'); 
      } else {
        // Handle login error
        console.log(res);
        alert('No se ha podido iniciar sesion, verifica que tus datos sean correctos.');
        setIsIngresando(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert('No se ha podido iniciar sesion, verifica que tus datos sean correctos.');
      setIsIngresando(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
       {/* <Image
      
      src={Isotipo}
      alt="Login Image"
      layout="intrinsic"
      width={800}
      height={800}
      className="absolute top-0 left-0 sm:bottom-0 sm:left-0 animate-float opacity-10"
    /> */}
      <Card className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg relative z-10 animate-slide-in-up">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center mb-4">Ingresar</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</Label>
              <Input
                id="cedula"
                type="text"
                value={cedula}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <Button
              
              type="submit"
              className="w-full text-white py-2 px-4 rounded-md"
            >
              {isIngresando ? <LoadingSpinner size={"24"} /> : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
     
    </div>
  );
};

export default LoginScreen;
