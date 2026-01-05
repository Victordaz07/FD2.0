# Testing Checklist - FASE 3: PR0 (Push Base) + PR1 (Attention Ring MVP)

## PR0: Infra Push Base

### 1. Permisos de Notificaciones
- [ ] Al iniciar la app, se solicitan permisos de notificaciones
- [ ] Si se deniegan permisos, la app maneja el error correctamente
- [ ] Si se aceptan permisos, la app continúa normalmente

### 2. Registro de Token
- [ ] Token se guarda en `users/{uid}.deviceTokens.ios.token` (iOS)
- [ ] Token se guarda en `users/{uid}.deviceTokens.android.token` (Android)
- [ ] `deviceReady: true` se establece después de registrar token
- [ ] Token se actualiza correctamente si cambia (refresh)

### 3. Canal de Notificaciones Android
- [ ] Canal `attention_high` se crea al iniciar la app (Android)
- [ ] Canal tiene importancia MAX
- [ ] Canal tiene sound habilitado
- [ ] No hay errores en consola al crear el canal

### 4. Function de Prueba (sendTestPushToSelf)
- [ ] Function `sendTestPushToSelf` se puede llamar desde la app
- [ ] Push notification llega al dispositivo (Android)
- [ ] Push notification llega al dispositivo (iOS)
- [ ] Audit log `PUSH_TEST_SENT` se crea correctamente
- [ ] Si no hay token, function retorna error claro

---

## PR1: Attention Ring MVP

### 5. Configuración de Attention Mode (setAttentionMode)
- [ ] CHILD/TEEN puede activar/desactivar `attentionMode.enabled`
- [ ] CHILD/TEEN puede activar/desactivar `allowLoud`
- [ ] Cambios se guardan en `members/{uid}.attentionMode`
- [ ] Audit log `ATTENTION_MODE_UPDATED` se crea correctamente
- [ ] Solo el propio usuario puede cambiar su attentionMode

### 6. Envío de Attention Request (sendAttentionRequest)
- [ ] PARENT/CO_PARENT puede enviar request a cualquier miembro
- [ ] CHILD/TEEN NO puede enviar requests (error de permisos)
- [ ] Request se crea en `attention_requests` con status 'active'
- [ ] Push notification llega al target con data.type='ATTENTION_RING'
- [ ] Audit log `ATTENTION_SENT` se crea correctamente
- [ ] Si target no tiene token, request se marca como 'failed'

### 7. Rate Limit (3 requests / 10 minutos / targetUid)
- [ ] Primeras 3 requests en 10 minutos: ✅ permitidas
- [ ] 4ta request en mismo periodo: ❌ error "Demasiadas solicitudes"
- [ ] Después de 10 minutos, contador se resetea
- [ ] Rate limit cuenta solo requests activas/acknowledged/cancelled (no expired/failed)

### 8. Intensity Downgrades
- [ ] Si target tiene `attentionMode.enabled=false` → loud se downgradea a normal
- [ ] Si target tiene `allowLoud=false` (y no forced) → loud se downgradea a normal
- [ ] Si target tiene `forcedUntil > now` → loud se permite (no downgrade)
- [ ] Request se crea con `intensity` final (puede ser diferente al solicitado)

### 9. Acknowledge Request (ackAttentionRequest)
- [ ] Target user puede ack su propio request
- [ ] Otros usuarios NO pueden ack requests ajenos (error de permisos)
- [ ] Status cambia a 'acknowledged' y se establece `ackAt`
- [ ] Audit log `ATTENTION_ACK` se crea correctamente
- [ ] No se puede ack un request que no está 'active'

### 10. Cancel Request (cancelAttentionRequest)
- [ ] PARENT/CO_PARENT puede cancelar cualquier request
- [ ] CHILD/TEEN NO puede cancelar requests (error de permisos)
- [ ] Status cambia a 'cancelled' y se establece `cancelledAt`
- [ ] Audit log `ATTENTION_CANCELLED` se crea correctamente
- [ ] No se puede cancelar un request que no está 'active'

### 11. Force Attention Mode ON (forceAttentionModeOn)
- [ ] PARENT/CO_PARENT puede forzar attention mode ON
- [ ] CHILD/TEEN NO puede forzar (error de permisos)
- [ ] `forcedMinutes` máximo 120 (más de 120 → error)
- [ ] `enabled` se establece a `true`
- [ ] `forcedUntil` se calcula correctamente (now + forcedMinutes)
- [ ] Audit log `ATTENTION_MODE_FORCED_ON` se crea correctamente

### 12. Attention Ring Screen (UI)
- [ ] Al recibir push 'ATTENTION_RING', se navega a AttentionRingScreen
- [ ] Screen muestra: "Te está llamando: {displayName}" con nombre correcto
  - [ ] Se resuelve displayName desde `families/{familyId}/members/{triggeredByUid}.displayName` (NO desde users)
  - [ ] Si no hay displayName, muestra fallback basado en role: "Padre/Tutor", "Adulto", "Adolescente", "Niño/a"
  - [ ] Fallback final: "Un padre/tutor"
  - [ ] Nunca se muestra UID en UI
- [ ] Screen muestra mensaje opcional si existe
- [ ] Screen muestra countdown (expiresAt - now)
- [ ] Botón "Entendido" llama a `ackAttentionRequest`
- [ ] Si request expira localmente, muestra "Expiró"
- [ ] Si intensity='loud' y allowLoud=true, reproduce sonido (Android)
- [ ] Sonido se reproduce por durationSec segundos

### 13. Firestore Rules
- [ ] Cliente NO puede crear `attention_requests` (DENY)
- [ ] Cliente NO puede actualizar `attention_requests` (DENY)
- [ ] Cliente NO puede eliminar `attention_requests` (DENY)
- [ ] PARENT/CO_PARENT puede leer todos los requests de la familia
- [ ] Target user puede leer sus propios requests
- [ ] `attentionMode` en members: self puede escribir enabled/allowLoud
- [ ] `attentionMode.forcedUntil` solo se escribe via Functions

### 14. Data Consistency
- [ ] `attention_requests` incluyen: familyId, createdAt, expiresAt, rateBucket
- [ ] `attentionMode` incluye: enabled, allowLoud, updatedAt, updatedByUid
- [ ] Todos los Timestamps son Firestore Timestamp (no Date)
- [ ] Audit logs incluyen: familyId, actorUid, action, targetUid, createdAt

---

## Notas

- **Testing en Android**: Verificar canal `attention_high` y sonido en modo silencio
- **Testing en iOS**: Sonido puede no reproducirse en modo silencio (comportamiento esperado)
- **Rate limit**: Probar enviando 4 requests rápidas al mismo target
- **Push notifications**: Verificar que data.type='ATTENTION_RING' y requestId están en payload

