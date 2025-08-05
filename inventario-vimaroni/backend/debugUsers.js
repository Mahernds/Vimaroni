const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/vimaroni_inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function debugUsers() {
    try {
        console.log('🔍 VERIFICANDO USUARIOS EN LA BASE DE DATOS...\n');
        
        // Obtener todos los usuarios
        const usuarios = await Usuario.find({});
        
        if (usuarios.length === 0) {
            console.log('❌ NO HAY USUARIOS EN LA BASE DE DATOS');
            console.log('🔧 Creando usuarios iniciales...\n');
            
            // Crear usuarios con contraseñas hasheadas
            const adminPassword = await bcrypt.hash('admin123', 10);
            const supervisorPassword = await bcrypt.hash('super123', 10);
            const bodegueroPassword = await bcrypt.hash('bodega123', 10);
            
            const usuariosIniciales = [
                {
                    username: 'admin',
                    password: adminPassword,
                    role: 'admin',
                    fullName: 'Administrador',
                    createdBy: 'system',
                    active: true
                },
                {
                    username: 'supervisor1',
                    password: supervisorPassword,
                    role: 'supervisor',
                    fullName: 'Supervisor Principal',
                    createdBy: 'admin',
                    active: true
                },
                {
                    username: 'bodeguero1',
                    password: bodegueroPassword,
                    role: 'bodeguero',
                    fullName: 'Bodeguero Principal',
                    createdBy: 'admin',
                    active: true
                }
            ];
            
            await Usuario.insertMany(usuariosIniciales);
            console.log('✅ USUARIOS CREADOS CORRECTAMENTE');
        } else {
            console.log(`📊 ENCONTRADOS ${usuarios.length} USUARIOS:\n`);
            
            usuarios.forEach((user, index) => {
                console.log(`${index + 1}. Username: ${user.username}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Full Name: ${user.fullName}`);
                console.log(`   Active: ${user.active}`);
                console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
                console.log(`   Created: ${user.createdAt || 'N/A'}`);
                console.log('');
            });
        }
        
        // Testear las contraseñas
        console.log('🔐 TESTEANDO CREDENCIALES...\n');
        
        const testCredentials = [
            { username: 'admin', password: 'admin123' },
            { username: 'supervisor1', password: 'super123' },
            { username: 'bodeguero1', password: 'bodega123' }
        ];
        
        for (const cred of testCredentials) {
            const user = await Usuario.findOne({ username: cred.username.toLowerCase(), active: true });
            
            if (user) {
                const isValid = await bcrypt.compare(cred.password, user.password);
                console.log(`${cred.username}/${cred.password}: ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
                
                if (!isValid) {
                    console.log(`   🔧 Regenerando contraseña para ${cred.username}...`);
                    const newHash = await bcrypt.hash(cred.password, 10);
                    await Usuario.updateOne(
                        { username: cred.username.toLowerCase() },
                        { password: newHash }
                    );
                    console.log(`   ✅ Contraseña actualizada para ${cred.username}`);
                }
            } else {
                console.log(`${cred.username}: ❌ USUARIO NO ENCONTRADO`);
            }
        }
        
        console.log('\n🎉 DIAGNÓSTICO COMPLETADO');
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    } finally {
        mongoose.disconnect();
    }
}

debugUsers();
