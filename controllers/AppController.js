// /controllers/AppController.js
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static async getStatus(req, res) {
    try {
      const redisAlive = await redisClient.isAlive(); // Make sure to await async function if needed
      const dbAlive = await dbClient.isAlive(); // Await dbClient.isAlive() since it's async
      res.status(200).json({ redis: redisAlive, db: dbAlive });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AppController;
