const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Conexión a MongoDB local (cambia la URI si usas Atlas)
mongoose.connect('mongodb://localhost:27017/vimaroni', { useNewUrlParser: true, useUnifiedTopology: true });

// Rutas
const productosRouter = require('./routes/productos');
app.use('/api/productos', productosRouter);

app.listen(3001, () => {
    console.log('Servidor backend corriendo en http://localhost:3001');
});