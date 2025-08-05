# 🚀 INSTALACIÓN STOCKALMENDROS.CL - LISTA PARA SUBIR

## ✅ **CONFIGURACIÓN COMPLETADA**

Tu sistema Vimaroni ya está **100% configurado** con los datos de Planeta Hosting:

### 📊 **Datos Configurados:**
- **🌐 Dominio:** stockalmendros.cl
- **🗄️ Base de datos:** stockalm_admin  
- **👤 Usuario MySQL:** stockalm_admin
- **🖥️ Servidor MySQL:** 10537planeta.dedicados.cl

---

## 📁 **ARCHIVOS LISTOS PARA SUBIR**

### 1. **Archivos del Frontend** → Subir a la raíz de tu hosting
```
Copiar estos archivos a public_html/ o httpdocs/:
✅ index.html
✅ style.css  
✅ config-frontend.js (configurado con stockalmendros.cl)
✅ logooo.png
✅ mapa-almendros.jpg
```

### 2. **Archivos del Backend** → Subir a carpeta api/
```
Crear carpeta api/ y copiar:
✅ config-hosting.php (configurado con tu BD)
✅ database-hosting.sql
✅ install.php (pre-configurado)
✅ security-hosting.php
✅ usuarios.php
✅ productos.php
```

---

## 🔧 **INSTALACIÓN EN 4 PASOS**

### **Paso 1: Subir Archivos**
1. Conecta por FTP/cPanel a tu hosting Planeta
2. Sube archivos de `frontend/` a la raíz (public_html)
3. Crea carpeta `api/` y sube archivos de `backend-php/`

### **Paso 2: Obtener Contraseña MySQL**
1. Ve al panel de Planeta Hosting
2. Busca la sección "Bases de Datos MySQL"
3. Copia la contraseña del usuario `stockalm_admin`

### **Paso 3: Configurar Contraseña**
1. Edita el archivo `api/config-hosting.php`
2. Busca la línea: `'password' => 'AQUI_TU_CONTRASEÑA_MYSQL'`
3. Reemplaza con tu contraseña real: `'password' => 'tu_contraseña_real'`

### **Paso 4: Ejecutar Instalador**
1. Ve a: **https://stockalmendros.cl/api/install.php**
2. Los datos ya están pre-configurados
3. Solo ingresa la contraseña MySQL
4. Click "Instalar Vimaroni"

---

## 🔐 **CREDENCIALES POR DEFECTO**

Una vez instalado, podrás acceder con:

| Usuario    | Contraseña | Rol         |
|------------|------------|-------------|
| admin      | admin123   | Administrador |
| supervisor | super123   | Supervisor  |
| bodeguero  | bodega123  | Bodeguero   |
| operador   | oper123    | Operador    |

**⚠️ Cambiar contraseñas desde el panel admin después de la instalación**

---

## 📂 **ESTRUCTURA EN TU HOSTING**

```
stockalmendros.cl/
├── index.html              ← Página principal
├── style.css              ← Estilos
├── config-frontend.js     ← Configuración (✅ configurado)
├── logooo.png            ← Logo
├── mapa-almendros.jpg    ← Mapa
└── api/
    ├── config-hosting.php     ← Configuración BD (⚠️ falta contraseña)
    ├── install.php           ← Instalador (✅ pre-configurado)
    ├── database-hosting.sql  ← Script de BD
    ├── security-hosting.php  ← Seguridad
    ├── usuarios.php         ← API usuarios
    └── productos.php        ← API productos
```

---

## ✅ **VERIFICACIÓN POST-INSTALACIÓN**

### 1. **Probar Acceso**
- Ve a: **https://stockalmendros.cl**
- Login: admin / admin123
- Verificar que carguen todos los paneles

### 2. **Cambiar Contraseñas**
- Panel Admin → Gestión de Usuarios
- Editar cada usuario y asignar contraseñas seguras

### 3. **Probar Funcionalidades**
- Agregar un producto de prueba
- Verificar búsqueda
- Probar mapa del galpón

---

## 🛡️ **SEGURIDAD INCLUIDA**

✅ **Autenticación JWT** con expiración 24h  
✅ **Contraseñas encriptadas** con bcrypt  
✅ **Rate limiting** anti fuerza bruta  
✅ **Headers de seguridad** empresarial  
✅ **Protección SQL injection**  
✅ **Control de roles** granular  
✅ **CORS configurado** para tu dominio  

---

## 📞 **SI NECESITAS AYUDA**

### 🔧 **Problemas Comunes:**
- **Error de conexión BD:** Verifica la contraseña MySQL
- **Página en blanco:** Revisa que todos los archivos se subieron
- **Error 404 en API:** Verifica que la carpeta api/ existe

### 📧 **Contacto:**
- Revisa los logs de error en tu cPanel
- Verifica permisos de archivos (644 para PHP)

---

## 🎉 **¡YA TIENES TODO LISTO!**

**Solo necesitas:**
1. ✅ Subir los archivos (5 minutos)
2. ⚠️ Conseguir tu contraseña MySQL de Planeta
3. ✅ Ejecutar el instalador (2 minutos)

**¡Tu sistema estará funcionando en stockalmendros.cl en menos de 10 minutos!** 🚀
