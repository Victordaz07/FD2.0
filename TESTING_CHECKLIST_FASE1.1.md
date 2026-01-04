# Checklist de Pruebas Manuales - FASE 1.1 (Hardening)

## Pre-requisitos

1. ✅ Firebase Functions desplegadas
2. ✅ Firestore Rules actualizadas y desplegadas
3. ✅ Aplicación compilada y ejecutándose

---

## 1. Sistema de Audit Logs

### 1.1 Cambio de Rol de Miembro (changeMemberRole)

**Objetivo:** Verificar que los cambios de rol crean audit logs correctamente.

**Pasos:**
1. Iniciar sesión como usuario PARENT
2. Navegar a `/(admin)/members`
3. Cambiar el rol de un miembro (ej: CHILD → TEEN)
4. Verificar en Firestore Console que se creó un documento en `audit_logs` con:
   - `action`: "MEMBER_ROLE_CHANGED"
   - `familyId`: ID de la familia actual
   - `actorUid`: UID del usuario PARENT
   - `targetUid`: UID del miembro cuyo rol cambió
   - `metadata.fromRole`: Rol anterior
   - `metadata.toRole`: Rol nuevo
   - `metadata.method`: "MANUAL" o "AGE_POLICY"
   - `timestamp`: Fecha/hora del cambio

**Resultado esperado:**
- ✅ Audit log creado en `audit_logs` collection
- ✅ Todos los campos están presentes y correctos
- ✅ No se puede escribir audit_logs desde el cliente (reglas Firestore)

**Verificación de seguridad:**
- Intentar escribir directamente a `audit_logs` desde el cliente (debe fallar)
- Verificar que solo Functions puede escribir audit logs

### 1.2 Actualización de Política de Familia (updateFamilyPolicy)

**Objetivo:** Verificar que los cambios de policy crean audit logs correctamente.

**Pasos:**
1. Iniciar sesión como usuario PARENT
2. Navegar a `/(admin)/settings`
3. Actualizar la política de la familia (ej: cambiar `teenAge` de 13 a 14)
4. Verificar en Firestore Console que se creó un documento en `audit_logs` con:
   - `action`: "FAMILY_POLICY_UPDATED"
   - `familyId`: ID de la familia actual
   - `actorUid`: UID del usuario PARENT
   - `metadata.previousPolicy`: Política anterior (objeto completo)
   - `metadata.newPolicy`: Política nueva (objeto completo)
   - `metadata.changes`: Solo los campos que cambiaron
   - `timestamp`: Fecha/hora del cambio

**Resultado esperado:**
- ✅ Audit log creado en `audit_logs` collection
- ✅ Todos los campos están presentes y correctos
- ✅ `metadata.changes` solo contiene los campos modificados

---

## 2. Guards para (admin) Group

### 2.1 Acceso como PARENT

**Objetivo:** Verificar que usuarios PARENT pueden acceder a (admin).

**Pasos:**
1. Iniciar sesión como usuario PARENT
2. Navegar directamente a `/(admin)/members`
3. Verificar que la pantalla se muestra correctamente
4. Navegar a `/(admin)/settings`
5. Verificar que la pantalla se muestra correctamente

**Resultado esperado:**
- ✅ Acceso permitido a `/(admin)/members`
- ✅ Acceso permitido a `/(admin)/settings`
- ✅ No hay redirecciones

### 2.2 Acceso como CO_PARENT

**Objetivo:** Verificar que usuarios CO_PARENT pueden acceder a (admin).

**Pasos:**
1. Iniciar sesión como usuario CO_PARENT (o cambiar rol de un miembro a CO_PARENT)
2. Navegar directamente a `/(admin)/members`
3. Verificar que la pantalla se muestra correctamente
4. Navegar a `/(admin)/settings`
5. Verificar que la pantalla se muestra correctamente

**Resultado esperado:**
- ✅ Acceso permitido a `/(admin)/members`
- ✅ Acceso permitido a `/(admin)/settings`
- ✅ No hay redirecciones

### 2.3 Bloqueo para roles no-parentales

**Objetivo:** Verificar que usuarios sin rol PARENT/CO_PARENT son redirigidos.

**Pasos:**
1. Iniciar sesión como usuario CHILD, TEEN, ADULT_MEMBER, o VIEWER
2. Navegar directamente a `/(admin)/members`
3. Verificar que se redirige a `/(tabs)`
4. Intentar navegar a `/(admin)/settings`
5. Verificar que se redirige a `/(tabs)`

**Resultado esperado:**
- ✅ Redirección automática a `/(tabs)` cuando se intenta acceder a `/(admin)/*`
- ✅ No se muestra contenido de admin
- ✅ No hay errores en consola

### 2.4 Usuario sin familia activa

**Objetivo:** Verificar comportamiento cuando no hay familia activa.

**Pasos:**
1. Iniciar sesión como usuario sin `activeFamilyId`
2. Intentar navegar a `/(admin)/members`
3. Verificar comportamiento

**Resultado esperado:**
- ✅ Redirección a `/(tabs)` o manejo apropiado
- ✅ No hay crashes

---

## 3. Validaciones de Roles en Capa de Aplicación

### 3.1 Cambio de Rol - Permisos Insuficientes

