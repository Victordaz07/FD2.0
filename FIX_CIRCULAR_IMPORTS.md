# Fix: Circular Imports - Maximum Call Stack Exceeded

## Problema
Error: "Maximum call stack size exceeded" causado por archivos base `.ts` que re-exportaban desde sí mismos, creando loops infinitos.

## Causa Raíz
Cuando los archivos base `.ts` exportaban desde `'./Component'` (sin extensión), Metro intentaba resolver `Component.ts` → que exportaba desde `'./Component'` → loop infinito.

Ejemplo del problema:
```ts
// AppHeader.ts (base)
export { AppHeader } from './AppHeader'; // ❌ Loop infinito!
```

## Solución Aplicada
Todos los archivos base `.ts` ahora re-exportan desde `.native`:

```ts
// AppHeader.ts (base)
export { AppHeader } from './AppHeader.native'; // ✅ Correcto
```

**Razón:**
- TypeScript usa estos archivos base para tipos
- Metro Bundler resuelve directamente a `.native.tsx` o `.web.tsx` cuando otros archivos importan
- Evita loops infinitos

## Archivos Corregidos

### FamilyHub Components (13 archivos)
- `AppHeader.ts`, `Toast.ts`, `ListCard.ts`, `ToggleRow.ts`
- `FormField.ts`, `EmptyState.ts`, `StatsCard.ts`, `SummaryCard.ts`
- `SelectField.ts`, `SheetFormLayout.ts`, `HubCard.ts`
- `BottomNavigation.ts`, `index.ts`

### UI Components (48 archivos)
- Todos los archivos base `.ts` en `src/components/ui/`

## Verificación
- ✅ Todos los archivos base `.ts` re-exportan desde `.native`
- ✅ Archivos `.native.ts` y `.web.ts` usan imports sin extensión (correcto)
- ✅ No hay loops de importación

## Nota Técnica
Los archivos `.native.ts` y `.web.ts` pueden usar imports sin extensión porque Metro resuelve directamente a `.native.tsx` o `.web.tsx`. Solo los archivos base `.ts` necesitan re-exportar explícitamente desde `.native` para evitar loops.

