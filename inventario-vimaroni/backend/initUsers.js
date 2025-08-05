const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/vimaroni', { useNewUrlParser: true, useUnifiedTopology: true });

const usuariosIniciales = [
    {
        username: 'admin',
        password: 'Malloco1#',
        role: 'admin',
        fullName: 'Administrador Principal',
        createdBy: 'system'
    },
    {
        username: 'supervisor',
        password: 'vimaroni2332',
        role: 'supervisor',
        fullName: 'Supervisor General',
        createdBy: 'system'
    },
    {
        username: 'bodeguero',
        password: 'vimaroni2332',
        role: 'bodeguero',
        fullName: 'Bodeguero Principal',
        createdBy: 'system'
    },
    {
        username: 'operador',
        password: 'vimaroni2332',
        role: 'operador',
        fullName: 'Operador General',
        createdBy: 'system'
    },
    {
        username: 'maher',
        password: 'vimaroni2332',
        role: 'admin',
        fullName: 'Maher',
        createdBy: 'system'
    }
];

async function initializeUsers() {
    try {
        // Verificar si ya existen usuarios
        const existingUsers = await Usuario.countDocuments();
        
        if (existingUsers === 0) {
            console.log('Inicializando usuarios por defecto...');
            
            for (const userData of usuariosIniciales) {
                const usuario = new Usuario(userData);
                await usuario.save();
                console.log(`Usuario creado: ${userData.username} (${userData.role})`);
            }
            
            console.log('Usuarios inicializados correctamente');
        } else {
            console.log(`Ya existen ${existingUsers} usuarios en la base de datos`);
        }
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error al inicializar usuarios:', error);
        mongoose.connection.close();
    }
}

initializeUsers();
