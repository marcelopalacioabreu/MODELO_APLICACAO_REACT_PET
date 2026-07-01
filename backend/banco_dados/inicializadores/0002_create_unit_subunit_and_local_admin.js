const path = require('path');
const backendSrc = path.join(__dirname, '../../src');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const moment = require('moment-timezone');

dotenv.config({ path: path.join(__dirname, '../../.env') });

require(path.join(backendSrc,'models','Location'));
require(path.join(backendSrc,'models','User'));
require(path.join(backendSrc,'models','Product'));
require(path.join(backendSrc,'models','InventoryBatch'));
require(path.join(backendSrc,'models','Role'));
require(path.join(backendSrc,'models','Permission'));
// Obtain model constructors from mongoose
const Location = mongoose.model('Location');

const InventoryBatch = mongoose.model('InventoryBatch');
async function setupPermanent() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const day = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD');

    console.log('🏗️ Criando Estrutura Organizacional Permanente...');

    // 1. Criar Matriz
    let matriz = await Location.findOne({ name: 'HOSPITAL MATRIZ MUNICIPAL' });
    if (!matriz) {
      matriz = await Location.create({
        name: 'HOSPITAL MATRIZ MUNICIPAL',
        type: 'HOSPITAL',
        isActive: true,
        status: 'APPROVED',
        day,
        address: { street: 'Rua da Saúde', number: '100', neighborhood: 'Centro' }
      });
    }

    // 2. Criar Subunidades
    const subs = [
      { name: 'CLÍNICA SATÉLITE NORTE', type: 'CLINICA' },
      { name: 'POSTO DE SAÚDE SUL', type: 'CLINICA' },
      { name: 'UNIDADE MÓVEL DE CASTRAÇÃO', type: 'UNIDADE_MOVEL' }
    ];

    for (const s of subs) {
      await Location.findOneAndUpdate(
        { name: s.name },
        { ...s, parentLocation: matriz._id, isActive: true, status: 'APPROVED', day },
        { upsert: true }
      );
    }

    // 2.1 Habilitar módulos essenciais na Matriz (idempotente)
    try {
      matriz = await Location.findOne({ name: 'HOSPITAL MATRIZ MUNICIPAL' });
      if (matriz) {
        matriz.networkSettings = {
          ...(matriz.networkSettings || {}),
          enabledModules: {
            reception: true,
            pets: true,
            adoptions: true,
            tutores: true,
            clinical: true,
            triage: true,
            agenda: true,
            exams: true,
            hospitalization: true,
            hotel: true
          }
        };
        await matriz.save();
        console.log('✅ Todos os módulos habilitados para a Matriz.');
      }
    } catch (err) {
      console.warn('⚠️ Não foi possível habilitar módulos da Matriz:', err.message || err);
    }

    // 3. Vincular Usuário Admin à Matriz e garantir Role/Admin
    const Permission = mongoose.model('Permission');
    const Role = mongoose.model('Role');
    const UserModel = mongoose.model('User');

    // Sincronizar role ADMIN com todas as permissões existentes
    const allPerms = await Permission.find({});
    const allIds = allPerms.map(p => p._id);
    const allKeys = allPerms.map(p => p.key);

    let adminRole = await Role.findOneAndUpdate(
      { name: 'ADMIN' },
      {
        description: 'Administrador do sistema - Acesso total',
        permissions: allIds,
        permissionKeys: allKeys,
        status: 'ACTIVE'
      },
      { upsert: true, new: true }
    );

    // Vincular ou criar usuário admin de teste
    const adminEmail = 'admin_teste@emtec.com';
    // Em ambiente de desenvolvimento, usar senha previsível para facilitar testes locais
    const defaultPassword = 'admin123';

    let existing = await UserModel.findOne({ email: adminEmail });
    if (!existing) {
      
      const newAdmin = new UserModel({
        name: 'Administrator',
        email: adminEmail,
        password: defaultPassword,
        role: adminRole._id,
        mustChangePassword: true,
        tempPasswordDisplay: defaultPassword,
        isActive: true,
      });
      await newAdmin.save();
      console.log(`✅ Usuário admin criado: ${adminEmail}`);
    } else {
      // Garantir unidade e role
      existing.unit = existing.unit || matriz._id;
      existing.role = existing.role || adminRole._id;
      await existing.save();
      console.log(`ℹ️ Usuário admin já existe: ${adminEmail}`);
    }

    // 3a. Criar administrador da unidade para desenvolvimento (CPF exemplo)
    const unitAdminCpf = '99999999999';
    const unitAdminEmail = 'unit_admin@local.test';

    let unitAdmin = await UserModel.findOne({ $or: [{ cpf: unitAdminCpf }, { email: unitAdminEmail }] });
    if (!unitAdmin) {
      
      unitAdmin = new UserModel({
        name: 'Unit Administrator',
        cpf: unitAdminCpf,
        email: unitAdminEmail,
        password: defaultPassword,
        role: adminRole._id,
        mustChangePassword: true,
        tempPasswordDisplay: defaultPassword,
        isActive: true,
        unit: matriz._id
      });
      await unitAdmin.save();
      console.log(`✅ Usuário administrador da unidade criado: ${unitAdminEmail} / CPF: ${unitAdminCpf}`);
    } else {
      console.log(`ℹ️ Usuário administrador da unidade já existe: ${unitAdminEmail} / CPF: ${unitAdminCpf}`);
    }

    // 3b. Criar usuário exemplo 'Luana' para desenvolvimento
    const luanaEmail = 'luana.coto@gmail.com';
    
    let luana = await UserModel.findOne({ email: luanaEmail });
    if (!luana) {
    
      luana = new UserModel({
        name: 'Luana Victoria de Araujo Couto',
        cpf: '12521666645',
        email: luanaEmail,
        phone: '32998143445',
        password: defaultPassword,
        role: adminRole._id,
        mustChangePassword: false,
        tempPasswordDisplay: defaultPassword,
        isActive: true
      });
      await luana.save();
      console.log(`✅ Usuário exemplo criado: ${luanaEmail}`);
    } else {
      console.log(`ℹ️ Usuário exemplo já existe: ${luanaEmail}`);
    }

    console.log('✅ Estrutura criada e persistente.');
    console.log(`📍 Usuário admin_teste@emtec.com vinculado à unidade: ${matriz.name}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setupPermanent();

