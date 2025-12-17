# Corrección de Bugs de Autenticación - Sesión de Debugging

**Fecha:** 2025-12-17
**Estado:** ✅ Completado - Listo para probar

---

## 🐛 Problemas Detectados y Corregidos

### 1. ❌ Login - Mapeo Incorrecto de Roles

**Problema:**
- El backend retorna `tipoUsuario: "empleado"` y `roles: ["Super Administrador"]`
- El frontend mapeaba por `tipoUsuario` en lugar de `roles[]`
- Resultado: Super Admin se mapeaba como `Employee` en lugar de `Admin`
- Usuario con rol "Super Administrador" iba a AdminPortal en lugar de SuperAdminPortal

**Solución Aplicada:**

Archivo: `src/services/api/authService.ts` líneas 22-53

```typescript
private adaptUsuarioToAuthUser(usuario: UsuarioLoginDto): AuthUser {
  let role: 'Admin' | 'Employee' | 'Client' = 'Client';

  // ✅ AHORA MAPEA POR roles[], NO por tipoUsuario
  if (usuario.roles && usuario.roles.length > 0) {
    const primeraRol = usuario.roles[0].toLowerCase();

    if (primeraRol.includes('super') || primeraRol === 'super administrador') {
      role = 'Admin'; // Super Administrador → Admin en frontend
    } else if (primeraRol === 'administrador' || primeraRol === 'admin') {
      role = 'Admin'; // Administrador → Admin en frontend
    } else if (primeraRol === 'empleado' || primeraRol === 'employee') {
      role = 'Employee'; // Empleado → Employee en frontend
    } else {
      role = 'Client'; // Cliente → Client en frontend
    }
  }

  return { id, name, email, role, createdAt };
}
```

**Resultado:**
- ✅ Super Admin ahora va a SuperAdminPortal
- ✅ Administrador va a SuperAdminPortal
- ✅ Empleado va a AdminPortal
- ✅ Cliente va a ClientPortal

---

### 2. ❌ Register - Response Incorrecto

**Problema:**
- El backend retorna `RegisterResponseDto` (sin tokens JWT)
- El frontend esperaba `LoginResponseDto` (con tokens JWT)
- Error: `Cannot read properties of undefined (reading 'tipoUsuario')`
- No se hacía auto-login después del registro

**Solución Aplicada:**

**Archivo:** `src/services/api/types.ts` líneas 67-76

```typescript
// ✅ Nuevo tipo para la respuesta de registro
export interface RegisterResponseDto {
  idUsuario: number;
  username: string;
  email: string;
  tipoUsuario: string;
  fechaRegistro: string;
  roles: string[];
  mensaje: string;
}
```

**Archivo:** `src/services/api/authService.ts` líneas 101-150

```typescript
async register(data: {...}): Promise<{ user: {...} }> {
  // 1. Registrar usuario (retorna RegisterResponseDto)
  const response = await api.post<ApiResponse<RegisterResponseDto>>(
    '/api/auth/register',
    registerRequest
  );

  const registerData = response.data.data;

  console.log('✅ Usuario registrado, ahora haciendo auto-login...');

  // 2. ✅ Auto-login después del registro exitoso
  await this.login({
    email: data.email,
    password: data.password,
  });

  return { user: { id, email, username } };
}
```

**Resultado:**
- ✅ Usuario se registra correctamente en la base de datos
- ✅ Auto-login funciona después del registro
- ✅ Token JWT se guarda en localStorage
- ✅ Usuario redirige al ClientPortal

---

### 3. ❌ Register - Campo Username No Editable

**Problema:**
- El formulario de registro generaba el username automáticamente desde el email
- Ejemplo: `marthaluzduquemarin@gmail.com` → `marthaluzduquemarin` (username)
- El nombre completo "Martha Luz Duque" terminaba guardándose como username

**Solución Aplicada:**

**Archivo:** `src/components/auth/RegisterForm.tsx` líneas 14-22, 92-101

```typescript
// ✅ Agregado campo username al estado
const [formData, setFormData] = useState({
  username: '',  // ← NUEVO
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
});

// ✅ Agregado campo de input para username
<Input
  type="text"
  label="Nombre de usuario"
  placeholder="juanperez"
  icon={<User size={18} />}
  value={formData.username}
  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
  required
  helperText="Solo letras, números y guiones bajos. Ej: juan_perez"
/>
```

**Archivo:** `src/App.tsx` líneas 147-148

```typescript
// ✅ Ya NO se genera automáticamente
await authService.register({
  username: data.username,  // ← Viene del formulario
  nombre: data.name,
  email: data.email,
  ...
});
```

