const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: String,
    marca: String,
    sku: String,
    stock: Number,
    zona: String,
    contenedor: String,
    createdBy: { type: String, default: 'desconocido' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Producto', productoSchema);