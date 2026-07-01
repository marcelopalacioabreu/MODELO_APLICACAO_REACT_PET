require('dotenv').config();
console.log('[Servidor] Iniciando...');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const auditMiddleware = require('./middleware/auditMiddleware');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.set('trust proxy', true);

// Configuração de Elite: UTF-8 nativo
app.set('json spaces', 2);
app.set('json replacer', (key, value) => {
  if (typeof value === 'string') {
    return value.normalize('NFC');
  }
  return value;
});

// Middlewares básicos
app.use(require('compression')());
app.use(require('morgan')('dev'));
// Permitir CORS de todas as origens. Usamos wildcard para aceitar qualquer origem.
// Observação: quando `credentials` é true o valor `origin: '*'` não é permitido;
// se você precisar enviar cookies/autenticação cross-site, use `origin: true` e
// garanta que clientes confiáveis enviem `withCredentials` e o cabeçalho `Origin`.
app.use(cors({
  // Espelha o Origin recebido, permitindo CORS para qualquer origem de forma segura
  origin: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept','Origin'],
  credentials: true
}));
// Habilita resposta a requests preflight OPTIONS em todas as rotas
app.options('*', cors({ origin: true, credentials: true }));

// Elite Encoding: Forçar UTF-8 em todas as requisições e respostas
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use(cookieParser());
app.use(auditMiddleware);

// Entrega de arquivos
app.use('/uploads', require('./routes/fileRoutes'));
app.use(express.static(path.join(process.cwd(), 'public')));

// Health Check
app.get('/api/health', async (req, res) => {
  const { client: redisClient } = require('./services/redisService');
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONECTADO' : 'DESCONECTADO';
  const redisStatus = redisClient.isOpen ? 'CONECTADO' : 'DESCONECTADO';
  const isHealthy = dbStatus === 'CONECTADO' && redisStatus === 'CONECTADO';
  
  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? 'ATIVO' : 'DEGRADADO',
    checks: {
      database: dbStatus,
      cache: redisStatus,
      uptime: process.uptime(),
      memory: process.memoryUsage().heapUsed
    },
    timestamp: new Date()
  });
});

// Rotas de autenticação
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menus', require('./routes/menus'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/network', require('./routes/network'));

// Rotas de api
app.use('/api/locations', require('./routes/locations'));
app.use('/api/homepage-config', require('./routes/homePageConfig'));
app.use('/api/menus', require('./routes/menus'));
// Example module: notes
app.use('/api/notes', require('./routes/notes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Rede] Porta ${PORT} aberta. Aguardando conexão com banco de dados...`);
});

connectDB().then(async () => {
  console.log('[Sistema] Injetando dependências de banco de dados...');
  const { runIntegrityChecks } = require('./services/integrityService');
  await runIntegrityChecks();
  
  const { createAdapter } = require('@socket.io/redis-adapter');
  const { client: redisClient } = require('./services/redisService');
  
  const io = new Server(server, { 
    cors: { origin: (origin, callback) => { callback(null, true); }, methods: ['GET','POST','PUT','DELETE','OPTIONS'], credentials: true } 
  });

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  
  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();
  
  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));

  console.log('[Servidor] servidor operacional.');
}).catch(err => {
  console.error('[Crítico] falha ao iniciar o servidor:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error(`[Crítico] Rejeição não tratada: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error(`[Crítico] Exceção não capturada: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = { app };
