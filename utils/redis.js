// /utils/redis.js
import { promisify } from 'util';

const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Redis connection error:', err));

const redisClient = {
  isAlive() {
    return client.connected;
  },
  // Get value from key
  async get(key) {
    // Fix: changed 'this.client' to directly use 'client'
    const asyncGet = promisify(client.get).bind(client);
    return asyncGet(key);
  },
  // Set key with value and duration
  async set(key, value, duration) {
    // Fix: changed 'this.client' to directly use 'client'
    const asyncSet = promisify(client.setex).bind(client);
    return asyncSet(key, duration, value);
  }
};



module.exports = redisClient;