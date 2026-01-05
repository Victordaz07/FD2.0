# Testing Checklist - FASE 3: PR1 (Attention Ring MVP)

## Pre-requisitos
- Firebase Functions desplegadas (`cd functions && npm i && npm run build && firebase deploy --only functions`)
- Firestore Rules desplegadas (`firebase deploy --only firestore:rules`)
- Firestore Indexes desplegadas (`firebase deploy --only firestore:indexes`)
- Usuario autenticado con familia activa
- Al menos un miembro con rol PARENT/CO_PARENT y otro con rol CHILD/TEEN
- Tokens de dispositivo registrados (PR0 completado)

---

## 1. Configuración de Attention Mode (setAttentionMode)

### 1.1 Activar/Desactivar Attention Mode (CHILD/TEEN)
- [ ] Iniciar sesión como CHILD o TEEN
- [ ] Navegar a settings/attention-mode (o donde esté la UI)
- [ ] Activar `attentionMode.enabled` (toggle ON)
- [ ] Verificar en Firestore Console: `families/{familyId}/members/{uid}.attentionMode.enabled = true`
- [ ] Desactivar `attentionMode.enabled` (toggle OFF)
- [ ] Verificar en Firestore Console: `attentionMode.enabled = false`
- [ ] Verificar que audit log `ATTENTION_MODE_UPDATED` se crea en cada cambio

### 1.2 Toggle allowLoud (CHILD/TEEN)
- [ ] Con `attentionMode.enabled = true`, activar `allowLoud`
- [ ] Verificar en Firestore: `attentionMode.allowLoud = true`
- [ ] Desactivar `allowLoud`
- [ ] Verificar: `attentionMode.allowLoud = false`
- [ ] Verificar audit log `ATTENTION_MODE_UPDATED`

### 1.3 Validación de Permisos
- [ ] CHILD/TEEN solo puede cambiar su propio `attentionMode`
- [ ] CHILD/TEEN NO puede cambiar `attentionMode` de otros miembros
- [ ] PARENT/CO_PARENT NO puede cambiar `attentionMode` de otros vía `setAttentionMode` (debe usar `forceAttentionModeOn`)

---

## 2. Envío de Attention Request (sendAttentionRequest)

### 2.1 Envío Normal (PARENT/CO_PARENT)
- [ ] Iniciar sesión como PARENT o CO_PARENT
- [ ] Enviar request a un CHILD/TEEN con `intensity: 'normal'`
- [ ] Verificar en Firestore: Se crea documento en `attention_requests` con:
  - `status: 'active'`
  - `targetUid`: correcto
  - `triggeredByUid`: caller uid
  - `intensity: 'normal'`
  - `durationSec`: 15, 30 o 60
  - `rateBucket`: número calculado
  - `expiresAt`: Timestamp futuro
- [ ] Verificar que push notification llega al target
- [ ] Verificar audit log `ATTENTION_SENT`

### 2.2 Envío Loud (PARENT/CO_PARENT)
- [ ] Target tiene `attentionMode.enabled = true` y `allowLoud = true`
- [ ] Enviar request con `intensity: 'loud'`
- [ ] Verificar que se crea con `intensity: 'loud'` (sin downgrade)
- [ ] Verificar push notification llega

### 2.3 Downgrade Loud a Normal
- [ ] Target tiene `attentionMode.enabled = false`
- [ ] Enviar request con `intensity: 'loud'`
- [ ] Verificar que se guarda con `intensity: 'normal'` (downgrade aplicado)
- [ ] Target tiene `attentionMode.enabled = true` pero `allowLoud = false`
- [ ] Enviar request con `intensity: 'loud'`
- [ ] Verificar que se guarda con `intensity: 'normal'` (downgrade aplicado)

### 2.4 Rate Limit (3 requests / 10 minutos)
- [ ] Enviar 3 requests al mismo target en menos de 10 minutos → ✅ Todas deben ser exitosas
- [ ] Intentar enviar 4ta request → ❌ Error: "Demasiadas solicitudes. Máximo 3 por cada 10 minutos por persona."
- [ ] Esperar 10+ minutos y enviar nueva request → ✅ Debe ser exitosa

