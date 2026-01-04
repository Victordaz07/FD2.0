# Reporte de Auditoría Técnica - FASE 1 (Foundation)
**Proyecto:** FD2.0 (Expo + Firebase)  
**Fecha:** 2024  
**Auditor:** Análisis técnico automatizado

---

## 1. Arquitectura (UI no accede Firestore directamente)

### ✅ CUMPLE

**Evidencia:**
- Búsqueda de patrones `getDoc/setDoc/updateDoc/collection/doc` en `app/`: **0 resultados**
- Acceso a Firestore solo encontrado en:
  - `src/lib/db/families.ts` (líneas 7-16, 33, 56-62, 96, 118-122)
  - `src/lib/db/users.ts` (líneas 7-11, 23, 49, 66, 80)
  - `src/lib/db/members.ts` (líneas 7-16, 31, 71, 122, 151)
  - `src/lib/firebase/config.ts` (solo exportación, línea 39)

**Conclusión:** La arquitectura cumple con el principio de separación. La UI solo accede a Firestore a través de `src/lib/db/*`.

**Paths exactos verificados:**
- ✅ `app/index.tsx` - usa `getUser()` de `@/lib/db/users`
- ✅ `app/(onboarding)/create-family.tsx` - usa `createFamily()`, `addMember()`, `updateUserActiveFamily()` de `@/lib/db/*`
- ✅ `app/(onboarding)/join-family.tsx` - usa `getFamilyByInviteCode()`, `addMember()`, `updateUserActiveFamily()` de `@/lib/db/*`
- ✅ `app/(tabs)/index.tsx` - usa `getFamily()`, `getFamilyMembers()` de `@/lib/db/*`
- ✅ `app/(admin)/members.tsx` - usa `getFamilyMembers()` de `@/lib/db/members`

---

## 2. Firestore Rules

### ✅ CUMPLE PARCIALMENTE (con observaciones)

#### 2.1 Deny-by-default real

**✅ CUMPLE**

**Evidencia:**
- No se encontraron reglas con `allow *: if true` (búsqueda realizada)
- Cada colección tiene reglas explícitas
- `audit_logs` tiene `allow write: if false` (denegación explícita para clientes)

**Archivo:** `firestore.rules` (línea 136)

#### 2.2 Reglas demasiado permisivas

**⚠️ OBSERVACIÓN MENOR**

**Problema identificado:**
- **`users` collection (línea 60):** `allow read: if signedIn()` permite a cualquier usuario autenticado leer cualquier perfil de usuario.

**Impacto:** Preocupación de privacidad. Un usuario autenticado podría leer información de otros usuarios (aunque limitado a email/displayName según el código).

**Recomendación:** Considerar restringir lectura a:
- El propio usuario
- Miembros de la misma familia
- O eliminarlo si no es necesario para la FASE 1

**Ubicación:** `firestore.rules:60`

#### 2.3 Membership checks por familyId

**✅ CUMPLE**

**Evidencia:**
- Función `isMember(familyId)` definida (líneas 26-29)
- Usada en todas las reglas de `families/{familyId}/**`:
  - `families/{familyId}` read (línea 76)
  - `families/{familyId}/members/{memberId}` read/create/update/delete (líneas 90, 93-94, 98, 101)
  - `families/{familyId}/attention_requests/{requestId}` read/create/update/delete (líneas 110, 113, 117, 121)

**Archivo:** `firestore.rules:26-29, 76, 90, 93-94, 98, 101, 110, 113, 117, 121`

#### 2.4 audit_logs append-only (no update/delete)

**✅ CUMPLE**

**Evidencia:**
- `match /audit_logs/{logId}` (línea 129)
- `allow read: if signedIn() && isMember(resource.data.familyId)` (líneas 131-132)
- `allow write: if false` (línea 136) - denegación explícita

**Conclusión:** Los clientes no pueden escribir audit_logs. Solo Firebase Functions debería escribir (aunque no hay implementación de Functions aún - ver bloqueadores).

