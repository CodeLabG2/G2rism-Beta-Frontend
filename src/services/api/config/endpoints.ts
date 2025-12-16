/**
 * Endpoints de la API G2rism
 * Centraliza todas las URLs de los endpoints del backend
 */

export const API_ENDPOINTS = {
  // AUTENTICACIÓN
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    RECUPERAR_PASSWORD: '/api/auth/recuperar-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    CAMBIAR_PASSWORD: '/api/auth/cambiar-password',
  },

  // USUARIOS
  USUARIOS: {
    BASE: '/api/usuarios',
    BY_ID: (id: number) => `/api/usuarios/${id}`,
    BY_USERNAME: (username: string) => `/api/usuarios/username/${username}`,
    BY_EMAIL: (email: string) => `/api/usuarios/email/${email}`,
    ASIGNAR_ROL: '/api/usuarios/asignar-rol',
    REMOVER_ROL: '/api/usuarios/remover-rol',
    BLOQUEAR: (id: number) => `/api/usuarios/${id}/bloquear`,
    DESBLOQUEAR: (id: number) => `/api/usuarios/${id}/desbloquear`,
    ACTIVAR: (id: number) => `/api/usuarios/${id}/activar`,
    DESACTIVAR: (id: number) => `/api/usuarios/${id}/desactivar`,
  },

  // ROLES
  ROLES: {
    BASE: '/api/roles',
    BY_ID: (id: number) => `/api/roles/${id}`,
    ASIGNAR_PERMISO: '/api/roles/asignar-permiso',
    REMOVER_PERMISO: '/api/roles/remover-permiso',
    CON_PERMISOS: (id: number) => `/api/roles/${id}/con-permisos`,
  },

  // PERMISOS
  PERMISOS: {
    BASE: '/api/permisos',
    BY_ID: (id: number) => `/api/permisos/${id}`,
    BY_MODULO: (modulo: string) => `/api/permisos/modulo/${modulo}`,
  },

  // CLIENTES
  CLIENTES: {
    BASE: '/api/clientes',
    BY_ID: (id: number) => `/api/clientes/${id}`,
    BY_DOCUMENTO: (doc: string) => `/api/clientes/documento/${doc}`,
    BY_EMAIL: (email: string) => `/api/clientes/email/${email}`,
    BUSCAR: '/api/clientes/buscar',
    ESTADISTICAS: '/api/clientes/estadisticas',
    CON_USUARIO: (id: number) => `/api/clientes/${id}/con-usuario`,
    CON_CATEGORIA: (id: number) => `/api/clientes/${id}/con-categoria`,
    CON_PREFERENCIAS: (id: number) => `/api/clientes/${id}/con-preferencias`,
    POR_CATEGORIA: (categoriaId: number) => `/api/clientes/por-categoria/${categoriaId}`,
    ACTIVAR: (id: number) => `/api/clientes/${id}/activar`,
    DESACTIVAR: (id: number) => `/api/clientes/${id}/desactivar`,
  },

  // CATEGORÍAS CLIENTE
  CATEGORIAS_CLIENTE: {
    BASE: '/api/categorias-cliente',
    BY_ID: (id: number) => `/api/categorias-cliente/${id}`,
    ACTIVAR: (id: number) => `/api/categorias-cliente/${id}/activar`,
    DESACTIVAR: (id: number) => `/api/categorias-cliente/${id}/desactivar`,
  },

  // PREFERENCIAS CLIENTE
  PREFERENCIAS_CLIENTE: {
    BASE: '/api/preferencias-cliente',
    BY_ID: (id: number) => `/api/preferencias-cliente/${id}`,
    BY_CLIENTE: (clienteId: number) => `/api/preferencias-cliente/cliente/${clienteId}`,
  },

  // EMPLEADOS
  EMPLEADOS: {
    BASE: '/api/empleados',
    BY_ID: (id: number) => `/api/empleados/${id}`,
    BY_DOCUMENTO: (doc: string) => `/api/empleados/documento/${doc}`,
    BY_EMAIL: (email: string) => `/api/empleados/email/${email}`,
    BUSCAR: '/api/empleados/buscar',
    ESTADISTICAS: '/api/empleados/estadisticas',
    CON_USUARIO: (id: number) => `/api/empleados/${id}/con-usuario`,
    CON_JEFE: (id: number) => `/api/empleados/${id}/con-jefe`,
    SUBORDINADOS: (id: number) => `/api/empleados/${id}/subordinados`,
    JERARQUIA: (id: number) => `/api/empleados/${id}/jerarquia`,
    SIN_JEFE: '/api/empleados/sin-jefe',
    POR_CARGO: (cargo: string) => `/api/empleados/por-cargo/${cargo}`,
    POR_ESTADO: (estado: string) => `/api/empleados/por-estado/${estado}`,
    ACTIVAR: (id: number) => `/api/empleados/${id}/activar`,
    DESACTIVAR: (id: number) => `/api/empleados/${id}/desactivar`,
  },

  // PROVEEDORES
  PROVEEDORES: {
    BASE: '/api/proveedores',
    BY_ID: (id: number) => `/api/proveedores/${id}`,
    BY_NIT: (nit: string) => `/api/proveedores/nit/${nit}`,
    BY_EMAIL: (email: string) => `/api/proveedores/email/${email}`,
    BUSCAR: '/api/proveedores/buscar',
    ESTADISTICAS: '/api/proveedores/estadisticas',
    POR_TIPO: (tipo: string) => `/api/proveedores/por-tipo/${tipo}`,
    POR_ESTADO: (estado: string) => `/api/proveedores/por-estado/${estado}`,
    CON_CONTRATOS: (id: number) => `/api/proveedores/${id}/con-contratos`,
    ACTIVAR: (id: number) => `/api/proveedores/${id}/activar`,
    DESACTIVAR: (id: number) => `/api/proveedores/${id}/desactivar`,
    SUSPENDER: (id: number) => `/api/proveedores/${id}/suspender`,
  },

  // CONTRATOS PROVEEDOR
  CONTRATOS: {
    BASE: '/api/contratos-proveedor',
    BY_ID: (id: number) => `/api/contratos-proveedor/${id}`,
    BY_NUMERO: (numero: string) => `/api/contratos-proveedor/numero/${numero}`,
    BY_PROVEEDOR: (proveedorId: number) => `/api/contratos-proveedor/proveedor/${proveedorId}`,
    POR_ESTADO: (estado: string) => `/api/contratos-proveedor/por-estado/${estado}`,
    VIGENTES: '/api/contratos-proveedor/vigentes',
    POR_VENCER: '/api/contratos-proveedor/por-vencer',
    VENCIDOS: '/api/contratos-proveedor/vencidos',
    ESTADISTICAS: '/api/contratos-proveedor/estadisticas',
    RENOVAR: (id: number) => `/api/contratos-proveedor/${id}/renovar`,
    CANCELAR: (id: number) => `/api/contratos-proveedor/${id}/cancelar`,
  },

  // AEROLÍNEAS
  AEROLINEAS: {
    BASE: '/api/aerolineas',
    BY_ID: (id: number) => `/api/aerolineas/${id}`,
    BY_IATA: (codigo: string) => `/api/aerolineas/iata/${codigo}`,
    BY_ICAO: (codigo: string) => `/api/aerolineas/icao/${codigo}`,
    ACTIVAS: '/api/aerolineas/activas',
    ACTIVAR: (id: number) => `/api/aerolineas/${id}/activar`,
    DESACTIVAR: (id: number) => `/api/aerolineas/${id}/desactivar`,
  },

  // VENTAS
  VENTAS: {
    BASE: '/api/ventas',
    BY_ID: (id: number) => `/api/ventas/${id}`,
    BY_NUMERO: (numero: string) => `/api/ventas/numero/${numero}`,
    BY_CLIENTE: (clienteId: number) => `/api/ventas/cliente/${clienteId}`,
    BY_EMPLEADO: (empleadoId: number) => `/api/ventas/empleado/${empleadoId}`,
    BUSCAR: '/api/ventas/buscar',
    ESTADISTICAS: '/api/ventas/estadisticas',
    POR_ESTADO: (estado: string) => `/api/ventas/por-estado/${estado}`,
    POR_TIPO: (tipo: string) => `/api/ventas/por-tipo/${tipo}`,
    POR_FECHA: '/api/ventas/por-fecha',
    DASHBOARD: '/api/ventas/dashboard',
    ANULAR: (id: number) => `/api/ventas/${id}/anular`,
    CONFIRMAR: (id: number) => `/api/ventas/${id}/confirmar`,
    COMPLETAR: (id: number) => `/api/ventas/${id}/completar`,
  },

  // COTIZACIONES
  COTIZACIONES: {
    BASE: '/api/cotizaciones',
    BY_ID: (id: number) => `/api/cotizaciones/${id}`,
    BY_NUMERO: (numero: string) => `/api/cotizaciones/numero/${numero}`,
    BY_CLIENTE: (clienteId: number) => `/api/cotizaciones/cliente/${clienteId}`,
    BUSCAR: '/api/cotizaciones/buscar',
    ESTADISTICAS: '/api/cotizaciones/estadisticas',
    PENDIENTES: '/api/cotizaciones/pendientes',
    ACEPTADAS: '/api/cotizaciones/aceptadas',
    RECHAZADAS: '/api/cotizaciones/rechazadas',
    VENCIDAS: '/api/cotizaciones/vencidas',
    CONVERTIR_A_VENTA: (id: number) => `/api/cotizaciones/${id}/convertir-venta`,
    ACEPTAR: (id: number) => `/api/cotizaciones/${id}/aceptar`,
    RECHAZAR: (id: number) => `/api/cotizaciones/${id}/rechazar`,
  },

  // FACTURACIÓN DIAN
  FACTURAS: {
    BASE: '/api/facturas',
    BY_ID: (id: number) => `/api/facturas/${id}`,
    BY_NUMERO: (numero: string) => `/api/facturas/numero/${numero}`,
    BY_VENTA: (ventaId: number) => `/api/facturas/venta/${ventaId}`,
    BY_CLIENTE: (clienteId: number) => `/api/facturas/cliente/${clienteId}`,
    BUSCAR: '/api/facturas/buscar',
    ESTADISTICAS: '/api/facturas/estadisticas',
    POR_ESTADO: (estado: string) => `/api/facturas/por-estado/${estado}`,
    PENDIENTES_ENVIO: '/api/facturas/pendientes-envio',
    ENVIAR_DIAN: (id: number) => `/api/facturas/${id}/enviar-dian`,
    ANULAR: (id: number) => `/api/facturas/${id}/anular`,
    GENERAR_PDF: (id: number) => `/api/facturas/${id}/pdf`,
    GENERAR_XML: (id: number) => `/api/facturas/${id}/xml`,
    VERIFICAR_DIAN: (id: number) => `/api/facturas/${id}/verificar-dian`,
    REENVIAR_EMAIL: (id: number) => `/api/facturas/${id}/reenviar-email`,
  },

  // NOTAS CRÉDITO
  NOTAS_CREDITO: {
    BASE: '/api/notas-credito',
    BY_ID: (id: number) => `/api/notas-credito/${id}`,
    BY_NUMERO: (numero: string) => `/api/notas-credito/numero/${numero}`,
    BY_FACTURA: (facturaId: number) => `/api/notas-credito/factura/${facturaId}`,
    BY_CLIENTE: (clienteId: number) => `/api/notas-credito/cliente/${clienteId}`,
    BUSCAR: '/api/notas-credito/buscar',
    POR_ESTADO: (estado: string) => `/api/notas-credito/por-estado/${estado}`,
    ENVIAR_DIAN: (id: number) => `/api/notas-credito/${id}/enviar-dian`,
    GENERAR_PDF: (id: number) => `/api/notas-credito/${id}/pdf`,
  },

  // NOTAS DÉBITO
  NOTAS_DEBITO: {
    BASE: '/api/notas-debito',
    BY_ID: (id: number) => `/api/notas-debito/${id}`,
    BY_NUMERO: (numero: string) => `/api/notas-debito/numero/${numero}`,
    BY_FACTURA: (facturaId: number) => `/api/notas-debito/factura/${facturaId}`,
    BY_CLIENTE: (clienteId: number) => `/api/notas-debito/cliente/${clienteId}`,
    BUSCAR: '/api/notas-debito/buscar',
    POR_ESTADO: (estado: string) => `/api/notas-debito/por-estado/${estado}`,
    ENVIAR_DIAN: (id: number) => `/api/notas-debito/${id}/enviar-dian`,
    GENERAR_PDF: (id: number) => `/api/notas-debito/${id}/pdf`,
  },
} as const;

// Export para uso en servicios
export default API_ENDPOINTS;