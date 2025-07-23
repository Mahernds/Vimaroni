# 🔐 CONFIGURACIÓN DE SEGURIDAD BÁSICA

## 📂 Estructura recomendada en Hostinger:

```
public_html/
├── index.html (página principal falsa o vacía)
├── robots.txt (bloquear bots)
├── sistema/
│   ├── admin/
│   │   ├── v2025/
│   │   │   ├── index.html (tu inventario REAL)
│   │   │   ├── style.css
│   │   │   ├── script.js
│   │   │   └── assets/
└── .htaccess (reglas de seguridad)
```

## 🌐 URL Final:
**https://tudominio.com/sistema/admin/v2025/**

## 📄 Archivos de seguridad a crear:

### 1. robots.txt
```
User-agent: *
Disallow: /sistema/
Disallow: /admin/
Disallow: /v2025/
```

### 2. .htaccess (en carpeta sistema/)
```
# Bloquear acceso directo a archivos
<Files "*.js">
  Order Allow,Deny
  Allow from all
</Files>

# Headers de seguridad
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
```

### 3. Meta tags en index.html
```html
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="googlebot" content="noindex, nofollow">
```

## 🔒 Seguridad adicional opcional:

### Opción A: Password simple JavaScript
```javascript
const correctPassword = "vimaroni2025";
const userPassword = prompt("Código de acceso:");
if (userPassword !== correctPassword) {
    window.location.href = "https://google.com";
}
```

### Opción B: Restricción por IP (en .htaccess)
```
# Solo permitir tu IP de oficina
<RequireAll>
    Require ip 192.168.1.0/24
    Require ip TU.IP.PUBLICA.AQUI
</RequireAll>
```

## 📱 Recomendaciones de uso:

1. **Nunca compartas** la URL completa en emails/mensajes
2. **Marca como favorito** en browsers de confianza
3. **Usa HTTPS** siempre
4. **Cambia la URL** cada 6-12 meses si es necesario

## 🚨 Señales de que necesitas más seguridad:
- Accesos extraños en logs
- Múltiples usuarios externos
- Información financiera sensible
- Competencia en el sector

## ✅ Ventajas de este método:
- ✅ Fácil de implementar
- ✅ No complica el uso diario
- ✅ Suficiente para mayoría de casos
- ✅ Siempre puedes agregar más seguridad después
