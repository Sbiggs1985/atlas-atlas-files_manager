// /utils/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class DBClient {
  constructor() {
    const uri = process.env.MONGO_URI || `mongodb+srv://fmproject:atlasschool@atlas.da3zi.mongodb.net/?retryWrites=true&w=majority&appName=Atlas`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.db = null;
    this.isConnected = false; // Track if the connection is established
  }

  // Asynchronous connect method (ensures single connection)
  async connect() {
    if (this.isConnected) {
      // If already connected, return the current DB instance
      return this.db;
    }

    try {
      await this.client.connect(); // Await the connection
      this.db = this.client.db('files_manager');
      this.isConnected = true;
      console.log('MongoDB connected');
      return this.db;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error; // Throw error to properly handle connection failure
    }
  }

  // Check if the connection is alive
  async isAlive() {
    try {
      await this.connect(); // Ensure the connection is established before checking
      return this.isConnected; // Return whether the connection is established
    } catch (error) {
      console.error('Error checking DB connection:', error);
      return false; // If any error, consider it as not alive
    }
  }

  // Get the number of users in the 'users' collection
  async nbUsers() {
    try {
      await this.connect(); // Ensure the connection is established before querying
      const count = await this.db.collection('users').countDocuments();
      return count;
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  // Get the number of files in the 'files' collection
  async nbFiles() {
    try {
      await this.connect(); // Ensure the connection is established before querying
      const count = await this.db.collection('files').countDocuments();
      return count;
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }
}

// Exporting an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