**Objetivo:** Verificar que usuarios sin permisos reciben errores claros.

**Pasos:**
1. Iniciar sesión como usuario CHILD o TEEN
2. Intentar llamar a `changeMemberRole` (desde código o UI si existe)
3. Verificar el mensaje de error

**Resultado esperado:**
- ✅ Error claro: "No tienes permisos para cambiar roles. Solo PARENT y CO_PARENT pueden cambiar roles de miembros."
- ✅ No hay "silent fail"
- ✅ Función callable retorna error `functions/permission-denied`

### 3.2 Cambio de Rol PARENT/CO_PARENT - Solo PARENT puede

**Objetivo:** Verificar que solo PARENT puede cambiar roles PARENT/CO_PARENT.

**Pasos:**
1. Iniciar sesión como usuario CO_PARENT
2. Intentar cambiar el rol de un miembro a PARENT o CO_PARENT
3. Verificar el mensaje de error

**Resultado esperado:**
- ✅ Error claro: "Only PARENT can change PARENT or CO_PARENT roles"
- ✅ Función callable retorna error `functions/permission-denied`

### 3.3 Actualización de Policy - Solo PARENT puede

**Objetivo:** Verificar que solo PARENT puede actualizar policy.

**Pasos:**
1. Iniciar sesión como usuario CO_PARENT
2. Intentar actualizar la política de la familia
3. Verificar el mensaje de error

**Resultado esperado:**
- ✅ Error claro: "No tienes permisos para actualizar la política de la familia. Solo PARENT puede hacerlo."
- ✅ No hay "silent fail"
- ✅ Función callable retorna error `functions/permission-denied`

### 3.4 Cambio de Rol - Validación Exitosa

**Objetivo:** Verificar que cambios válidos funcionan correctamente.

**Pasos:**
1. Iniciar sesión como usuario PARENT
2. Cambiar el rol de un miembro CHILD a TEEN
3. Verificar que el cambio se aplica correctamente
4. Verificar que se crea audit log

**Resultado esperado:**
- ✅ Cambio de rol exitoso
- ✅ Audit log creado
- ✅ UI actualizada correctamente

---

## 4. Restricción de Lectura de Users Collection

### 4.1 Usuario solo puede leer su propio perfil

**Objetivo:** Verificar que usuarios solo pueden leer su propio documento en `users`.

**Pasos:**
1. Iniciar sesión como usuario A
2. Intentar leer documento de usuario B en `users` collection
3. Verificar que falla (desde código/consola)

**Resultado esperado:**
- ✅ Error de permisos al intentar leer otro usuario
- ✅ Solo puede leer su propio documento `users/{ownUid}`

**Nota:** Esta prueba puede requerir código de prueba o verificación manual en Firestore Rules Playground.

---

## 5. Verificación de Duplicados en join-family

### 5.1 Unirse a familia cuando ya es miembro

**Objetivo:** Verificar que no se puede unir dos veces a la misma familia.

**Pasos:**
1. Iniciar sesión como usuario que ya es miembro de una familia
2. Obtener el código de invitación de esa familia
3. Navegar a `/(onboarding)/join-family`
4. Ingresar el código de invitación de la familia a la que ya pertenece
5. Intentar unirse

**Resultado esperado:**
- ✅ Alert con mensaje: "Ya eres miembro de esta familia"
- ✅ No se crea duplicado en `families/{familyId}/members/{uid}`
- ✅ No hay errores en consola

### 5.2 Unirse a familia nueva (caso normal)

**Objetivo:** Verificar que unirse a familia nueva funciona correctamente.

**Pasos:**
1. Iniciar sesión como usuario sin familia activa (o cambiar activeFamilyId a null)
2. Navegar a `/(onboarding)/join-family`
3. Ingresar código de invitación válido de una familia existente
4. Unirse a la familia

**Resultado esperado:**
- ✅ Usuario se une correctamente a la familia
- ✅ `activeFamilyId` se actualiza
- ✅ Se crea documento en `families/{familyId}/members/{uid}`
- ✅ Redirección a `/(tabs)`

---

## Checklist Resumen

- [ ] 1.1 Audit log creado para cambio de rol
- [ ] 1.2 Audit log creado para cambio de policy
- [ ] 2.1 PARENT puede acceder a (admin)
- [ ] 2.2 CO_PARENT puede acceder a (admin)
- [ ] 2.3 Roles no-parentales son redirigidos
- [ ] 2.4 Usuario sin familia manejado correctamente
- [ ] 3.1 Error claro para cambio de rol sin permisos
- [ ] 3.2 Solo PARENT puede cambiar roles PARENT/CO_PARENT
- [ ] 3.3 Solo PARENT puede actualizar policy
- [ ] 3.4 Cambio de rol válido funciona
- [ ] 4.1 Usuarios solo pueden leer su propio perfil
- [ ] 5.1 No se puede unir dos veces a la misma familia
- [ ] 5.2 Unirse a familia nueva funciona

---

## Notas Adicionales

- Todas las pruebas deben ejecutarse en entorno de desarrollo/staging antes de producción
- Verificar logs de Firebase Functions para errores
- Verificar Firestore Rules en Rules Playground si es necesario
- Considerar casos edge (usuarios sin familia, familias eliminadas, etc.)

