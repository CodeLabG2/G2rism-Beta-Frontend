# Corrección de Endpoints de Autenticación - Frontend/Backend

**Fecha:** 2025-12-17
**Estado:** ✅ Completado y listo para probar

---

## 🔍 Problema Detectado

El frontend estaba enviando datos en formato incorrecto a los endpoints de autenticación del backend:

### ❌ Login (ANTES)
```typescript
// Frontend enviaba:
{ email: "user@example.com", password: "pass123" }

// Backend esperaba:
{ UsernameOrEmail: "user@example.com", Password: "pass123" }
```

**Error recibido:** `400 Bad Request - errors: {UsernameOrEmail: Array(2)}`

### ❌ Register (ANTES)
```typescript
// Frontend enviaba:
{ nombre: "Juan", email: "juan@example.com", password: "pass123", telefono: "", documento: "" }

// Backend esperaba:
{
  Username: "juan",
  Email: "juan@example.com",
  Password: "pass123",
  ConfirmPassword: "pass123",
  Nombre: "Juan",
  Apellido: "",
  TipoUsuario: "cliente",
  AceptaTerminos: true
}
```

**Error recibido:** `400 Bad Request - errors: {Username: Array(3), AceptaTerminos: Array(1), ConfirmPassword: Array(2)}`

---

## ✅ Solución Implementada

### 1. Actualización de Tipos TypeScript

**Archivo:** `src/services/api/types.ts`

Se actualizaron las interfaces para que coincidan exactamente con los DTOs del backend:

```typescript
// 🔄 LoginRequest - Coincide con LoginRequestDto del backend
export interface LoginRequest {
  usernameOrEmail: string; // Backend espera "UsernameOrEmail"
  password: string;        // Backend espera "Password"
  rememberMe?: boolean;
}

// 🔄 RegisterRequest - Coincide con RegisterRequestDto del backend
export interface RegisterRequest {
  username: string;         // Backend espera "Username" (obligatorio)
  email: string;            // Backend espera "Email" (obligatorio)
  password: string;         // Backend espera "Password" (obligatorio)
  confirmPassword: string;  // Backend espera "ConfirmPassword" (obligatorio)
  nombre?: string;          // Backend espera "Nombre" (opcional)
  apellido?: string;        // Backend espera "Apellido" (opcional)
  tipoUsuario?: string;     // Backend espera "TipoUsuario" (default: "cliente")
  aceptaTerminos: boolean;  // Backend espera "AceptaTerminos" (obligatorio: true)
}

// 🔄 LoginResponse - Coincide con LoginResponseDto del backend
export interface LoginResponse {
  token: string;
  refreshToken: string;
  usuario: UsuarioLoginDto; // Backend retorna "Usuario" (no "user")
  expiresIn: number;
  tokenExpiration?: string;
  tokenExpirationLocal?: string;
  timeZone?: string;
}

// 🔄 UsuarioLoginDto - Parte de LoginResponse
export interface UsuarioLoginDto {
  idUsuario: number;
  username: string;
  email: string;
  tipoUsuario: string;
  roles: string[];
  permisos: string[];
}
```

---

### 2. Actualización del AuthService

**Archivo:** `src/services/api/authService.ts`

#### Función de Adaptación de Roles

Se agregó una función para convertir los 4 roles del backend a los 3 del frontend:

```typescript
/**
 * 🔄 Convierte UsuarioLoginDto del backend a AuthUser para el frontend
 *
 * Roles del backend:
 * - Super Administrador (nivel 1) → Admin
 * - Administrador (nivel 2) → Admin
 * - Empleado (nivel 10) → Employee
 * - Cliente (nivel 50) → Client
 */
private adaptUsuarioToAuthUser(usuario: UsuarioLoginDto): AuthUser {
  let role: 'Admin' | 'Employee' | 'Client' = 'Client';
  const tipoUsuario = usuario.tipoUsuario.toLowerCase();

  if (tipoUsuario === 'superadmin' || tipoUsuario === 'super administrador') {
    role = 'Admin';
  } else if (tipoUsuario === 'admin' || tipoUsuario === 'administrador') {
    role = 'Admin';
  } else if (tipoUsuario === 'empleado' || tipoUsuario === 'employee') {
    role = 'Employee';
  } else {
    role = 'Client';
  }

  return {
    id: usuario.idUsuario.toString(),
    name: usuario.username,
    email: usuario.email,
    role: role,
    createdAt: new Date().toISOString(),
  };
}
```

#### Método Login Actualizado

```typescript
async login(credentials: { email: string; password: string }) {
  // 🔄 Adaptar datos al formato LoginRequestDto
  const loginRequest: LoginRequest = {
    usernameOrEmail: credentials.email,
    password: credentials.password,
    rememberMe: false,
  };

  const response = await api.post<ApiResponse<LoginResponse>>(
    '/api/auth/login',
    loginRequest
  );

  const loginData = response.data.data;

  // 🔄 Adaptar UsuarioLoginDto a AuthUser
  const authUser = this.adaptUsuarioToAuthUser(loginData.usuario);

  // Guardar en localStorage
  this.setToken(loginData.token);
  this.setRefreshToken(loginData.refreshToken);
  this.setUser(authUser);

  return { token: loginData.token, refreshToken: loginData.refreshToken, user: authUser };
}
```

#### Método Register Actualizado

