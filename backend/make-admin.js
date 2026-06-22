/**
 * Script para promover um usuário para admin no MongoDB Atlas
 * Uso: node make-admin.js seu@email.com
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

const email = process.argv[2];

if (!email) {
  console.log('❌ Informe o e-mail: node make-admin.js seu@email.com');
  process.exit(1);
}

async function promoverAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado ao Atlas');

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      console.log(`❌ Usuário com e-mail "${email}" não encontrado.`);
      console.log('   Verifique se o e-mail está correto e se o usuário já se cadastrou.');
      return;
    }

    usuario.role = 'admin';
    await usuario.save();

    console.log(`✅ Sucesso! "${usuario.nome}" (${usuario.email}) agora é ADMIN.`);
    console.log('   Faça logout e login novamente para as permissões serem aplicadas.');

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

promoverAdmin();
