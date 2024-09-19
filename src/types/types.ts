// types.ts

// User model
export type User = {
  id: string;
  email?: string;
  nombre: string;
  apellido: string;
  cedula: string;
  password: string;
  isActivo: boolean;
  fecha_agregado: Date;
  imagen?: string;
  novedades_creadas: Novedad[];
  pushNotificationSubscriptions: PushNotificationSubscription[];
  respuestas_creadas: Respuesta[];
  roles: Rol[];
  asigna_novedades: Novedad[];
  asignado_a_novedades: Novedad[];
  areas: Area[];
  novedades_visualizadas: NovedadVisualizadaPor[];
  respuestas_visualizadas: RespuestaVisualizadaPor[];
};

// PushNotificationSubscription model
export type PushNotificationSubscription = {
  id: number;
  endpoint: string;
  expirationTime?: Date;
  p256dh: string;
  auth: string;
  user_id: string;
  user: User;
};

// Rol model
export type Rol = {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: Permiso[];
  subordinados: Rol[];
  users: User[];
};

// Permiso model
export type Permiso = {
  id: string;
  nombre: string;
  descripcion: string;
  Rol: Rol[];
};

// Novedad model
export type Novedad = {
  id: string;
  asunto: string;
  contenido: string;
  fecha_creada: Date;
  categoria_id: string;
  estado: Estado;
  area_id: string;
  creador_id: string;
  portero_id?: string;
  servicio_id?: string;
  prioridad: string;
  isActiva?: boolean;
  area_esperando_id?: string;
  contenidoResumido?: string;
  imagenes: Imagen[];
  area_esperando?: Area;
  area: Area;
  categoria: Categoria;
  creador: User;
  portero?: Portero;
  servicio?: Servicio;
  respuestas: Respuesta[];
  asignada_a: User[];
  funcionarios_asignados: User[];
  copiadoPrivado: User[];
  compartida_a: Area[];
  areas_asignadas: Area[];
  visualizada_por: NovedadVisualizadaPor[];
};

// NovedadVisualizadaPor model
export type NovedadVisualizadaPor = {
  novedad_id: string;
  user_id: string;
  novedad: Novedad;
  user: User;
};

// RespuestaVisualizadaPor model
export type RespuestaVisualizadaPor = {
  respuesta_id: string;
  user_id: string;
  respuesta: Respuesta;
  user: User;
};

// Categoria model
export type Categoria = {
  id: string;
  value?: string
  label?: string;
  isGlobal: boolean;
  area_id?: string;
  area?: Area;
  novedades: Novedad[];
};

// Respuesta model
export type Respuesta = {
  id: string;
  estadoId: number;
  contenido: string;
  area_id: string;
  creadorId: string;
  fecha_creada: Date;
  novedad_id: string;
  estado_nuevo: Estado;
  imagenes: Imagen[];
  copiadoPrivado: User;
  creador: User;
  novedad: Novedad;
  visualizada_por: RespuestaVisualizadaPor[];
};

// Imagen model
export type Imagen = {
  id: string;
  path: string;
  nombre?: string;
  respuesta_id?: string;
  novedad_id?: string;
  novedad?: Novedad;
  respuesta?: Respuesta;
};

// Area model
export type Area = {
  id: string;
  nombre: string;
  isActivo: boolean;
  categorias: Categoria[];
  area_esperando: Novedad[];
  novedad: Novedad[];
  novedades_compartidas: Novedad[];
  empleados: User[];
  novedades_asignadas: Novedad[];
};

// Portero model
export type Portero = {
  label: string;
  value: string;
  novedades: Novedad[];
};

// Servicio model
export type Servicio = {
  label: string;
  value: string;
  direccion?: string;
  novedades: Novedad[];
};

// Estado enum
export enum Estado {
  PENDIENTE = "PENDIENTE",
  FINALIZADO = "FINALIZADO",
  ENPROCESO = "ENPROCESO",
}
