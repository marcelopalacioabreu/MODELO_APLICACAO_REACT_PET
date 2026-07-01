const path = require('path');
const backendSrc = path.join(__dirname, '../../src');
require(path.join(backendSrc,'models','Campaign'));
require(path.join(backendSrc,'models','Permission'));
require(path.join(backendSrc,'models','Role'));
require(path.join(backendSrc,'models','User'));
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = mongoose.model('User');
const Role = mongoose.model('Role');
const Permission = mongoose.model('Permission');

const syncAllRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Sincronização] Conectado ao MongoDB no Container...');

    // 1. Sincronizar Role ADMIN
    const allPerms = await Permission.find({});
    const allIds = allPerms.map(p => p._id);
    const allKeys = allPerms.map(p => p.key);

    const adminRole = await Role.findOneAndUpdate(
      { name: 'ADMIN' },
      { 
        description: 'Administrador do sistema - Acesso total',
        permissions: allIds,
        permissionKeys: allKeys,
        status: 'ACTIVE'
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Role ADMIN sincronizada (${allKeys.length} chaves).`);

    // 2. Sincronizar Role COMUM
    /*
    const comumKeys = ['doc.view', 'doc.create.own', 'doc.update'];
    const comumPerms = await Permission.find({ key: { $in: comumKeys } });
    
    await Role.findOneAndUpdate(
      { name: 'COMUM' },
      { 
        description: 'Perfil do Cidadão / Tutor',
        permissions: comumPerms.map(p => p._id),
        permissionKeys: comumKeys,
        status: 'ACTIVE'
      },
      { upsert: true }
    );
    console.log(`✅ Role COMUM sincronizada (${comumKeys.length} chaves).`);
    */

    process.exit(0);
  } catch (error) {
    console.error('❌ [Sincronização] Erro:', error.message);
    process.exit(1);
  }
};

syncAllRoles();


