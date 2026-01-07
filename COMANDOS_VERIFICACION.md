# 🚀 COMANDOS DE VERIFICACIÓN RÁPIDA

**Ejecuta estos comandos para verificar que todo está correcto.**

---

## 📊 VERIFICACIÓN DE ARCHIVOS

### **Contar archivos .native.\* (debe ser 71)**

```powershell
Get-ChildItem -Recurse -Path "src/components/ui","src/components/familyhub","app/(tabs)/familyhub" -Filter "*.native.*" | Measure-Object | Select-Object Count
```

### **Contar archivos .web.\* (debe ser 71)**

```powershell
Get-ChildItem -Recurse -Path "src/components/ui","src/components/familyhub","app/(tabs)/familyhub" -Filter "*.web.*" | Measure-Object | Select-Object Count
```

### **Verificar que todos los screens tienen export default**

```powershell
Select-String -Path "app/(tabs)/familyhub/*.native.tsx" -Pattern "export default" | Measure-Object | Select-Object Count
# Debe mostrar: 10
```

---

## 🔍 VERIFICACIÓN DE DEPENDENCIAS

### **Verificar que NO hay imports web-only en .native.\***

```powershell
Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "lucide-react|@radix-ui|motion/react|framer-motion|tailwind-merge" | Measure-Object | Select-Object Count
# Debe mostrar: 0
```

### **Verificar que expo-linear-gradient está instalado**

```powershell
Get-Content package.json | Select-String "expo-linear-gradient"
# Debe mostrar la línea con la dependencia
```

### **Verificar que hay imports de @expo/vector-icons en componentes nativos**

```powershell
Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "@expo/vector-icons" | Measure-Object | Select-Object Count
# Debe mostrar: múltiples matches
```

---

## 📦 VERIFICACIÓN DE IMPORTS

### **Verificar que NO hay imports a /Recursos**

```powershell
Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "Recursos" | Measure-Object | Select-Object Count
# Debe mostrar: 0
```

### **Verificar que NO hay imports @/app/**

```powershell
Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "@/app/" | Measure-Object | Select-Object Count
# Debe mostrar: 0
```

---

## 🧪 VERIFICACIÓN DE COMPILACIÓN

### **TypeScript (esperar errores de web-only deps, OK)**

```bash
npx tsc --noEmit
```

### **Web Build (debe mostrar Figma UI)**

```bash
npx expo start --web
```

### **Native Build (debe compilar con componentes RN)**

```bash
npx expo start
```

---

## 📋 VERIFICACIÓN DE COMPONENTES

### **Verificar que button.native.tsx usa Pressable**

```powershell
Get-Content "src/components/ui/button.native.tsx" | Select-String "Pressable|StyleSheet"
# Debe mostrar matches
```

### **Verificar que AppHeader.native.tsx usa Ionicons**

```powershell
Get-Content "src/components/familyhub/AppHeader.native.tsx" | Select-String "Ionicons|StyleSheet"
# Debe mostrar matches
```

### **Verificar que home.native.tsx tiene export default**

```powershell
Get-Content "app/(tabs)/familyhub/home.native.tsx" | Select-String "export default"
# Debe mostrar match
```

---

## 🎯 VERIFICACIÓN COMPLETA (Script PowerShell)

**Ejecuta este script para verificar todo de una vez:**

```powershell
Write-Host "=== VERIFICACIÓN DE INTEGRACIÓN FIGMA ===" -ForegroundColor Cyan
Write-Host ""

# Contar archivos
$nativeCount = (Get-ChildItem -Recurse -Path "src/components/ui","src/components/familyhub","app/(tabs)/familyhub" -Filter "*.native.*" | Measure-Object).Count
$webCount = (Get-ChildItem -Recurse -Path "src/components/ui","src/components/familyhub","app/(tabs)/familyhub" -Filter "*.web.*" | Measure-Object).Count

Write-Host "Archivos .native.*: $nativeCount (esperado: 71)" -ForegroundColor $(if ($nativeCount -eq 71) { "Green" } else { "Red" })
Write-Host "Archivos .web.*: $webCount (esperado: 71)" -ForegroundColor $(if ($webCount -eq 71) { "Green" } else { "Red" })
Write-Host ""

# Verificar exports default en screens
$defaultExports = (Select-String -Path "app/(tabs)/familyhub/*.native.tsx" -Pattern "export default" | Measure-Object).Count
Write-Host "Screens con export default: $defaultExports (esperado: 10)" -ForegroundColor $(if ($defaultExports -eq 10) { "Green" } else { "Red" })
Write-Host ""

# Verificar que NO hay imports web-only en .native.*
$webOnlyImports = (Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "lucide-react|@radix-ui|motion/react|framer-motion|tailwind-merge" | Measure-Object).Count
Write-Host "Imports web-only en .native.*: $webOnlyImports (esperado: 0)" -ForegroundColor $(if ($webOnlyImports -eq 0) { "Green" } else { "Red" })
Write-Host ""

# Verificar que expo-linear-gradient está instalado
$hasLinearGradient = (Get-Content package.json | Select-String "expo-linear-gradient")
Write-Host "expo-linear-gradient instalado: $(if ($hasLinearGradient) { "Sí" } else { "No" })" -ForegroundColor $(if ($hasLinearGradient) { "Green" } else { "Red" })
Write-Host ""

# Verificar que hay imports de @expo/vector-icons
$expoIconsImports = (Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "@expo/vector-icons" | Measure-Object).Count
Write-Host "Imports de @expo/vector-icons: $expoIconsImports (esperado: > 0)" -ForegroundColor $(if ($expoIconsImports -gt 0) { "Green" } else { "Red" })
Write-Host ""

# Verificar que NO hay imports a /Recursos
$recursosImports = (Select-String -Path "src/**/*.native.*","app/**/*.native.*" -Pattern "Recursos" | Measure-Object).Count
Write-Host "Imports a /Recursos: $recursosImports (esperado: 0)" -ForegroundColor $(if ($recursosImports -eq 0) { "Green" } else { "Red" })
Write-Host ""

Write-Host "=== VERIFICACIÓN COMPLETA ===" -ForegroundColor Cyan
```

---

## ✅ RESULTADOS ESPERADOS

| Verificación                   | Resultado Esperado |
| ------------------------------ | ------------------ |
| Archivos .native.\*            | 71                 |
| Archivos .web.\*               | 71                 |
| Screens con export default     | 10                 |
| Imports web-only en .native.\* | 0                  |
| expo-linear-gradient instalado | Sí                 |
| Imports de @expo/vector-icons  | > 0                |
| Imports a /Recursos            | 0                  |

---

## 🚨 SI ALGO FALLA

1. **Revisar el archivo específico** mencionado en el error
2. **Consultar `INFORME_FINAL_INTEGRACION_FIGMA.md`** para detalles
3. **Revisar `CHECKLIST_VERIFICACION.md`** para verificación paso a paso
4. **Verificar que se siguieron los pasos correctamente**

---

**✅ Si todas las verificaciones pasan, el proyecto está listo para desarrollo.**
