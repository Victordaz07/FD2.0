# Testing Checklist - FASE 2 (Core Daily Use)

## Pre-requisitos
- Firebase Functions desplegadas (`npm run deploy` en `functions/`)
- Firestore Rules desplegadas (`firebase deploy --only firestore:rules`)
- Usuario autenticado con familia activa
- Al menos un miembro con rol PARENT/CO_PARENT y otro con rol CHILD/TEEN

---

## 1. Tasks (Tareas)

### 1.1 Crear Tarea (PARENT/CO_PARENT)
- [ ] Iniciar sesión como PARENT o CO_PARENT
- [ ] Navegar a `/(tabs)/tasks`
- [ ] Verificar que aparece botón "Nueva Tarea"
- [ ] Crear tarea con:
  - Título: "Sacar la basura"
  - Descripción: "Todos los martes"
  - Puntos: 10
  - Requiere aprobación: Sí
- [ ] Verificar que la tarea aparece en la lista
- [ ] Verificar que solo usuarios con rol PARENT/CO_PARENT pueden crear tareas (CHILD no debe ver botón)

### 1.2 Completar Tarea (CHILD/TEEN)
- [ ] Iniciar sesión como CHILD o TEEN
- [ ] Navegar a `/(tabs)/tasks`
- [ ] Ver tarea creada anteriormente
- [ ] Presionar botón "Completar"
- [ ] Verificar mensaje de éxito
- [ ] Verificar que se creó un `task_completion` con status `pending_approval`

### 1.3 Ver Detalle de Tarea
- [ ] Presionar en una tarea de la lista
- [ ] Verificar que se muestra:
  - Título
  - Descripción
  - Puntos/Mesada
  - Estado (Activa/Inactiva)
  - Requiere aprobación
  - Historial de completaciones

### 1.4 Aprobar Completación (PARENT/CO_PARENT)
- [ ] Iniciar sesión como PARENT o CO_PARENT
- [ ] Navegar a `/(tabs)/tasks/completions`
- [ ] Ver completación pendiente
- [ ] Presionar "Aprobar"
- [ ] Verificar mensaje de éxito
- [ ] Verificar que:
  - El `task_completion` cambió a status `approved`
  - Se creó una entrada en `allowance_ledger` (si la tarea tenía points/amountCents)
  - Se creó un `audit_log` con acción `TASK_COMPLETION_APPROVED`

### 1.5 Rechazar Completación (PARENT/CO_PARENT)
- [ ] Completar una tarea como CHILD/TEEN (si no hay pendientes)
- [ ] Como PARENT/CO_PARENT, ir a `/(tabs)/tasks/completions`
- [ ] Presionar "Rechazar"
- [ ] Confirmar rechazo
- [ ] Verificar que:
  - El `task_completion` cambió a status `rejected`
  - NO se creó entrada en `allowance_ledger`
  - Se creó un `audit_log` con acción `TASK_COMPLETION_REJECTED`

### 1.6 Intentos Inválidos - Crear Tarea como CHILD
- [ ] Iniciar sesión como CHILD
- [ ] Navegar a `/(tabs)/tasks`
- [ ] Verificar que NO aparece botón "Nueva Tarea"
- [ ] Intentar acceder directamente a `/(tabs)/tasks/new` (si es posible)
- [ ] Verificar que Firestore Rules bloquean la creación

---

## 2. Allowance Ledger (Mesada)

### 2.1 Ver Balance (CHILD/TEEN)
- [ ] Iniciar sesión como CHILD o TEEN
- [ ] Navegar a `/(tabs)/allowance`
- [ ] Ver balance actual (inicialmente 0)
- [ ] Ver historial de transacciones (vacío inicialmente)

### 2.2 Ver Balance después de Aprobar Tarea
- [ ] Después de aprobar una completación (1.4)
- [ ] Navegar a `/(tabs)/allowance` como el CHILD que completó la tarea
- [ ] Verificar que:
  - El balance muestra los puntos/mesada de la tarea aprobada
  - El historial muestra la entrada con source `task_completion`

