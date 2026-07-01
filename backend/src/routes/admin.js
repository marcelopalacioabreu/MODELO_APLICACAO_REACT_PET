const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUserStatus, resetUserPassword } = require('../controllers/userController');
const { getRoles, updateRolePermissions } = require('../controllers/roleController');
const { getPermissions, createPermission } = require('../controllers/permissionController');
const { getFunctionalities } = require('../controllers/functionalityController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Middleware de Proteção Global para Admin
router.use(protect);

// Funções (Perfis de Acesso) - Acessível para quem gerencia usuários ou rede
router.get('/roles', authorize('user.view', 'user.create', 'units.manage', 'admin.all'), getRoles);

router.use(authorize('admin.all')); // Bloqueio Master para as demais rotas sensíveis
router.put('/roles/:id/permissions', updateRolePermissions);

// Permissões
router.get('/permissions', getPermissions);
router.post('/permissions', createPermission);

// Funcionalidades
router.get('/functionalities', getFunctionalities);

module.exports = router;