```typescript
async register(data: {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono?: string;
  documento?: string;
  username: string;
  acceptTerms: boolean;
}) {
  // 🔄 Adaptar datos al formato RegisterRequestDto
  const registerRequest: RegisterRequest = {
    username: data.username,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    nombre: data.nombre,
    apellido: '',
    tipoUsuario: 'cliente', // Por defecto siempre es cliente
    aceptaTerminos: data.acceptTerms,
  };

  const response = await api.post<ApiResponse<LoginResponse>>(
    '/api/auth/register',
    registerRequest
  );

  const loginData = response.data.data;

  // 🔄 Adaptar UsuarioLoginDto a AuthUser
  const authUser = this.adaptUsuarioToAuthUser(loginData.usuario);

  // Guardar en localStorage
  this.setToken(loginData.token);
  this.setRefreshToken(loginData.refreshToken);
  this.setUser(authUser);

  return { token: loginData.token, refreshToken: loginData.refreshToken, user: authUser };
}
```

---

### 3. Actualización de App.tsx

**Archivo:** `src/App.tsx`

#### Handler de Registro Actualizado

```typescript
const handleRegister = async (data: any) => {
  try {
    setIsLoading(true);
    console.log('📝 Registrando nuevo cliente con API real:', data);

    // 🔄 Generar username a partir del email (antes del @)
    const username = data.email.split('@')[0];

    // Llamar a la API con los datos correctos
    const registerResponse = await authService.register({
      username: username,           // Backend requiere username (generado del email)
      nombre: data.name,            // Backend espera "nombre"
      email: data.email,            // Backend espera "email"
      password: data.password,      // Backend espera "password"
      confirmPassword: data.confirmPassword, // Backend espera "confirmPassword"
      telefono: data.phone || '',   // Backend espera "telefono" (opcional)
      documento: data.document || '', // Backend espera "documento" (opcional)
      acceptTerms: data.acceptTerms, // Backend espera "aceptaTerminos"
    });

    console.log('✅ Registro exitoso:', registerResponse);

    // Guardar usuario actual
    setCurrentUser(registerResponse.user);

    // Cliente registrado va al portal de cliente
    toast.success('¡Cuenta creada exitosamente!');
    setAppView('client');
    setWelcomePortalType('client');
    setShowWelcome(true);
  } catch (error: any) {
    console.error('❌ Error en registro:', error);

    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.errors?.[0] ||
                        'Error al crear la cuenta. Por favor intenta de nuevo.';

    toast.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📊 Mapeo de Campos

### Login

| Frontend Input | Frontend Service | Backend DTO |
|----------------|------------------|-------------|
| `email` | `usernameOrEmail` | `UsernameOrEmail` |
| `password` | `password` | `Password` |
| - | `rememberMe` (false) | `RememberMe` |

### Register

| Frontend Input | Frontend Service | Backend DTO |
|----------------|------------------|-------------|
| `email.split('@')[0]` | `username` | `Username` |
| `name` | `nombre` | `Nombre` |
| `email` | `email` | `Email` |
| `password` | `password` | `Password` |
| `confirmPassword` | `confirmPassword` | `ConfirmPassword` |
| `phone` | - | - |
| `document` | - | - |
| `acceptTerms` | `aceptaTerminos` | `AceptaTerminos` |
| - | `apellido` ('') | `Apellido` |
| - | `tipoUsuario` ('cliente') | `TipoUsuario` |

---

## 🧪 Verificación de Build

```bash
npm run build
```

**Resultado:** ✅ Build exitoso sin errores TypeScript

```
✓ 3624 modules transformed.
✓ built in 8.73s
```

---

## 📋 Checklist de Pruebas

### Login
- [ ] Probar login con email válido
- [ ] Verificar que el token JWT se guarde en localStorage
- [ ] Confirmar que el usuario se redirija al portal correcto según su rol:
  - Super Admin → SuperAdminPortal
  - Administrador → SuperAdminPortal
  - Empleado → AdminPortal
  - Cliente → ClientPortal

### Register
- [ ] Probar registro con datos válidos
- [ ] Verificar que se cree el usuario en la base de datos con rol "Cliente"
- [ ] Confirmar auto-login después del registro
- [ ] Verificar que el token JWT se guarde en localStorage
- [ ] Confirmar que el usuario se redirija al ClientPortal

### Validaciones a Probar
- [ ] Login con credenciales incorrectas (debe mostrar error 401)
- [ ] Register con email duplicado (debe mostrar error 400)
- [ ] Register sin aceptar términos (debe mostrar error 400)
- [ ] Register con contraseñas que no coinciden (validación frontend)

---

## 🚀 Próximos Pasos

1. **Reiniciar el frontend:**
   ```bash
   cd "C:\Dev 💻\CodeLabG2\Beta Projects\1st Project\App\Frontend\G2rism"
   npm run dev
   ```

2. **Verificar que el backend esté corriendo:**
   ```bash
   cd "C:\Dev 💻\CodeLabG2\Beta Projects\1st Project\App\API\G2rismBeta.API"
   dotnet run
   ```

3. **Probar el flujo de autenticación:**
   - Login: http://localhost:3000 → Click en "Iniciar Sesión"
   - Register: http://localhost:3000 → Click en "Registrarse"

---

## 📝 Notas Técnicas

### Generación de Username
El frontend genera el username automáticamente a partir del email:
```typescript
const username = data.email.split('@')[0];
// Ejemplo: "juan@example.com" → "juan"
```

### Mapeo de Roles Backend → Frontend
```
Backend (4 roles)          Frontend (3 roles)
------------------         ------------------
Super Administrador   →    Admin
Administrador         →    Admin
Empleado              →    Employee
Cliente               →    Client
```

### Estructura de Respuesta
El backend retorna `LoginResponseDto` con el objeto `Usuario` que contiene:
- `idUsuario`, `username`, `email`, `tipoUsuario`, `roles[]`, `permisos[]`

El frontend adapta esto a `AuthUser` para uso interno:
- `id`, `name`, `email`, `role`, `createdAt`

---

**Generado por:** Claude Sonnet 4.5
**Herramienta:** Claude Code
