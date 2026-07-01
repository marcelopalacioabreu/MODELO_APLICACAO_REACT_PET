const mongoose = require('mongoose');

/**
 * @desc    Connect to MongoDB with exponential backoff retry logic
 * @author  Senior Full-Stack AI Engineer
 */
const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    mongoUri = 'mongodb://mongodb:27017/saude_animal_db';
  }
  
  const MAX_RETRIES = 5;
  let currentRetry = 0;

  const connectWithRetry = async () => {
    try {
      const logUri = mongoUri.includes('@') ? mongoUri.split('@').pop() : mongoUri;
      console.log(`🔗 [DB] Tentativa ${currentRetry + 1}/${MAX_RETRIES}: Conectando em ${logUri}`);

      const conn = await mongoose.connect(mongoUri, {
        maxPoolSize: 100,
        minPoolSize: 10,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 20000,
      });

      console.log(`🚀 [DB] MongoDB Conectado: ${conn.connection.host}`);
      mongoose.set('debug', process.env.NODE_ENV === 'development');
      
    } catch (error) {
      currentRetry++;
      console.error(`❌ [DB] Erro na tentativa ${currentRetry}: ${error.message}`);
      
      if (currentRetry === 1 && !mongoUri.includes('host.docker.internal')) {
        console.log('🔄 [DB] Tentando fallback para host.docker.internal...');
        mongoUri = mongoUri.replace(/:\/\/[^\/:]+/, '://host.docker.internal');
      }
      
      if (currentRetry < MAX_RETRIES) {
        const delay = Math.pow(2, currentRetry) * 1000;
        console.log(`🔄 [DB] Aguardando ${delay/1000}s para nova tentativa...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return connectWithRetry();
      } else {
        console.error('💀 [DB] Limite de tentativas atingido. O backend não iniciará sem banco.');
        throw error;
      }
    }
  };

  await connectWithRetry();
};

module.exports = connectDB;