### 2.5 Validación de Permisos
- [ ] CHILD/TEEN intenta enviar request → ❌ Error: "Solo PARENT o CO_PARENT pueden enviar solicitudes"
- [ ] PARENT/CO_PARENT intenta enviar a target que no es miembro → ❌ Error: "El miembro objetivo no existe"

### 2.6 Manejo de Errores (Push)
- [ ] Target no tiene token registrado → Request marcado como `status: 'failed'`, `failReason: 'No se encontró token de dispositivo'`
- [ ] Target no existe en `users` → Request marcado como `status: 'failed'`, `failReason: 'Usuario no encontrado'`

---

## 3. Acknowledge Request (ackAttentionRequest)

### 3.1 Acknowledge Normal
- [ ] Target user (CHILD/TEEN) recibe request
- [ ] Llamar `ackAttentionRequest(familyId, requestId)`
- [ ] Verificar en Firestore: `status: 'acknowledged'`, `ackAt`: Timestamp presente
- [ ] Verificar audit log `ATTENTION_ACK`

### 3.2 Validación de Permisos
- [ ] Solo target user puede ack su propio request
- [ ] Otro usuario intenta ack → ❌ Error: "Solo el destinatario puede reconocer esta solicitud"
- [ ] PARENT/CO_PARENT intenta ack request ajeno → ❌ Error de permisos

### 3.3 Idempotencia
- [ ] Acknowledge un request activo → ✅ Status cambia a 'acknowledged'
- [ ] Acknowledge el mismo request nuevamente → ✅ Retorna `{ success: true, alreadyAcknowledged: true }` sin error
- [ ] Verificar que `ackAt` no se actualiza en el segundo llamado (idempotente)

### 3.4 Estados Inválidos
- [ ] Intentar ack request con `status: 'cancelled'` → ❌ Error: "La solicitud no está activa"
- [ ] Intentar ack request con `status: 'expired'` → ❌ Error: "La solicitud no está activa"

---

## 4. Cancel Request (cancelAttentionRequest)

### 4.1 Cancel Normal
- [ ] PARENT/CO_PARENT cancela request activo
- [ ] Verificar en Firestore: `status: 'cancelled'`, `cancelledAt`: Timestamp presente
- [ ] Verificar audit log `ATTENTION_CANCELLED`

### 4.2 Validación de Permisos
- [ ] Solo PARENT/CO_PARENT puede cancelar
- [ ] CHILD/TEEN intenta cancelar → ❌ Error: "Solo PARENT o CO_PARENT pueden cancelar solicitudes"

### 4.3 Idempotencia
- [ ] Cancelar un request activo → ✅ Status cambia a 'cancelled'
- [ ] Cancelar el mismo request nuevamente → ✅ Retorna `{ success: true, alreadyCancelled: true }` sin error
- [ ] Verificar que `cancelledAt` no se actualiza en el segundo llamado (idempotente)

### 4.4 Estados Inválidos
- [ ] Intentar cancelar request con `status: 'acknowledged'` → ❌ Error: "La solicitud no está activa"
- [ ] Intentar cancelar request con `status: 'expired'` → ❌ Error: "La solicitud no está activa"

---

## 5. Force Attention Mode ON (forceAttentionModeOn)

### 5.1 Force ON Normal
- [ ] PARENT/CO_PARENT fuerza attention mode ON para target CHILD/TEEN
- [ ] Especificar `forcedMinutes: 60`
- [ ] Verificar en Firestore: `attentionMode.enabled = true`, `forcedUntil`: Timestamp futuro (now + 60 minutos)
- [ ] Verificar audit log `ATTENTION_MODE_FORCED_ON`

### 5.2 Validación de Límites
- [ ] `forcedMinutes: 120` → ✅ Aceptado (máximo)
- [ ] `forcedMinutes: 121` → ❌ Error: "forcedMinutes debe ser un número entre 1 y 120"
- [ ] `forcedMinutes: 0` → ❌ Error: "forcedMinutes debe ser un número entre 1 y 120"

### 5.3 Validación de Permisos
- [ ] Solo PARENT/CO_PARENT puede forzar
- [ ] CHILD/TEEN intenta forzar → ❌ Error: "Solo PARENT o CO_PARENT pueden forzar el modo de atención"

