const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Redis connection error:', err));

const redisClient = {
  isAlive() {
    return client.connected;
  },
};

module.exports = redisClient;