const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: String,
    marca: String,
    sku: String,
    stock: Number,
    zona: String,
    contenedor: String
});

module.exports = mongoose.model('Producto', productoSchema);