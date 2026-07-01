const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User');
const Menu = require('../models/Menu');
const Functionality = require('../models/Functionality');
const HomePageConfig = require('../models/HomePageConfig');

const runIntegrityChecks = async () => {
  console.log('[Integridade] Sincronizando configurações...');

  try {
    // Keep integrity seeds minimal for the boilerplate: users, notes, roles, settings

    // 1. Core functionalities (minimal)
    const coreFuncs = [
      { name: 'Gestão de Usuários', key: 'USER_MGMT', module: 'ADMIN', icon: 'Users' },
      { name: 'Gestão de Notas', key: 'NOTE_MGMT', module: 'CORE', icon: 'Note' },
      { name: 'Controle de Acessos', key: 'ROLE_MGMT', module: 'ADMIN', icon: 'ShieldAlert' },
      { name: 'Configurações Globais', key: 'SETTINGS_CORE', module: 'ADMIN', icon: 'Settings' }
    ];

    const functionalityMap = {};
    for (const f of coreFuncs) {
      const doc = await Functionality.findOneAndUpdate({ key: f.key }, f, { upsert: true, new: true });
      // ensure permissions array exists but keep it in-sync only via permissions below
      if (!doc.permissions) doc.permissions = [];
      await doc.save();
      functionalityMap[f.key] = doc._id;
    }

    // 2. Minimal permissions matrix
    const permissionsMatrix = [
      { name: 'Visualizar Usuários', key: 'user.view', group: 'ADMIN', module: 'SISTEMA', category: 'READ', funcKey: 'USER_MGMT' },
      { name: 'Criar Usuários', key: 'user.create', group: 'ADMIN', module: 'SISTEMA', category: 'CREATE', funcKey: 'USER_MGMT' },
      { name: 'Editar Usuários', key: 'user.update', group: 'ADMIN', module: 'SISTEMA', category: 'UPDATE', funcKey: 'USER_MGMT' },
      { name: 'Excluir Usuários', key: 'user.delete', group: 'ADMIN', module: 'SISTEMA', category: 'DELETE', funcKey: 'USER_MGMT' },

      { name: 'Visualizar Notas', key: 'note.view', group: 'CORE', module: 'SISTEMA', category: 'READ', funcKey: 'NOTE_MGMT' },
      { name: 'Criar Notas', key: 'note.create', group: 'CORE', module: 'SISTEMA', category: 'CREATE', funcKey: 'NOTE_MGMT' },
      { name: 'Editar Notas', key: 'note.update', group: 'CORE', module: 'SISTEMA', category: 'UPDATE', funcKey: 'NOTE_MGMT' },
      { name: 'Excluir Notas', key: 'note.delete', group: 'CORE', module: 'SISTEMA', category: 'DELETE', funcKey: 'NOTE_MGMT' },

      { name: 'Gerenciar Permissões', key: 'admin.all', group: 'ADMIN', module: 'SISTEMA', category: 'SPECIAL', funcKey: 'ROLE_MGMT' }
    ];

    for (const p of permissionsMatrix) {
      const { funcKey, ...pData } = p;
      const functionalityId = functionalityMap[funcKey];
      const permDoc = await Permission.findOneAndUpdate({ key: p.key }, { ...pData, functionality: functionalityId }, { upsert: true, new: true });
      await Functionality.findByIdAndUpdate(functionalityId, { $addToSet: { permissions: permDoc._id } });
    }

    // 3. Roles
    const allPermDocs = await Permission.find({});
    const allPermIds = allPermDocs.map(p => p._id);
    const allPermKeys = allPermDocs.map(p => p.key);

    await Role.findOneAndUpdate({ name: 'ADMIN' }, { description: 'Administrador (todos os privilégios)', permissions: allPermIds, permissionKeys: allPermKeys }, { upsert: true });

    // TUTOR role: limited to viewing and creating notes (example)
    const tutorPermKeys = ['note.view', 'note.create'];
    const tutorPermDocs = await Permission.find({ key: { $in: tutorPermKeys } });
    await Role.findOneAndUpdate({ name: 'TUTOR' }, { description: 'Perfil Tutor (exemplo)', permissions: tutorPermDocs.map(p => p._id), permissionKeys: tutorPermKeys }, { upsert: true });

    // 4. Admin sidebar menu (minimal)
    const adminMenuItems = [
      { label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin', order: 1 },
      { label: 'NOTAS', icon: 'FileText', path: '/admin/notes', order: 10, permission: 'note.view' },
      { label: 'USUÁRIOS', icon: 'UserCog', path: '/admin/users', order: 20, permission: 'user.view' },
      { label: 'SITE', icon: 'Layout', path: '/admin/settings/homepage', order: 90, permission: 'admin.all' },
      { label: 'PERMISSÕES', icon: 'ShieldCheck', path: '/admin/permissions', order: 100, permission: 'admin.all' }
    ];

    await Menu.findOneAndUpdate({ name: 'SIDEBAR_ADMIN' }, { items: adminMenuItems }, { upsert: true });

    console.log('[Integridade] Configurações mínimas sincronizadas.');
  } catch (error) {
    console.error('[Integridade] Erro Crítico:', error.message);
  }
};

module.exports = { runIntegrityChecks };
