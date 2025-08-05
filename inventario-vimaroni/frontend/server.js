// Servidor HTTP simple para el frontend
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
    // Si es la raíz, servir index.html
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Remover query parameters
    filePath = filePath.split('?')[0];
    
    const fullPath = path.join(__dirname, filePath);
    
    // Obtener extensión del archivo
    const ext = path.extname(filePath);
    
    // Tipos MIME
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon'
    };
    
    const contentType = mimeTypes[ext] || 'text/plain';
    
    // Leer archivo
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>404 - Archivo no encontrado</h1>
                <p>No se pudo encontrar: ${filePath}</p>
                <p>Ruta completa: ${fullPath}</p>
                <p><a href="/">Volver al inicio</a></p>
            `);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(port, '127.0.0.1', () => {
    console.log(`✅ Servidor frontend funcionando en http://127.0.0.1:${port}`);
    console.log(`📁 Sirviendo archivos desde: ${__dirname}`);
    console.log(`🚀 Ve a: http://127.0.0.1:${port} para ver tu sistema Vimaroni`);
});