### 2.3 Agregar Entrada Manual (PARENT/CO_PARENT)
- [ ] Iniciar sesión como PARENT o CO_PARENT
- [ ] Llamar a `addAllowanceLedgerEntry` function:
  - familyId: [ID de familia]
  - memberUid: [UID del CHILD]
  - amountCents: 500 (o points: 50)
  - type: "credit"
  - description: "Mesada semanal"
- [ ] Verificar que:
  - Se creó entrada en `allowance_ledger`
  - Se creó `audit_log` con acción `ALLOWANCE_LEDGER_ENTRY_CREATED`
  - El balance del miembro se actualizó

### 2.4 Ver Balance de Múltiples Miembros (PARENT/CO_PARENT)
- [ ] Iniciar sesión como PARENT o CO_PARENT
- [ ] Navegar a `/(tabs)/allowance`
- [ ] Verificar selector de miembros
- [ ] Cambiar entre miembros y verificar que el balance se actualiza

### 2.5 Intentos Inválidos - Crear Ledger Entry como CHILD
- [ ] Iniciar sesión como CHILD
- [ ] Intentar llamar `addAllowanceLedgerEntry` function
- [ ] Verificar que la función retorna error `permission-denied`
- [ ] Verificar que NO se creó entrada en `allowance_ledger`

---

## 3. Calendar (Calendario)

### 3.1 Crear Evento (PARENT/CO_PARENT)
- [ ] Iniciar sesión como PARENT o CO_PARENT
- [ ] Navegar a `/(tabs)/calendar`
- [ ] Presionar "Nuevo Evento"
- [ ] Crear evento con:
  - Título: "Reunión familiar"
  - Descripción: "Reunión mensual"
  - Fecha: [fecha futura]
  - Visibilidad: "family"
- [ ] Verificar que el evento aparece en la lista

### 3.2 Ver Evento (Family Visibility)
- [ ] Iniciar sesión como cualquier miembro (CHILD/TEEN/PARENT)
- [ ] Navegar a `/(tabs)/calendar`
- [ ] Verificar que aparece el evento con visibility "family"

### 3.3 Crear Evento Solo para Padres
- [ ] Iniciar sesión como PARENT o CO_PARENT
- [ ] Crear evento con visibility "parents_only"
- [ ] Verificar que el evento se guardó correctamente

### 3.4 Ver Evento Solo para Padres
- [ ] Iniciar sesión como PARENT o CO_PARENT
- [ ] Verificar que el evento con visibility "parents_only" es visible
- [ ] Iniciar sesión como CHILD o TEEN
- [ ] Verificar que el evento con visibility "parents_only" NO es visible (filtrado por Firestore Rules)

### 3.5 Intentos Inválidos - Crear Evento como CHILD
- [ ] Iniciar sesión como CHILD
- [ ] Navegar a `/(tabs)/calendar`
- [ ] Verificar que NO aparece botón "Nuevo Evento"
- [ ] Intentar llamar `createEvent` directamente
- [ ] Verificar que Firestore Rules bloquean la creación

---

## 4. Firestore Rules Playground

### 4.1 Tasks Rules
- [ ] Verificar que `tasks` read requiere `isMember(familyId)`
- [ ] Verificar que `tasks` create/update/delete requiere `isParent(familyId)`
- [ ] Verificar que CHILD no puede crear tareas

### 4.2 Task Completions Rules
- [ ] Verificar que `task_completions` read requiere `isMember(familyId)`
- [ ] Verificar que `task_completions` create requiere `isMember(familyId)` y `memberUid == request.auth.uid`
- [ ] Verificar que `task_completions` update/delete está denegado (solo Functions)

### 4.3 Allowance Ledger Rules
- [ ] Verificar que `allowance_ledger` read:
  - Miembros pueden leer sus propias entradas
  - PARENT/CO_PARENT pueden leer todas las entradas
- [ ] Verificar que `allowance_ledger` create/update/delete está denegado (solo Functions)

