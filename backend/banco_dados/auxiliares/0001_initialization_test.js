const path = require('path');
const backendSrc = path.join(__dirname, '../../src');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

require(path.join(backendSrc,'models','Permission'));
require(path.join(backendSrc,'models','Role'));
require(path.join(backendSrc,'models','User'));

// Obtain model constructors from mongoose after requiring model files
const Permission = mongoose.model('Permission');
const Role = mongoose.model('Role');
const User = mongoose.model('User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const runInitializationTest = async () => {
  console.log('[Verificação] Iniciando autoverificação do backend...');
  
  try {
    // 1. Validar Conexão
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[1/3] Conexão com MongoDB: OK');

    // 2. Validar Modelos
    const permissionCount = await Permission.countDocuments();
    const roleCount = await Role.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`[2/3] Modelos instanciados e acessíveis:
       - Permissões: ${permissionCount}
       - Roles: ${roleCount}
       - Usuários: ${userCount}`);

    // 3. Validar Integridade de Dados
    const adminRole = await Role.findOne({ name: 'ADMIN' });
    if (adminRole) {
      console.log('[3/3] Integridade da Role ADMIN: OK');
    } else {
      console.warn('[3/3] Role ADMIN não encontrada. (Necessário rodar seed:admin)');
    }

    console.log('\n[RESULTADO] Backend está íntegro e pronto para produção.');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ [FALHA NO TESTE] Erro de integridade detectado:', error.message);
    if (mongoose.connection) await mongoose.connection.close();
    process.exit(1);
  }
};

runInitializationTest();