**Archivo:** `firestore.rules:129-137`

---

## 3. Multi-tenant y Metadata

### ⚠️ CUMPLE PARCIALMENTE (con excepciones justificadas)

#### Campos requeridos: `familyId`, `createdAt`, `updatedAt`, `createdBy`

**Análisis por colección:**

##### 3.1 `families` collection

**✅ CUMPLE** (con excepción lógica)

**Evidencia:**
- `createdAt`: ✅ `firestore.rules:102` (`serverTimestamp()`)
- `updatedAt`: ✅ `firestore.rules:103` (`serverTimestamp()`)
- `createdBy`: ✅ `firestore.rules:104`
- `familyId`: ❌ N/A (el documento ES el familyId, no necesita campo)

**Archivo:** `src/lib/db/families.ts:98-105`

##### 3.2 `families/{familyId}/members` subcollection

**✅ CUMPLE**

**Evidencia:**
- `familyId`: ✅ Implícito en path, también incluido en datos (línea 41, 78)
- `createdAt`: ✅ `src/lib/db/members.ts:128` (`serverTimestamp()`)
- `updatedAt`: ✅ `src/lib/db/members.ts:129` (`serverTimestamp()`)
- `createdBy`: ✅ `src/lib/db/members.ts:130`

**Archivo:** `src/lib/db/members.ts:106-131`

##### 3.3 `users` collection

**⚠️ NO CUMPLE** (pero justificado - usuarios son globales, no multi-tenant)

**Evidencia:**
- `createdAt`: ✅ `src/lib/db/users.ts:54` (`serverTimestamp()`)
- `updatedAt`: ✅ `src/lib/db/users.ts:55` (`serverTimestamp()`)
- `createdBy`: ❌ No existe (los usuarios se crean a sí mismos)
- `familyId`: ❌ No aplica (usuarios son globales, `activeFamilyId` es relación, no metadata)

**Justificación:** La colección `users` es global, no multi-tenant. Cada usuario es único y no pertenece a una familia específica (tiene `activeFamilyId` como relación).

**Archivo:** `src/lib/db/users.ts:44-57`

##### 3.4 `audit_logs` collection

**✅ CUMPLE** (estructura diferente - append-only)

**Evidencia (según tipos):**
- `familyId`: ✅ `src/lib/types/index.ts:85`
- `timestamp`: ✅ `src/lib/types/index.ts:90` (equivalente a createdAt)
- `createdBy` (como `actorUid`): ✅ `src/lib/types/index.ts:87`
- `updatedAt`: ❌ N/A (append-only, inmutable)

**Justificación:** `audit_logs` es inmutable, no necesita `updatedAt`.

**Archivo:** `src/lib/types/index.ts:83-91`

#### Colecciones que no cumplen (pero justificadas):

1. **`users`** - No tiene `createdBy` ni `familyId` (justificado: usuarios globales)
2. **`audit_logs`** - No tiene `updatedAt` (justificado: inmutable)

---

## 4. Auth + Routing Groups

### ✅ CUMPLE

#### 4.1 Flujo de routing

**Flujo confirmado:** `(auth)` → `(onboarding)` → `(tabs)` / `(admin)`

**Evidencia:**

1. **Root layout:** `app/_layout.tsx`
   - Define grupos: `(auth)`, `(onboarding)`, `(tabs)`, `(admin)` (líneas 8-11)

2. **Guard principal:** `app/index.tsx`
   - Línea 36-37: Muestra loading mientras verifica auth
   - Línea 41-42: Si `!user` → redirige a `/(auth)/login`
   - Línea 46-47: Si `!user.activeFamilyId` → redirige a `/(onboarding)/create-family`
   - Línea 51: Si autenticado y con familia → redirige a `/(tabs)`

3. **Auth group:** `app/(auth)/_layout.tsx`
   - Define: `login`, `register` (líneas 6-7)

