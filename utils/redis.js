import promisify from utils

const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Redis connection error:', err));

const redisClient = {
  isAlive() {
    return client.connected;
  },
  // Get value from key
  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    return asyncGet(key);
  },
  // Set key with value and duration
  async set(key, value, duration) {
    const asyncSet = promisify(this.client.setex).bind(this.client);
    return asyncSet(key, duration, value);
  }
};



module.exports = redisClient;