### 5.4 Comportamiento con forcedUntil
- [ ] Target tiene `forcedUntil > now` → Loud requests se permiten (no downgrade)
- [ ] Target tiene `forcedUntil` expirado → Comportamiento normal según `enabled` y `allowLoud`

---

## 6. Attention Ring Screen (UI)

### 6.1 Navegación al Recibir Push
- [ ] Al recibir push con `data.type: 'ATTENTION_RING'`, app navega a AttentionRingScreen
- [ ] Si app está cerrada, se abre y navega a AttentionRingScreen
- [ ] Screen muestra request activo

### 6.2 Display Name del Caller
- [ ] Screen muestra: "Te está llamando: {displayName}"
- [ ] `displayName` se resuelve desde `families/{familyId}/members/{triggeredByUid}.displayName`
- [ ] Si no hay `displayName`, muestra fallback basado en role: "Padre/Tutor", "Adulto", "Adolescente", "Niño/a"
- [ ] Fallback final si falla lectura: "Un padre/tutor"
- [ ] **Nunca se muestra UID en UI**

### 6.3 Contenido de la Screen
- [ ] Muestra mensaje opcional si existe en request
- [ ] Muestra countdown (expiresAt - now) actualizándose
- [ ] Botón "Entendido" visible y funcional
- [ ] Si request expira localmente, muestra "Expiró" (no permite ack)

### 6.4 Sonido In-App (Android)
- [ ] Si `intensity: 'loud'` y `allowLoud: true`, reproduce sonido al mostrar screen
- [ ] Sonido se reproduce por `durationSec` segundos (15/30/60)
- [ ] Sonido se detiene al presionar "Entendido" (ack)
- [ ] Sonido se detiene al unmount component (navegar fuera)
- [ ] Sonido se detiene si request expira (expiresAt alcanzado)
- [ ] Si `intensity: 'normal'`, no reproduce sonido

### 6.5 Sonido In-App (iOS)
- [ ] iOS reproduce sonido estándar si está permitido
- [ ] No promete bypass de modo silencio del sistema
- [ ] Sonido se detiene en ack/unmount/expire (mismo comportamiento que Android)

### 6.6 Acknowledge desde Screen
- [ ] Presionar "Entendido" llama a `ackAttentionRequest`
- [ ] Muestra loading state mientras procesa
- [ ] Si exitoso, cierra screen o navega atrás
- [ ] Si error, muestra mensaje de error en español

---

## 7. Firestore Rules

### 7.1 Members Collection
- [ ] Todos los miembros de la familia pueden leer `families/{familyId}/members/{uid}` (incluyendo `displayName`)
- [ ] CHILD puede leer `attentionMode` de todos los miembros (para validar si puede recibir loud)
- [ ] PARENT/CO_PARENT puede leer todos los campos de members

### 7.2 Attention Requests Collection
- [ ] **Client NO puede crear** `attention_requests` → DENY (solo Functions)
- [ ] **Client NO puede actualizar** `attention_requests` → DENY (solo Functions)
- [ ] **Client NO puede eliminar** `attention_requests` → DENY (solo Functions)
- [ ] PARENT/CO_PARENT puede leer todos los requests de la familia
- [ ] Target user puede leer sus propios requests (donde `targetUid == request.auth.uid`)

### 7.3 Attention Mode en Members
- [ ] Self puede escribir `attentionMode.enabled` y `attentionMode.allowLoud`
- [ ] `attentionMode.forcedUntil` solo se escribe vía Functions (client DENY)
- [ ] PARENT/CO_PARENT puede leer `attentionMode` de todos los miembros

---

## 8. Data Consistency

### 8.1 Attention Requests
- [ ] Todos los campos requeridos presentes: `familyId`, `targetUid`, `triggeredByUid`, `createdAt`, `expiresAt`, `intensity`, `durationSec`, `status`, `rateBucket`
- [ ] `createdAt` y `expiresAt` son Firestore Timestamp (no Date)
- [ ] `rateBucket` es number (no string)

### 8.2 Attention Mode
- [ ] Campos presentes: `enabled`, `allowLoud`, `updatedAt`, `updatedByUid`
- [ ] `forcedUntil` opcional (solo cuando se fuerza)
- [ ] `updatedAt` es Firestore Timestamp