4. **Onboarding group:** `app/(onboarding)/_layout.tsx`
   - Define: `create-family`, `join-family` (líneas 6-7)

5. **Tabs group:** `app/(tabs)/_layout.tsx`
   - Define: `index` (línea 6)

6. **Admin group:** `app/(admin)/_layout.tsx`
   - Define: `members`, `settings` (líneas 6-7)

**Archivos:**
- Guard principal: `app/index.tsx:11-52`
- Auth listener: `app/index.tsx:14-33` (usa `onAuthChange` de `@/lib/auth/authService`)
- Store: `src/store/authStore.ts`

#### 4.2 Guards y decisiones de routing

**Guards identificados:**

1. **`app/index.tsx`** (guard principal)
   - Verifica: `user` (auth state)
   - Verifica: `user.activeFamilyId` (familia activa)
   - Decisiones:
     - `!user` → `/(auth)/login`
     - `!user.activeFamilyId` → `/(onboarding)/create-family`
     - `user && user.activeFamilyId` → `/(tabs)`

**⚠️ OBSERVACIÓN:** No hay guards específicos para `(admin)` group. Cualquier usuario autenticado con familia puede acceder a `/(admin)/members` y `/(admin)/settings`.

**Recomendación:** Agregar guard en `(admin)/_layout.tsx` o en las pantallas individuales para verificar rol PARENT/CO_PARENT.

---

## 5. Roles + Age Policy + Transiciones

### ⚠️ CUMPLE PARCIALMENTE (faltan validaciones en UI/capa de aplicación)

#### 5.1 Roles definidos

**✅ CUMPLE**

**Evidencia:**
- Roles definidos en tipos: `src/lib/types/index.ts:5`
  - `PARENT`, `CO_PARENT`, `ADULT_MEMBER`, `TEEN`, `CHILD`, `VIEWER`

#### 5.2 Solo PARENT/CO_PARENT pueden cambiar roles/policy

**✅ CUMPLE en Firestore Rules**  
**❌ NO VALIDADO en capa de aplicación**

**Evidencia en Rules:**

1. **Policy changes (families):**
   - `allow update: if isParentOnly(familyId)` (línea 79)
   - ✅ Solo PARENT puede actualizar familia (incluye `familyPolicy`)

2. **Role changes (members):**
   - `allow update: if isOwner(memberId) || isParent(familyId)` (línea 98)
   - ✅ PARENT y CO_PARENT pueden actualizar miembros (incluye `role`)

**Evidencia en código de aplicación:**

1. **Función helper:** `src/lib/policy/agePolicy.ts:61-74`
   - `canManageRole(managerRole, targetRole)` - verifica que solo PARENT/CO_PARENT pueden gestionar roles
   - **⚠️ NO SE USA** en `updateMemberRole()`

2. **Función de actualización:** `src/lib/db/members.ts:138-164`
   - `updateMemberRole()` - **NO valida** quién puede llamarla
   - Solo Firestore Rules la protege (pero la UI podría llamarla sin verificación previa)

3. **Función de policy:** `src/lib/db/families.ts:114-123`
   - `updateFamilyPolicy()` - **NO valida** quién puede llamarla
   - Solo Firestore Rules la protege

**Archivos:**
- Rules: `firestore.rules:79, 98`
- Helper (no usado): `src/lib/policy/agePolicy.ts:61-74`
- Implementación: `src/lib/db/members.ts:138-164`, `src/lib/db/families.ts:114-123`

**Recomendación:** Agregar validación en la capa de aplicación antes de llamar a estas funciones (verificar rol del usuario actual).

#### 5.3 Promoción manual sin birthYear posible pero auditada

**⚠️ PARCIALMENTE IMPLEMENTADO**

**Evidencia:**

