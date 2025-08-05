# Script para corregir URLs temporalmente
$filePath = "index.html"
$content = Get-Content $filePath -Raw

# Reemplazar template literals problemáticos
$content = $content -replace "'\$\{API_BASE_URL\}'", "'http://127.0.0.1:3001'"
$content = $content -replace '`\$\{API_BASE_URL\}`', 'http://127.0.0.1:3001'

# Guardar el archivo
Set-Content $filePath $content -NoNewline

Write-Host "URLs corregidas para uso local"
