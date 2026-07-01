const redis = require('redis');

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`
});

client.on('error', (err) => console.error('❌ [Redis] Erro no Cliente:', err));
client.on('connect', () => console.log('🚀 [Redis] Conectado com sucesso'));

// Auto-connect
(async () => {
  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (error) {
      console.error('❌ [Redis] Falha na conexão inicial:', error.message);
    }
  }
})();

const setAsync = async (key, value, expiry = null) => {
  if (expiry) {
    return await client.set(key, value, {
      EX: expiry
    });
  }
  return await client.set(key, value);
};

const getAsync = async (key) => {
  return await client.get(key);
};

const delAsync = async (key) => {
  return await client.del(key);
};

const delByPattern = async (pattern) => {
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    return await client.del(keys);
  }
  return 0;
};

module.exports = {
  client,
  setAsync,
  getAsync,
  delAsync,
  delByPattern
};
