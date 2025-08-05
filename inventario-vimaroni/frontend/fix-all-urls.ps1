# Script mejorado para corregir todas las URLs problemáticas
$filePath = "index.html"
$content = Get-Content $filePath -Raw

# Reemplazar todas las referencias de API_BASE_URL
$content = $content -replace "\'\$\{API_BASE_URL\}", "'http://127.0.0.1:3001"
$content = $content -replace "`\$\{API_BASE_URL`}", "http://127.0.0.1:3001"

# Guardar el archivo
Set-Content $filePath $content -NoNewline

Write-Host "Todas las URLs corregidas para uso local"