**Resultado:**
- ✅ Usuario puede elegir su propio username
- ✅ Username se valida en el backend (3-50 caracteres, solo letras/números/guiones bajos)

---

### 4. ❌ Logout - Request Incorrecto

**Problema:**
- Backend espera `[FromBody] int idUsuario`
- Frontend enviaba `undefined` en el body
- Error: `415 Unsupported Media Type`
- La sesión no se cerraba en el backend

**Solución Aplicada:**

**Archivo:** `src/services/api/authService.ts` líneas 156-171

```typescript
async logout(): Promise<void> {
  try {
    // ✅ Obtener el usuario actual para enviar su ID
    const user = this.getUser();

    if (user && user.id) {
      // ✅ Enviar idUsuario como número en el body
      await api.post('/api/auth/logout', parseInt(user.id));
    }
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    // Limpiar localStorage siempre
    this.clearAuth();
  }
}
```

**Resultado:**
- ✅ Logout envía el idUsuario correctamente
- ✅ Backend cierra la sesión del usuario
- ✅ localStorage se limpia en el frontend

---

### 5. ❌ Requests Protegidos - 401 Unauthorized

**Problema:**
- `/api/roles` y `/api/usuarios` retornaban 401 Unauthorized
- El token JWT NO se estaba enviando en los headers
- Las peticiones fallaban aunque el usuario estuviera autenticado

**Diagnóstico:**

Verificación en `src/services/api/axiosConfig.ts` líneas 16-40:

```typescript
// ✅ El interceptor YA ESTÁ CONFIGURADO CORRECTAMENTE
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('g2rism_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // ✅ Correcto
    }

    return config;
  }
);
```

**Conclusión:**
- ✅ El frontend envía el token correctamente
- ⚠️ El problema del 401 puede ser:
  1. El token expiró (tiempo de expiración del JWT)
  2. El backend requiere políticas específicas que el usuario no tiene
  3. El backend no está validando correctamente el token

**Próximo paso:** Probar con un token válido y verificar los logs del backend.

---

## 📋 Resumen de Cambios

### Archivos Modificados:

1. ✅ `src/services/api/types.ts`
   - Agregado `RegisterResponseDto`
   - Actualizado comentarios en `LoginResponse` y `UsuarioLoginDto`

2. ✅ `src/services/api/authService.ts`
   - Corregido `adaptUsuarioToAuthUser()` para mapear por `roles[]`
   - Corregido `register()` para hacer auto-login
   - Corregido `logout()` para enviar `idUsuario`

3. ✅ `src/components/auth/RegisterForm.tsx`
   - Agregado campo `username` editable
   - Agregado validación y helperText

4. ✅ `src/App.tsx`
   - Eliminada generación automática de username
   - Actualizado `handleRegister()` para usar username del formulario

---

## ✅ Build Exitoso

```bash
npm run build
```

**Resultado:**
```
✓ 3624 modules transformed
✓ built in 7.84s
```

---

## 🧪 Checklist de Pruebas - RESULTADOS

### ✅ Login - EXITOSO
- [x] Login con Super Administrador → va a SuperAdminPortal ✅
- [x] Login con Administrador → va a SuperAdminPortal ✅
- [x] Login con Empleado → va a AdminPortal ✅
- [x] Login con Cliente → va a ClientPortal ✅
- [x] Token JWT se guarda en localStorage ✅
- [x] Mapeo de roles por `roles[]` funciona correctamente ✅
- [x] Usuario `Samu` con rol "Super Administrador" ahora va al SuperAdminPortal ✅

### ✅ Register - EXITOSO
- [x] Campo username es editable en el formulario ✅
- [x] Usuario se registra correctamente en la base de datos ✅
- [x] Auto-login funciona después del registro ✅
- [x] Usuario va al ClientPortal ✅
- [x] Token JWT se guarda en localStorage después del auto-login ✅
- [x] Username personalizado (no generado automáticamente) ✅

### ✅ Logout - EXITOSO
- [x] Logout envía idUsuario correctamente en el body ✅
- [x] localStorage se limpia correctamente ✅
- [x] Usuario redirige a landing page ✅
- [x] Ya NO hay error 415 Unsupported Media Type ✅

---

## ❌ PROBLEMA PENDIENTE - 401 Unauthorized en Endpoints Protegidos

### Descripción del Problema:
Después de hacer login exitoso con el Super Administrador, al intentar acceder a los siguientes endpoints, todos retornan **401 Unauthorized**:

- ❌ `/api/roles` → 401
- ❌ `/api/usuarios` → 401
- ❌ `/api/reservas` → 401
- ❌ `/api/clientes` → 401
- ❌ `/api/paquetes` → 401
- ❌ `/api/empleados` → 401
- ❌ `/api/proveedores` → 401
- ❌ `/api/facturas` → 401

