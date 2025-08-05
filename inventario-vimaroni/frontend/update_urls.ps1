# Script para actualizar URLs de API en el frontend
$filePath = "index.html"
$content = Get-Content $filePath -Raw

# Reemplazar todas las ocurrencias de '${API_BASE_URL}' con `${API_BASE_URL}`
$content = $content -replace "'`\$`{API_BASE_URL`}'", '`${API_BASE_URL}`'

# Guardar el archivo
Set-Content $filePath $content -NoNewline

Write-Host "URLs actualizadas correctamente"