### 4.4 Events Rules
- [ ] Verificar que `events` read:
  - `visibility == 'family'` => `isMember(familyId)`
  - `visibility == 'parents_only'` => `isParent(familyId)`
- [ ] Verificar que `events` create:
  - CHILD siempre denegado
  - PARENT/CO_PARENT siempre permitido
  - TEEN/ADULT_MEMBER permitido si está en `calendarCreateRoles`
- [ ] Verificar que `events` update/delete:
  - Creator OR PARENT/CO_PARENT (pero CHILD nunca)

---

## 5. Audit Logs

### 5.1 Verificar Audit Logs
- [ ] Después de aprobar completación, verificar `audit_logs` collection
- [ ] Buscar log con:
  - `action: 'TASK_COMPLETION_APPROVED'`
  - `actorUid: [UID del PARENT/CO_PARENT]`
  - `targetUid: [UID del CHILD que completó]`
  - `metadata` incluye `completionId`, `taskId`, `periodKey`, etc.

- [ ] Después de rechazar completación, verificar log con:
  - `action: 'TASK_COMPLETION_REJECTED'`
  - `metadata` incluye `reason`

- [ ] Después de agregar ledger entry manual, verificar log con:
  - `action: 'ALLOWANCE_LEDGER_ENTRY_CREATED'`
  - `metadata` incluye `entryId`, `amountCents`, `points`, `type`, etc.

### 5.2 Verificar Inmutabilidad de Audit Logs
- [ ] Intentar actualizar un `audit_log` (debe fallar por Rules)
- [ ] Intentar eliminar un `audit_log` (debe fallar por Rules)

---

## 6. Validaciones de Datos

### 6.1 PeriodKey Uniqueness
- [ ] Crear tarea con schedule `daily`
- [ ] Completar la tarea dos veces el mismo día (como el mismo miembro)
- [ ] Aprobar la primera completación
- [ ] Intentar aprobar la segunda completación
- [ ] Verificar que la función `approveTaskCompletion` retorna error `already-exists`

### 6.2 Validación Points/AmountCents
- [ ] Intentar crear tarea sin points ni amountCents
- [ ] Verificar que retorna error "Debe proporcionar points o amountCents"

- [ ] Intentar agregar ledger entry sin points ni amountCents
- [ ] Verificar que retorna error "Debe proporcionar amountCents o points"

### 6.3 Timestamps
- [ ] Verificar que todos los documentos usan `Timestamp` de Firestore (no `Date`)
- [ ] Verificar que `createdAt` y `updatedAt` usan `serverTimestamp()` en escrituras
- [ ] Verificar que `task_completions` NO tiene `updatedAt` (inmutable excepto por Functions)
- [ ] Verificar que `allowance_ledger` NO tiene `updatedAt` (inmutable)

---

## 7. UI/UX

### 7.1 Loading States
- [ ] Verificar que todas las pantallas muestran indicadores de carga mientras cargan datos
- [ ] Verificar que los botones muestran loading mientras procesan acciones

### 7.2 Error Messages
- [ ] Verificar que todos los errores se muestran en español
- [ ] Verificar que los mensajes de error son claros y descriptivos
- [ ] Verificar que errores de permisos muestran mensajes apropiados

### 7.3 Empty States
- [ ] Verificar que las listas vacías muestran mensajes apropiados
- [ ] Verificar que no hay tareas muestra "No hay tareas activas"
- [ ] Verificar que no hay completaciones pendientes muestra mensaje apropiado
- [ ] Verificar que no hay eventos muestra mensaje apropiado

---

## Notas de Testing

- Todas las operaciones high-risk (approve/reject completion, add ledger entry) deben ir a través de Firebase Functions
- Las validaciones de permisos deben hacerse tanto en el cliente (UX) como en el servidor (Functions) y Firestore Rules (seguridad)
- Los audit logs son inmutables (append-only)
- El ledger es inmutable (append-only)
- Task completions no se pueden actualizar desde el cliente (solo desde Functions)