1. **Función permite promoción manual:**
   - `src/lib/db/members.ts:138-164`
   - Acepta `method: 'AGE_POLICY' | 'MANUAL'` (línea 143)
   - Guarda `transition` con metadata (líneas 154-161):
     - `fromRole`, `toRole`, `promotedAt`, `promotedByUid`, `method`, `note`

2. **Policy permite promoción manual:**
   - `src/lib/types/index.ts:14` - `allowManualPromotion: boolean`
   - `src/lib/policy/agePolicy.ts:39-42` - `isEligibleFor()` permite promoción manual si `allowManualPromotion` es true

3. **❌ NO HAY AUDIT LOGS:**
   - No se crean `audit_logs` cuando se llama `updateMemberRole()`
   - No hay implementación de Firebase Functions para crear audit logs
   - Tipo `AuditLog` existe pero no se usa

**Archivos:**
- Implementación: `src/lib/db/members.ts:138-164`
- Policy helper: `src/lib/policy/agePolicy.ts:34-56`
- Tipo AuditLog: `src/lib/types/index.ts:83-91`

**Recomendación:** Implementar creación de audit logs (via Functions o directamente si se permite en rules - pero rules actuales lo prohíben).

#### 5.4 Paths involucrados

**Stores:**
- `src/store/authStore.ts` - estado de usuario
- `src/store/familyStore.ts` - estado de familia/miembros

**Lib/db:**
- `src/lib/db/families.ts` - `updateFamilyPolicy()` (línea 114)
- `src/lib/db/members.ts` - `updateMemberRole()` (línea 138)

**Rules:**
- `firestore.rules` - reglas de seguridad (líneas 79, 98)

**Policy:**
- `src/lib/policy/agePolicy.ts` - helpers de policy (líneas 11-89)

**Types:**
- `src/lib/types/index.ts` - tipos Role, FamilyPolicy, RoleTransition, AuditLog (líneas 5, 11-26, 83-91)

---

## 6. Bloqueadores para FASE 2

### 🔴 BLOQUEADORES CRÍTICOS

#### 6.1 Sistema de Audit Logs no implementado

**Severidad:** 🔴 CRÍTICA

**Problema:**
- Tipo `AuditLog` existe pero nunca se crea
- `firestore.rules` prohíbe escritura desde cliente (`allow write: if false`)
- No hay Firebase Functions para crear audit logs
- `updateMemberRole()` y `updateFamilyPolicy()` (HIGH-RISK) no generan audit logs

**Impacto:** Sin auditoría, no hay trazabilidad de cambios críticos (roles, policy).

**Ubicaciones:**
- Tipo: `src/lib/types/index.ts:83-91`
- Rules: `firestore.rules:136`
- Funciones HIGH-RISK: `src/lib/db/members.ts:138`, `src/lib/db/families.ts:114`

**Acción requerida:**
1. Implementar Firebase Function para crear audit logs
2. O modificar rules para permitir creación de audit logs desde cliente (con validaciones estrictas)
3. Integrar creación de audit logs en `updateMemberRole()` y `updateFamilyPolicy()`

#### 6.2 Validaciones de roles faltantes en capa de aplicación

**Severidad:** 🟡 ALTA

**Problema:**
- `updateMemberRole()` y `updateFamilyPolicy()` no validan rol del usuario antes de ejecutarse
- Solo Firestore Rules las protege (pero UI podría intentar llamarlas y fallar silenciosamente)
- Función `canManageRole()` existe pero no se usa

**Impacto:** UX pobre (errores en runtime en lugar de validación previa), posible confusión de usuarios.

**Ubicaciones:**
- Helper no usado: `src/lib/policy/agePolicy.ts:61-74`
- Funciones sin validación: `src/lib/db/members.ts:138-164`, `src/lib/db/families.ts:114-123`

**Acción requerida:**
1. Agregar validación de rol en `updateMemberRole()` usando `canManageRole()`
2. Agregar validación de rol en `updateFamilyPolicy()` (verificar `isParentOnly`)
3. O mover estas funciones a UI con validación previa

