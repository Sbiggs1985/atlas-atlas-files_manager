// utils/redis.js
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Initialize Redis client
    this.client = createClient();

    // Handle any Redis connection errors
    this.client.on('error', (error) => {
      console.error('Redis client error:', error);
    });
  }

  // Method to check if Redis is connected
  isAlive() {
    return this.client.connected;
  }

  // Asynchronous method to get a value by key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, value) => {
        if (error) reject(error);
        resolve(value);
      });
    });
  }

  // Asynchronous method to set a value by key with expiration
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }

  // Asynchronous method to delete a value by key
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
