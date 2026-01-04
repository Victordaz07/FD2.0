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

## Estado Actual del Proyecto

### ✅ FASE 1 - Foundation (COMPLETADA)
- [x] Proyecto Expo inicializado con TypeScript
- [x] Firebase configurado (Auth, Firestore, Functions, Push)
- [x] Estructura de carpetas y arquitectura por capas
- [x] Tipos y modelos de datos completos
- [x] Capa de datos (lib/db) - sin acceso directo a Firestore desde UI
- [x] Firestore rules implementadas (deny-by-default)
- [x] Auth completo (sign-in/sign-up con email/password)
- [x] Crear/unirse a familia con códigos de invitación
- [x] Members y roles (PARENT, CO_PARENT, ADULT_MEMBER, TEEN, CHILD, VIEWER)
- [x] Age Policy helpers implementados
- [x] Routing groups funcionales (auth, onboarding, tabs, admin)
- [x] Stores de estado con Zustand (authStore, familyStore)

### ✅ FASE 1.1 - Hardening (COMPLETADA)
- [x] Firebase Functions para operaciones críticas (HIGH-RISK)
- [x] Sistema de audit logs (append-only, solo Functions puede escribir)
- [x] Guards para rutas admin (solo PARENT/CO_PARENT)
- [x] Validaciones server-side de roles y permisos
- [x] Restricción de lectura de users (solo el propio usuario)
- [x] Verificación de duplicados al unirse a familia
- [x] Callable functions: `changeMemberRole`, `updateFamilyPolicy`

### 🚧 FASE 2 - Core Daily Use (EN PROGRESO)
- [x] **Tasks (Tareas)**
  - [x] Crear/editar/eliminar tareas (PARENT/CO_PARENT)
  - [x] Completar tareas (CHILD/TEEN)
  - [x] Sistema de aprobación de completaciones
  - [x] Historial de completaciones
  - [x] Firebase Function: `approveTaskCompletion`, `rejectTaskCompletion`
  - [x] Validación server-side de `periodKey` para prevenir duplicados
- [x] **Allowance (Mesada)**
  - [x] Ledger de mesada (entradas y salidas)
  - [x] Balance por miembro
  - [x] Integración con tareas (puntos/mesada por completar)
  - [x] Firebase Function: `addAllowanceLedgerEntry`
  - [x] Audit logs para todas las transacciones
- [x] **Calendar (Calendario)**
  - [x] Crear eventos familiares
  - [x] Visibilidad configurable (family, parents_only)
  - [x] Filtrado por Firestore Rules según rol
- [ ] Testing completo de FASE 2
- [ ] Mejoras de UI/UX

### 📋 FASE 3 - Pro Modules (PLANEADO)
- [ ] **Attention Ring**
  - Sistema de notificaciones de atención familiar
  - Estados de atención por miembro
- [ ] **SafeRoom**
  - Espacio seguro para comunicación familiar
  - Mensajes privados y grupales
- [ ] **Votes**
  - Sistema de votación familiar
  - Decisiones democráticas
- [ ] **Penalties**
  - Sistema de penalizaciones
  - Integración con allowance

### 🔧 FASE 4 - Optimización y Testing (PLANEADO)
- [ ] Testing automatizado (unit tests, integration tests)
- [ ] Optimizaciones de rendimiento
- [ ] Mejoras de seguridad adicionales
- [ ] Documentación completa de API
- [ ] CI/CD pipeline
- [ ] Monitoreo y analytics

## Próximos Pasos y Roadmap

### Corto Plazo (Próximas 2-4 semanas)
1. **Completar Testing de FASE 2**
   - Ejecutar checklist completo de pruebas manuales
   - Validar todas las funciones de Firebase Functions
   - Verificar audit logs en producción
   - Corregir bugs encontrados

2. **Mejoras de UI/UX**
   - Mejorar diseño visual de pantallas
   - Agregar loading states más informativos
   - Mejorar manejo de errores con mensajes user-friendly
   - Agregar animaciones y transiciones suaves

3. **Optimizaciones**
   - Optimizar queries de Firestore
   - Implementar paginación donde sea necesario
   - Mejorar rendimiento de stores

### Mediano Plazo (1-3 meses)
1. **FASE 3 - Pro Modules**
   - Implementar Attention Ring (prioridad alta)
   - Desarrollar SafeRoom para comunicación
   - Sistema de votaciones familiares
   - Sistema de penalizaciones

2. **Features Adicionales**
   - Notificaciones push completas
   - Reportes y estadísticas familiares
   - Exportación de datos
   - Modo oscuro

### Largo Plazo (3-6 meses)
1. **FASE 4 - Hardening**
   - Testing automatizado completo
   - CI/CD pipeline
   - Monitoreo y analytics
   - Optimizaciones avanzadas

2. **Expansión**
   - Soporte multi-idioma
   - Temas personalizables
   - Integraciones con servicios externos
   - Versión web (PWA)

## Características Implementadas

### Autenticación y Gestión de Familia
- ✅ Registro e inicio de sesión con email/password
- ✅ Crear familia con código único
- ✅ Unirse a familia existente por código
- ✅ Gestión de miembros con roles
- ✅ Sistema de roles jerárquico (PARENT → CO_PARENT → ADULT_MEMBER → TEEN → CHILD → VIEWER)
- ✅ Age Policy automática para asignación de roles

### Tareas (Tasks)
- ✅ Crear, editar y eliminar tareas (solo PARENT/CO_PARENT)
- ✅ Completar tareas (CHILD/TEEN)
- ✅ Sistema de aprobación de completaciones
- ✅ Historial completo de completaciones
- ✅ Asignación de puntos o mesada por tarea
- ✅ Validación server-side para prevenir duplicados

### Mesada (Allowance)
- ✅ Ledger completo de transacciones
- ✅ Balance por miembro
- ✅ Integración automática con tareas completadas
- ✅ Entradas manuales (solo PARENT/CO_PARENT)
- ✅ Historial completo con audit logs

### Calendario
- ✅ Crear eventos familiares
- ✅ Visibilidad configurable (family, parents_only)
- ✅ Filtrado automático por rol mediante Firestore Rules

### Seguridad y Auditoría
- ✅ Firestore Rules deny-by-default
- ✅ Firebase Functions para operaciones críticas
- ✅ Sistema de audit logs (append-only)
- ✅ Validaciones server-side de permisos
- ✅ Guards de rutas en cliente

## Documentación Adicional

- `STATUS.md` - Estado detallado del proyecto
- `FASE1.1_IMPLEMENTATION_SUMMARY.md` - Resumen de implementación de hardening
- `QUALITY_REVIEW_FASE2.md` - Revisión de calidad de FASE 2
- `TESTING_CHECKLIST_FASE1.1.md` - Checklist de pruebas FASE 1.1
- `TESTING_CHECKLIST_FASE2.md` - Checklist de pruebas FASE 2
- `AUDIT_REPORT_FASE1.md` - Reporte de auditoría inicial

## Licencia

Private