#### 6.3 Guards faltantes para (admin) group

**Severidad:** 🟡 ALTA

**Problema:**
- No hay guards en `(admin)/_layout.tsx` ni en pantallas individuales
- Cualquier usuario autenticado puede acceder a `/(admin)/members` y `/(admin)/settings`
- Firestore Rules protegen escritura, pero UI debería prevenir acceso no autorizado

**Impacto:** UX confusa (usuarios sin permisos ven pantallas que no pueden usar).

**Ubicaciones:**
- `app/(admin)/_layout.tsx` - sin guard
- `app/(admin)/members.tsx` - sin guard
- `app/(admin)/settings.tsx` - sin guard

**Acción requerida:**
1. Agregar guard en `(admin)/_layout.tsx` para verificar rol PARENT/CO_PARENT
2. O agregar guards individuales en cada pantalla admin

### 🟡 OBSERVACIONES (no bloqueadores pero recomendados)

#### 6.4 Privacy concern: users collection

**Severidad:** 🟡 MEDIA

**Problema:** `users` collection permite lectura a cualquier usuario autenticado.

**Impacto:** Preocupación de privacidad (aunque datos limitados).

**Ubicación:** `firestore.rules:60`

**Acción recomendada:** Restringir lectura según necesidad real (solo propio usuario o miembros de familia).

#### 6.5 Validación de duplicados en join-family

**Severidad:** 🟢 BAJA

**Problema:** `app/(onboarding)/join-family.tsx:50` tiene TODO comentado: "Check if user is already a member before adding"

**Impacto:** Usuario podría unirse múltiples veces (aunque Firestore Rules podría prevenir si hay constraint único).

**Ubicación:** `app/(onboarding)/join-family.tsx:50`

**Acción recomendada:** Implementar verificación antes de `addMember()`.

---

## Resumen Ejecutivo

### ✅ CUMPLE TOTALMENTE

1. **Arquitectura:** UI no accede Firestore directamente ✅
2. **Deny-by-default:** Rules implementan deny-by-default ✅
3. **Membership checks:** Todas las reglas verifican membership ✅
4. **audit_logs append-only:** Rules prohíben escritura desde cliente ✅
5. **Metadata multi-tenant:** Colecciones multi-tenant incluyen campos requeridos ✅
6. **Routing flow:** Flujo (auth) → (onboarding) → (tabs) implementado ✅
7. **Roles definidos:** Todos los roles requeridos están definidos ✅

### ⚠️ CUMPLE PARCIALMENTE

1. **Reglas permisivas:** `users` collection permite lectura amplia (preocupación menor)
2. **Validaciones de roles:** Rules protegen, pero falta validación en capa de aplicación
3. **Audit logs:** Estructura existe pero no se crean logs (bloqueador crítico)
4. **Guards admin:** No hay guards para (admin) group (bloqueador alto)

### 🔴 BLOQUEADORES PARA FASE 2

1. **Sistema de Audit Logs no implementado** (CRÍTICO)
2. **Validaciones de roles faltantes en capa de aplicación** (ALTO)
3. **Guards faltantes para (admin) group** (ALTO)

---

## Recomendaciones Prioritarias

### Prioridad 1 (Bloqueadores)

1. **Implementar sistema de audit logs**
   - Crear Firebase Function para escribir audit logs
   - O modificar rules y crear función helper en `src/lib/db/audit.ts`
   - Integrar en `updateMemberRole()` y `updateFamilyPolicy()`

2. **Agregar guards para (admin) group**
   - Verificar rol PARENT/CO_PARENT antes de permitir acceso

3. **Agregar validaciones de roles en capa de aplicación**
   - Usar `canManageRole()` en `updateMemberRole()`
   - Verificar `isParentOnly` en `updateFamilyPolicy()`

### Prioridad 2 (Mejoras)

4. **Restringir lectura de users collection**
5. **Implementar verificación de duplicados en join-family**

---

**Fin del Reporte**