### 8.3 Audit Logs
- [ ] Todos los audit logs incluyen: `familyId`, `actorUid`, `action`, `targetUid`, `createdAt`
- [ ] `ATTENTION_SENT`: metadata incluye `requestId`, `intensity`, `durationSec`
- [ ] `ATTENTION_ACK`: metadata incluye `requestId`, `targetUid`, `triggeredByUid`
- [ ] `ATTENTION_CANCELLED`: metadata incluye `requestId`, `targetUid`, `triggeredByUid`
- [ ] `ATTENTION_MODE_UPDATED`: metadata incluye `targetUid`, `enabled`, `allowLoud`
- [ ] `ATTENTION_MODE_FORCED_ON`: metadata incluye `targetUid`, `forcedMinutes`, `forcedUntil`

---

## 9. Edge Cases

### 9.1 Request Expira
- [ ] Request con `expiresAt < now` pero `status: 'active'` → UI debe detectar y mostrar "Expiró"
- [ ] No se puede ack request expirado (Function rechaza)

### 9.2 Multiple Active Requests
- [ ] PARENT envía 2 requests rápidas al mismo target → Ambas se crean con status 'active'
- [ ] Target puede ack ambas independientemente
- [ ] Rate limit cuenta ambas para el bucket

### 9.3 Rate Limit Edge Cases
- [ ] Request 1, 2, 3 en minuto 0 → ✅ Todas aceptadas
- [ ] Request 4 en minuto 0 → ❌ Rechazada
- [ ] Request 4 en minuto 11 (nuevo bucket) → ✅ Aceptada

---

## 10. UI - Navegación desde Push Notifications

### 10.1 App Foreground
- [ ] App está abierta y activa
- [ ] Llega push con `data.type: "ATTENTION_RING"`
- [ ] App navega automáticamente a `/(tabs)/attention/ring?requestId={id}&familyId={id}`
- [ ] AttentionRingScreen se muestra correctamente

### 10.2 App Background
- [ ] App está en background
- [ ] Llega push con `data.type: "ATTENTION_RING"`
- [ ] Usuario toca la notificación
- [ ] App se abre y navega a AttentionRingScreen

### 10.3 App Killed
- [ ] App está cerrada completamente
- [ ] Llega push con `data.type: "ATTENTION_RING"`
- [ ] Usuario toca la notificación
- [ ] App se abre desde cero y navega a AttentionRingScreen
- [ ] `getLastNotificationResponseAsync()` funciona correctamente

### 10.4 Validación de Datos
- [ ] Push sin `data.type` o diferente a "ATTENTION_RING" → No navega
- [ ] Push sin `requestId` o `familyId` → No navega (o muestra error)
- [ ] Múltiples notificaciones → Navega a la última

---

## 11. UI - AttentionRingScreen

### 11.1 Carga de Request
- [ ] Screen carga request desde `getAttentionRequest(familyId, requestId)`
- [ ] Si request no existe → Muestra "Solicitud no encontrada" y botón "Volver"
- [ ] Si request expiró → Muestra "Expiró" y deshabilita botón "Entendido"

### 11.2 Display Caller Name
- [ ] Muestra: "Te está llamando: {callerName}"
- [ ] `callerName` se resuelve desde `getMemberDisplayName(familyId, triggeredByUid)`
- [ ] Si no hay displayName → Muestra fallback basado en role ("Padre/Tutor", "Adulto", etc.)
- [ ] Fallback final: "Un padre/tutor"
- [ ] **Nunca se muestra UID en UI**

### 11.3 Countdown
- [ ] Muestra countdown en formato MM:SS
- [ ] Actualiza cada segundo
- [ ] Cuando alcanza 0 → Muestra "Expiró" y detiene sonido

### 11.4 Botón "Entendido"
- [ ] Presionar "Entendido" → Llama `ackAttentionRequest` desde store
- [ ] Muestra loading state mientras procesa
- [ ] Si exitoso → Navega atrás (router.back())
- [ ] Si error → Muestra mensaje de error en español
- [ ] Si ya está acknowledged (idempotente) → Funciona sin error

