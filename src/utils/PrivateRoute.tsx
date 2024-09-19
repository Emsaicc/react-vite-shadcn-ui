import React from 'react';
import { useUser } from '@/context/UserContext';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PrivateRoutesProps {
  requiredPermisos?: string[];
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ requiredPermisos }) => {
  const { user,isLoadingUser } = useUser();



  if(isLoadingUser){
    return <LoadingSpinner/>;
  }
  if (!user && !isLoadingUser) {
    return <Navigate to="/login" />;
  }

  if (requiredPermisos && requiredPermisos.length > 0) {
    const hasRequiredPermisos = requiredPermisos.every(permiso =>
      user.permisos.some((userPermiso: string) => userPermiso === permiso)
    );

    if (!hasRequiredPermisos) {
      return <div>No tienes permiso para acceder a esta página.</div>;
    }
  }

  return <Outlet />;
};

export default PrivateRoutes;