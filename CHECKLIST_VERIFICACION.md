# ✅ CHECKLIST DE VERIFICACIÓN - INTEGRACIÓN FIGMA

**Usa este checklist para verificar que todo esté correcto antes de continuar.**

---

## 📁 ESTRUCTURA DE ARCHIVOS

### **Componentes UI Base**
- [ ] Verificar que existen 48 archivos `.web.tsx` en `src/components/ui/`
- [ ] Verificar que existen 48 archivos `.native.tsx` en `src/components/ui/`
- [ ] Verificar `utils.web.ts` y `utils.native.ts` existen
- [ ] Verificar `use-mobile.web.ts` y `use-mobile.native.ts` existen
- [ ] Verificar `index.web.ts` y `index.native.ts` existen (si aplica)

**Comando de verificación:**
```powershell
Get-ChildItem "src/components/ui" -Filter "*.native.*" | Measure-Object | Select-Object Count
# Debe mostrar: 50+ archivos (48 componentes + utils + use-mobile + index)
```

### **Componentes FamilyHub**
- [ ] Verificar que existen 13 archivos `.web.tsx` en `src/components/familyhub/`
- [ ] Verificar que existen 13 archivos `.native.tsx` en `src/components/familyhub/`
- [ ] Verificar `index.web.ts` y `index.native.ts` existen
- [ ] Verificar `Toast.web.tsx` y `Toast.native.tsx` existen

**Comando de verificación:**
```powershell
Get-ChildItem "src/components/familyhub" -Filter "*.native.*" | Measure-Object | Select-Object Count
# Debe mostrar: 15 archivos (13 componentes + index + Toast)
```

### **Screens Expo Router**
- [ ] Verificar que existen 10 archivos `.web.tsx` en `app/(tabs)/familyhub/`
- [ ] Verificar que existen 10 archivos `.native.tsx` en `app/(tabs)/familyhub/`
- [ ] Verificar que `index.web.tsx` y `index.native.tsx` existen

**Comando de verificación:**
```powershell
Get-ChildItem "app/(tabs)/familyhub" -Filter "*.native.*" | Measure-Object | Select-Object Count
# Debe mostrar: 10 archivos
```

---

## 🔍 VERIFICACIÓN DE EXPORTS

### **Screens (Deben tener `export default`)**
- [ ] `app/(tabs)/familyhub/index.native.tsx` tiene `export default`
- [ ] `app/(tabs)/familyhub/home.native.tsx` tiene `export default`
- [ ] `app/(tabs)/familyhub/calendar.native.tsx` tiene `export default`
- [ ] `app/(tabs)/familyhub/family.native.tsx` tiene `export default`
- [ ] `app/(tabs)/familyhub/finances.native.tsx` tiene `export default`
- [ ] `app/(tabs)/familyhub/house.native.tsx` tiene `export default`
- [ ] `app/(tabs)/familyhub/more.native.tsx` tiene `export default`
- [ ] `app/(tabs)/familyhub/personalization.native.tsx` tiene `export default`
- [ ] `app/(tabs)/familyhub/plan.native.tsx` tiene `export default`
- [ ] `app/(tabs)/familyhub/settings.native.tsx` tiene `export default`

**Comando de verificación:**
```powershell
Select-String -Path "app/(tabs)/familyhub/*.native.tsx" -Pattern "export default" | Measure-Object | Select-Object Count
# Debe mostrar: 10 matches
```

---

## 🔧 VERIFICACIÓN DE DEPENDENCIAS

### **Dependencias Instaladas**
- [ ] `expo-linear-gradient` está en `package.json`
- [ ] `@expo/vector-icons` está disponible (incluido en Expo)
- [ ] `react-native-safe-area-context` está instalado

**Comando de verificación:**
```powershell
Get-Content package.json | Select-String "expo-linear-gradient"
# Debe mostrar la línea con la dependencia
```

### **Dependencias Web-Only (NO deben estar en .native.*)**
- [ ] Verificar que NO hay imports de `lucide-react` en `.native.*`
- [ ] Verificar que NO hay imports de `@radix-ui/*` en `.native.*`
- [ ] Verificar que NO hay imports de `motion/react` o `framer-motion` en `.native.*`
- [ ] Verificar que NO hay imports de `tailwind-merge` en `.native.*`

**Comando de verificación:**
```powershell
Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "lucide-react|@radix-ui|motion/react|framer-motion|tailwind-merge" | Measure-Object | Select-Object Count
# Debe mostrar: 0 matches
```

---

## 📦 VERIFICACIÓN DE IMPORTS

### **Imports Correctos**
- [ ] No hay imports a `/Recursos` en archivos nuevos
- [ ] Los imports usan alias `@/components/ui/*` o `@/components/familyhub/*`
- [ ] No hay imports `@/app/*` (app está fuera de src)
- [ ] Los imports NO incluyen extensiones (Metro resuelve `.web`/`.native`)

**Comando de verificación:**
```powershell
Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "Recursos|@/app/" | Measure-Object | Select-Object Count
# Debe mostrar: 0 matches
```

---

## 🎨 VERIFICACIÓN DE COMPONENTES CONVERTIDOS

