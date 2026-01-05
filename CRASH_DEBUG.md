# 🔍 Debug del Crash - String → Boolean

## Stack Trace Analizado

```
java.lang.String cannot be cast to java.lang.Boolean
at setProperty (SourceFile:642)
at updateProperties (SourceFile:35)
at createViewInstance (SourceFile:7)
at createView (SourceFile:1)
at RNSScreenManagerDelegate
```

**Interpretación:**
- El error ocurre en `RNSScreenManagerDelegate` (react-native-screens)
- React Native está intentando pasar un **string** a una prop que espera **boolean**
- Esto sucede durante el renderizado de un componente Screen o Modal

## Posibles Causas

### 1. Modal `visible` prop
En `app/(admin)/members.tsx:160`:
```typescript
<Modal visible={showRingModal} ... />
```
Si `showRingModal` viene de algún estado que se inicializa con datos de Firestore sin normalizar, podría ser string.

### 2. AttentionMode props
En `app/(admin)/members.tsx:198`:
```typescript
selectedMember?.attentionMode?.enabled
```
Si `attentionMode.enabled` viene directamente de Firestore sin normalizar, podría ser string `"false"`.

### 3. Task props en renderizado condicional
En `app/(tabs)/tasks/index.tsx:95`:
```typescript
{item.requiresApproval && ...}
```
Si `item.requiresApproval` es string `"false"`, la condición se evalúa como `true` en JS, pero React Native puede intentar pasarlo como boolean a algún componente nativo.

## Solución Inmediata

Necesitamos asegurar que **TODOS** los datos que vienen de Firestore y se usan en props booleanas estén normalizados **antes** de llegar al componente.

### Verificar Stores
Los stores deben normalizar datos al recibirlos de Firestore.

### Verificar Componentes
Cualquier prop boolean que venga de datos de Firestore debe usar `toBool()` antes de pasarse al componente.

## Próximo Paso

Revisar `src/lib/db/members.ts` para ver si normaliza `attentionMode.enabled` y `attentionMode.allowLoud` correctamente.

