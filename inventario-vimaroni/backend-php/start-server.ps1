# Script para iniciar servidor PHP local para pruebas
# Ejecutar desde la carpeta backend-php

Write-Host "Iniciando servidor PHP local para Vimaroni..."
Write-Host "Asegurate de tener PHP instalado y accesible desde PATH"
Write-Host ""

# Verificar si PHP está instalado
try {
    $phpVersion = php -v 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PHP encontrado:" -ForegroundColor Green
        Write-Host ($phpVersion -split "`n")[0]
    }
} catch {
    Write-Host "❌ PHP no encontrado. Instala PHP desde: https://windows.php.net/download/" -ForegroundColor Red
    Write-Host "O instala XAMPP: https://www.apachefriends.org/download.html" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Iniciando servidor en http://localhost:8000" -ForegroundColor Cyan
Write-Host "📊 Frontend disponible en: http://localhost:8000" -ForegroundColor Yellow  
Write-Host "🔌 APIs disponibles en:" -ForegroundColor Yellow
Write-Host "   - http://localhost:8000/api/usuarios" -ForegroundColor Gray
Write-Host "   - http://localhost:8000/api/productos" -ForegroundColor Gray
Write-Host ""
Write-Host "Para detener el servidor presiona Ctrl+C" -ForegroundColor Magenta
Write-Host ""

# Copiar archivos del frontend al directorio actual
Copy-Item "..\frontend\*" "." -Recurse -Force

# Iniciar servidor PHP
php -S localhost:8000
