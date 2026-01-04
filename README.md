# FamilyDash 2.0 (FD2.0)

FamilyDash 2.0 es una aplicación familiar construida desde cero con Expo + Firebase.

## Stack

- **Framework**: Expo + TypeScript
- **Routing**: expo-router
- **Backend**: Firebase (Auth, Firestore, Functions, Push)
- **Estado**: Zustand
- **Arquitectura**: UI → store → lib/db → Firestore

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Desplegar Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 4. Ejecutar la aplicación

```bash
npm start
```

## Estructura del Proyecto

```
app/                    # expo-router routing groups
  (auth)/              # Auth screens
  (onboarding)/        # Onboarding screens
  (tabs)/              # Main app tabs
  (admin)/             # Admin screens
src/
  lib/
    firebase/          # Firebase configuration
    db/                # Data access layer (NO direct Firestore access)
    types/             # TypeScript types
    validators/        # Validation functions
    policy/            # Age policy helpers
    auth/              # Auth service
  store/               # Zustand stores
  components/          # Reusable components
```

## Reglas Importantes

1. ❌ **NUNCA** acceder a Firestore directamente desde la UI
2. ✅ **SIEMPRE** usar funciones de `src/lib/db/*`
3. ✅ Todos los documentos incluyen: `familyId`, `createdAt`, `updatedAt`, `createdBy`
4. ✅ Operaciones HIGH-RISK deben pasar por Functions + audit logs
5. ✅ TypeScript estricto (sin `any` implícitos)

## Fases de Desarrollo

### FASE 1 - Foundation ✅ (En progreso)
- [x] Proyecto Expo inicializado
- [x] Firebase configurado
- [x] Estructura de carpetas
- [x] Tipos y modelos de datos
- [x] Capa de datos (lib/db)
- [x] Firestore rules
- [ ] Auth completo (sign-in/sign-up)
- [ ] Crear/unirse a familia
- [ ] Members y roles
- [ ] Age Policy
- [ ] Routing groups funcionales

### FASE 2 - Core Daily Use
- Tasks
- Allowance
- Calendar

### FASE 3 - Pro Modules
- Attention Ring
- SafeRoom
- Votes
- Penalties

### FASE 4 - Hardening
- Functions para operaciones críticas
- Optimizaciones
- Testing

## Licencia

Private

