# Script para limpiar cache de Expo/Metro
Write-Host "Limpiando cache de Expo/Metro..." -ForegroundColor Yellow

# Limpiar cache de Metro
Write-Host "1. Limpiando cache de Metro bundler..." -ForegroundColor Cyan
npx expo start --clear

# Limpiar cache de npm
Write-Host "2. Limpiando cache de npm..." -ForegroundColor Cyan
npm cache clean --force

# Limpiar node_modules y reinstalar (opcional, descomenta si es necesario)
# Write-Host "3. Eliminando node_modules..." -ForegroundColor Cyan
# Remove-Item -Recurse -Force node_modules
# Write-Host "4. Reinstalando dependencias..." -ForegroundColor Cyan
# npm install --legacy-peer-deps

Write-Host "`nCache limpiado! Ahora ejecuta: npm start" -ForegroundColor Green