### **UI Base (5 componentes funcionales)**
- [ ] `button.native.tsx` - Usa `Pressable`, tiene estilos, variantes
- [ ] `input.native.tsx` - Usa `TextInput`, tiene estilos
- [ ] `card.native.tsx` - Usa `View`, tiene sub-componentes
- [ ] `badge.native.tsx` - Usa `View/Text`, tiene variantes
- [ ] `switch.native.tsx` - Usa `Switch` nativo

**Comando de verificación:**
```powershell
Get-Content "src/components/ui/button.native.tsx" | Select-String "Pressable|StyleSheet"
# Debe mostrar matches
```

### **FamilyHub (13 componentes funcionales)**
- [ ] `AppHeader.native.tsx` - Usa `View/Text/Pressable`, Ionicons
- [ ] `ListCard.native.tsx` - Usa `View/Text/Pressable`, clickable
- [ ] `StatsCard.native.tsx` - Usa `View/Text/Pressable`, gradiente
- [ ] `SummaryCard.native.tsx` - Usa `View/Text`, variantes
- [ ] `EmptyState.native.tsx` - Usa `View/Text/Pressable`, Ionicons
- [ ] `FormField.native.tsx` - Usa `TextInput`, forwardRef
- [ ] `SelectField.native.tsx` - Usa `Modal` + `Picker`
- [ ] `ToggleRow.native.tsx` - Usa `Switch`, label/description
- [ ] `HubCard.native.tsx` - Usa `View/Text/Pressable`, progreso
- [ ] `SheetFormLayout.native.tsx` - Usa `Modal`, animaciones
- [ ] `BottomNavigation.native.tsx` - Usa `View/Pressable`, tabs
- [ ] `Toast.native.tsx` - Usa `Animated.View`, animaciones

**Comando de verificación:**
```powershell
Get-Content "src/components/familyhub/AppHeader.native.tsx" | Select-String "Ionicons|StyleSheet"
# Debe mostrar matches
```

### **Screens (10 screens funcionales)**
- [ ] Todas las screens usan `View`, `Text`, `ScrollView`
- [ ] Todas las screens usan componentes FamilyHub convertidos
- [ ] Todas las screens tienen `export default`
- [ ] Todas las screens usan `StyleSheet.create()`

**Comando de verificación:**
```powershell
Get-Content "app/(tabs)/familyhub/home.native.tsx" | Select-String "View|StyleSheet|export default"
# Debe mostrar matches
```

---

## 🧪 VERIFICACIÓN DE COMPILACIÓN

### **TypeScript**
- [ ] Ejecutar `npx tsc --noEmit`
- [ ] Verificar que solo hay errores de módulos web-only (esperado)
- [ ] NO debe haber errores de sintaxis en `.native.*`

**Comando:**
```bash
npx tsc --noEmit
```

### **Web Build**
- [ ] Ejecutar `npx expo start --web`
- [ ] Verificar que compila sin errores
- [ ] Verificar que muestra la UI de Figma

**Comando:**
```bash
npx expo start --web
```

### **Native Build**
- [ ] Ejecutar `npx expo start`
- [ ] Verificar que compila sin errores
- [ ] Verificar que muestra componentes React Native

**Comando:**
```bash
npx expo start
```

---

## 📋 VERIFICACIÓN DE ICONOS

### **Iconos Convertidos**
- [ ] Verificar que NO hay imports de `lucide-react` en `.native.*`
- [ ] Verificar que hay imports de `@expo/vector-icons` en componentes nativos
- [ ] Verificar que los iconos usan nombres de Ionicons

**Comando de verificación:**
```powershell
Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "@expo/vector-icons" | Measure-Object | Select-Object Count
# Debe mostrar: múltiples matches (componentes que usan iconos)
```

---

## 🎯 VERIFICACIÓN FINAL

### **Checklist General**
- [ ] `/Recursos` está intacto (no modificado)
- [ ] Todos los archivos `.web.*` tienen su par `.native.*`
- [ ] No hay dependencias web-only en archivos nativos
- [ ] Todos los screens tienen `export default`
- [ ] Alias `@/` está configurado correctamente
- [ ] Imports están normalizados (sin `/Recursos`, usando alias)
- [ ] Iconos están convertidos a `@expo/vector-icons`
- [ ] Estilos están convertidos a `StyleSheet.create()`

---

## 🚨 PROBLEMAS CONOCIDOS (Esperados)

### **TypeScript Errors**
- ⚠️ Errores de módulos no encontrados (`lucide-react`, `@radix-ui/*`)
- ✅ **Esto es esperado** - Metro resolverá correctamente en runtime
- ✅ **No requiere acción**

### **Gradientes**
- ✅ `expo-linear-gradient` ya está instalado
- ✅ Componentes están preparados para usar gradientes

---

## 📊 RESUMEN

**Total de verificaciones:** 50+  
**Estado esperado:** ✅ Todas las verificaciones deben pasar

**Si alguna verificación falla:**
1. Revisar el archivo específico
2. Consultar `INFORME_FINAL_INTEGRACION_FIGMA.md` para detalles
3. Verificar que se siguieron los pasos correctamente

---

**✅ Si todas las verificaciones pasan, el proyecto está listo para desarrollo.**

