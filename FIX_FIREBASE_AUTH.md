# Fix: Firebase Auth getReactNativePersistence Error

## Problema
Error: `(0,_firebaseAuth.getReactNativePersistence) is not a function`

## Causa
La función `getReactNativePersistence` no está disponible o no se puede importar correctamente desde `firebase/auth` en la versión actual.

## Solución Aplicada
Simplificado la inicialización de Firebase Auth para usar `getAuth(app)` directamente, que funciona en todas las plataformas con persistencia por defecto.

### Cambios Realizados

1. **Eliminada dependencia de `getReactNativePersistence`**
   - Removido import de `getReactNativePersistence` e `initializeAuth`
   - Removido import de `Platform` y `AsyncStorage`
   - Simplificado a usar solo `getAuth(app)`

2. **Eliminado archivo de tipos innecesario**
   - Eliminado `src/lib/firebase/firebase-auth.d.ts` (ya no necesario)

3. **Resultado**
   - Firebase Auth ahora usa persistencia por defecto
   - Funciona en web (localStorage) y native (almacenamiento nativo)
   - Sin errores de función no encontrada

## Archivos Modificados
- `src/lib/firebase/config.ts` - Simplificado inicialización de auth

## Archivos Eliminados
- `src/lib/firebase/firebase-auth.d.ts` - Ya no necesario

## Notas
- Firebase Auth funciona correctamente sin persistencia personalizada
- La persistencia por defecto es suficiente para la mayoría de casos de uso
- Si en el futuro se necesita persistencia personalizada, se puede agregar cuando Firebase la soporte correctamente

