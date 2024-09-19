export const hasRoles = (user: any,rolesToCheck: string[]) => {
    return rolesToCheck.some(role => user.roles.find((userRole: any) => userRole.label === role));
  };

export const hasPermisos = ( user: any,permisosToCheck: string[]) => {
    return permisosToCheck.some(permiso => user?.permisos?.includes(permiso));
  };
