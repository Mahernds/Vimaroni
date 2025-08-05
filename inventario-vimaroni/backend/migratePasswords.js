const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario');

// Cargar variables de entorno
require('dotenv').config();

async function migrarPasswords() {
    try {
        // Conectar a MongoDB con la misma configuración que initUsers.js
        await mongoose.connect('mongodb://localhost:27017/vimaroni', { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log('✅ Conectado a MongoDB');

        // Obtener todos los usuarios
        const usuarios = await Usuario.find({});
        console.log(`📊 Encontrados ${usuarios.length} usuarios`);

        for (const usuario of usuarios) {
            // Verificar si la contraseña ya está hasheada (bcrypt hashes empiezan con $2a$, $2b$, etc.)
            if (!usuario.password.startsWith('$2')) {
                console.log(`🔄 Migrando contraseña para: ${usuario.username}`);
                
                // Hash de la contraseña
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(usuario.password, saltRounds);
                
                // Actualizar el usuario
                await Usuario.findByIdAndUpdate(usuario._id, {
                    password: hashedPassword
                });
                
                console.log(`✅ Contraseña migrada para: ${usuario.username}`);
            } else {
                console.log(`⏭️  Contraseña ya hasheada para: ${usuario.username}`);
            }
        }

        console.log('🎉 Migración completada exitosamente');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error en migración:', error);
        process.exit(1);
    }
}

// Ejecutar migración
migrarPasswords();
