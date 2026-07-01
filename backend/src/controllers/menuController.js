const Menu = require('../models/Menu');
const User = require('../models/User');
const Role = require('../models/Role');
const asyncHandler = require('express-async-handler');

const getMenu = asyncHandler(async (req, res) => {
  const { name } = req.params;
  
  const user = await User.findById(req.user.id).populate('role').populate('unit');
  if (!user || !user.role) {
     return res.status(401).json({ success: false, message: 'Acesso negado.' });
  }

  const roleName = String(user.role.name || '').toUpperCase();
  const userPermissions = user.role.permissionKeys || [];
  
  // Se for ADMIN Master, não filtra nada
  const isMaster = roleName === 'ADMIN' || roleName === 'SUPERADMIN';

  const unitModules = user.unit?.networkSettings?.enabledModules || {};
  const userModules = user.enabledModules || {};

  const menu = await Menu.findOne({ name });
  if (!menu) return res.status(404).json({ success: false, message: 'Menu não localizado.' });

  const pathToModuleMap = {
    '/admin/reception': 'reception',
    '/admin/pets': 'pets',
    '/admin/adoptions': 'adoptions',
    '/admin/tutores': 'tutores',
    '/admin/inventory': 'inventory',
    '/admin/triage': 'triage',
    '/admin/appointments': 'agenda',
    '/admin/exams': 'exams',
    '/admin/hospitalization': 'hospitalization',
    '/admin/hotel': 'hotel'
  };

  const filterItems = (items) => {
    return items
      .filter(item => {
        if (!item.isActive) return false;
        if (isMaster) return true;
        
        // Se for cabeçalho (Header), permite ver se tiver permissão técnica
        // (A filtragem real ocorrerá nos itens filhos)
        if (item.isHeader) {
          if (!item.permission) return true;
          return userPermissions.includes(item.permission);
        }

        const moduleKey = pathToModuleMap[item.path];
        if (moduleKey) {
           // Só bloqueia se estiver explicitamente definido como FALSE
           if (unitModules[moduleKey] === false) return false;
           if (userModules[moduleKey] === false) return false;
        }

        if (!item.permission) return true;
        return userPermissions.includes(item.permission);
      })
      .map(item => {
        const newItem = item.toObject ? item.toObject() : { ...item };
        if (newItem.children && newItem.children.length > 0) {
          newItem.children = filterItems(newItem.children);
        }
        return newItem;
      });
  };

  const filteredMenu = filterItems(menu.items);
  res.status(200).json({ success: true, data: filteredMenu });
});

module.exports = { getMenu };
