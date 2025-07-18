const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Obtener todos los productos
router.get('/', async (req, res) => {
    const productos = await Producto.find();
    res.json(productos);
});

// Buscar producto por nombre o SKU
router.get('/buscar', async (req, res) => {
    const { q } = req.query;
    const productos = await Producto.find({
        $or: [
            { nombre: { $regex: q, $options: 'i' } },
            { sku: { $regex: q, $options: 'i' } }
        ]
    });
    res.json(productos);
});

// Agregar producto
router.post('/', async (req, res) => {
    const producto = new Producto(req.body);
    await producto.save();
    res.json(producto);
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});
// Editar producto
router.put('/:id', async (req, res) => {
    // Busca si ya existe OTRO producto con la misma zona, contenedor y SKU
    const existe = await Producto.findOne({
        _id: { $ne: req.params.id },
        zona: req.body.zona,
        contenedor: req.body.contenedor,
        sku: req.body.sku
    });
    if (existe) {
        return res.status(400).json({ error: 'Ya existe otro producto con esa zona, contenedor y SKU.' });
    }
    // Si no hay duplicado, actualiza normalmente
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(producto);
});

module.exports = router;