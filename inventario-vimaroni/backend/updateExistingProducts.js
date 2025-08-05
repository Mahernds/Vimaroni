const mongoose = require('mongoose');
const Producto = require('./models/Producto');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/vimaroni', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function updateExistingProducts() {
    try {
        console.log('Iniciando actualización de productos existentes...');
        
        // Buscar productos que no tienen createdBy o createdAt
        const productosSinTracking = await Producto.find({
            $or: [
                { createdBy: { $exists: false } },
                { createdAt: { $exists: false } }
            ]
        });
        
        console.log(`Encontrados ${productosSinTracking.length} productos sin tracking`);
        
        // Actualizar cada producto
        for (const producto of productosSinTracking) {
            await Producto.findByIdAndUpdate(producto._id, {
                createdBy: producto.createdBy || 'sistema',
                createdAt: producto.createdAt || new Date()
            });
            console.log(`Actualizado producto: ${producto.nombre}`);
        }
        
        console.log('✅ Actualización completada');
        
        // Mostrar todos los productos con sus campos
        const todosLosProductos = await Producto.find();
        console.log('\n📋 Productos en la base de datos:');
        todosLosProductos.forEach(p => {
            console.log(`- ${p.nombre} | Creado por: ${p.createdBy} | Fecha: ${p.createdAt}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateExistingProducts();