### Datos del Usuario de Prueba:
```json
{
  "idUsuario": 10,
  "username": "Samu",
  "email": "samuvv2905@gmail.com",
  "tipoUsuario": "empleado",
  "roles": ["Super Administrador"],
  "permisos": [
    "roles.crear", "roles.leer", "roles.actualizar", "roles.eliminar",
    "permisos.crear", "permisos.leer", "permisos.actualizar", "permisos.eliminar",
    "reservas.crear", "reservas.leer", "reservas.actualizar", "reservas.eliminar",
    "hoteles.crear", "hoteles.leer", "hoteles.actualizar", "hoteles.eliminar",
    "servicios.crear", "servicios.leer", "servicios.actualizar", "servicios.eliminar",
    "paquetes.crear", "paquetes.leer", "paquetes.actualizar", "paquetes.eliminar",
    "formasdepago.crear", "formasdepago.leer", "formasdepago.actualizar", "formasdepago.eliminar",
    "facturas.crear", "facturas.leer", "facturas.actualizar", "facturas.eliminar",
    "pagos.crear", "pagos.leer", "pagos.actualizar", "pagos.eliminar"
    // Total: 36 permisos
  ]
}
```

### Token JWT Verificado:
- ✅ Token se guarda correctamente en localStorage (`g2rism_token`)
- ✅ Token se envía en headers: `Authorization: Bearer <token>`
- ✅ Interceptor de axios configurado correctamente (líneas 16-40 de axiosConfig.ts)
- ⚠️ El problema NO es del frontend, el token se está enviando

### Posibles Causas (Backend):

1. **Políticas de Autorización en Program.cs:**
   - Verificar que las políticas permitan el rol "Super Administrador"
   - Verificar que los endpoints tengan `[Authorize(Policy = "...")]` correctamente configurado

2. **Validación del Token JWT:**
   - Verificar que el backend esté validando correctamente el token
   - Verificar que la clave secreta (IssuerSigningKey) sea la correcta
   - Verificar que el Issuer y Audience coincidan

3. **Claims del Token:**
   - Verificar que el token contenga los claims necesarios
   - Verificar que el backend esté leyendo correctamente los roles y permisos del token

### Logs de Prueba:
```
GET http://localhost:5026/api/roles 401 (Unauthorized)
Error loading roles: code: "ERR_BAD_REQUEST", message: "Request failed with status code 401"

GET http://localhost:5026/api/usuarios?incluirInactivos=true 401 (Unauthorized)
Error loading users: code: "ERR_BAD_REQUEST", message: "Request failed with status code 401"
```

### Próximos Pasos para la Siguiente Sesión:

1. **Revisar Program.cs del backend:**
   - Configuración de políticas de autorización
   - Configuración de JWT Authentication
   - Mapeo de claims a roles y permisos

2. **Revisar Controllers:**
   - Atributos `[Authorize]` en los controllers
   - Verificar que las políticas coincidan con las configuradas

3. **Debugging en el Backend:**
   - Agregar logs para ver si el token llega correctamente
   - Verificar que el middleware de autenticación esté procesando el token
   - Ver por qué el backend rechaza el token con 401

---

## 🚀 Próximos Pasos

1. **Reiniciar el dev server:**
   ```bash
   cd "C:\Dev 💻\CodeLabG2\Beta Projects\1st Project\App\Frontend\G2rism"
   npm run dev
   ```

2. **Probar los flujos corregidos**

3. **Si persisten los 401:**
   - Verificar que el token no haya expirado
   - Revisar las políticas de autorización en el backend (Program.cs)
   - Verificar que el usuario tenga los permisos necesarios

---

## 📝 Notas Importantes

### Mapeo de Roles Backend → Frontend

```
Backend (Campo: roles[])    Frontend (role)
------------------------    ---------------
"Super Administrador"   →   Admin
"Administrador"         →   Admin
"Empleado"              →   Employee
"Cliente"               →   Client
```

### Enrutamiento en App.tsx

```typescript
// App.tsx líneas 108-124
const userRole = loginResponse.user.role.toLowerCase();

if (userRole === 'admin') {
  setAppView('superadmin');  // Super Admin y Admin → SuperAdminPortal
} else if (userRole === 'employee') {
  setAppView('admin');       // Empleado → AdminPortal
} else {
  setAppView('client');      // Cliente → ClientPortal
}
```

---

**Generado por:** Claude Sonnet 4.5
**Herramienta:** Claude Code - Debugging Session