### 11.5 Sonido In-App (Android)
- [ ] Si `intensity === "loud"` → Reproduce sonido repetitivo
- [ ] Sonido se reproduce por `durationSec` segundos
- [ ] Sonido se detiene al presionar "Entendido" (ack)
- [ ] Sonido se detiene al unmount component (navegar fuera)
- [ ] Sonido se detiene si countdown expira
- [ ] Si `intensity === "normal"` → No reproduce sonido

### 11.6 Sonido In-App (iOS)
- [ ] Si `intensity === "loud"` → Intenta reproducir sonido
- [ ] Sonido puede no funcionar en modo silencio (comportamiento esperado)
- [ ] Sonido se detiene en ack/unmount/expire (mismo comportamiento que Android)

### 11.7 Mensaje Opcional
- [ ] Si request tiene `message` → Se muestra en pantalla
- [ ] Si no tiene `message` → No se muestra campo de mensaje

---

## 12. UI - AttentionModeSettingsScreen

### 12.1 Carga de Estado
- [ ] Screen carga `attentionMode` desde store al montar
- [ ] Muestra loading state mientras carga
- [ ] Muestra estado actual (enabled, allowLoud)

### 12.2 Toggle Enabled
- [ ] Activar `enabled` → Llama `setAttentionMode(familyId, true, allowLoud)`
- [ ] Desactivar `enabled` → Llama `setAttentionMode(familyId, false, false)` (fuerza allowLoud=false)
- [ ] Si error → Muestra mensaje y revierte toggle
- [ ] Si exitoso → Actualiza estado en store

### 12.3 Toggle AllowLoud
- [ ] Solo habilitado si `enabled === true`
- [ ] Activar `allowLoud` → Llama `setAttentionMode(familyId, enabled, true)`
- [ ] Desactivar `allowLoud` → Llama `setAttentionMode(familyId, enabled, false)`
- [ ] Si error → Muestra mensaje y revierte toggle

### 12.4 Validaciones UX
- [ ] Si `enabled = false` → `allowLoud` toggle está deshabilitado
- [ ] Mensajes de error en español
- [ ] Loading states durante actualización

---

## 13. UI - Botón Attention Ring en Perfil (Parent)

### 13.1 Visibilidad
- [ ] Botón "🔔" visible solo para PARENT/CO_PARENT
- [ ] Botón NO visible para el propio usuario (self)
- [ ] Botón visible en lista de miembros (`app/(admin)/members.tsx`)

### 13.2 Modal de Envío
- [ ] Al presionar botón → Abre modal con formulario
- [ ] Muestra nombre del target member
- [ ] Selector `intensity`: "normal" | "loud"
- [ ] Selector `duration`: 15 | 30 | 60 segundos
- [ ] Input `message` (opcional, multiline)

### 13.3 Validaciones UX
- [ ] Si target tiene `allowLoud = false` → Opción "loud" deshabilitada con texto "(no permitido)"
- [ ] Si target tiene `enabled = false` → Opción "loud" deshabilitada (pero puede enviar "normal")
- [ ] Validación se hace leyendo `attentionMode` del target antes de mostrar modal

### 13.4 Envío
- [ ] Al presionar "Enviar" → Llama `sendRequest` desde store
- [ ] Muestra loading state
- [ ] Si exitoso → Cierra modal y muestra mensaje de éxito
- [ ] Si error (rate limit, permisos, etc.) → Muestra mensaje de error en español
- [ ] Rate limit error: "Demasiadas solicitudes. Máximo 3 por cada 10 minutos por persona."

---

## Notas de Testing

- **Testing en Android**: Verificar canal `attention_high` y sonido in-app
- **Testing en iOS**: Sonido puede no reproducirse en modo silencio (comportamiento esperado)
- **Rate limit**: Probar enviando 4 requests rápidas al mismo target
- **Push notifications**: Verificar que `data.type='ATTENTION_RING'` y `requestId` están en payload
- **Idempotencia**: Probar ack/cancel múltiples veces en el mismo request
- **Sonido**: Verificar que se detiene correctamente en ack/unmount/expire
- **Navegación push**: Probar en los 3 estados (foreground, background, killed)
- **Display name**: Verificar que nunca se muestra UID, siempre displayName o fallback

