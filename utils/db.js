const { MongoClient } = require('mongodb');
require('dotenv').config();

class DBClient {
  constructor() {
    const uri = `mongodb+srv://fmproject:atlasschool@atlas.da3zi.mongodb.net/?retryWrites=true&w=majority&appName=Atlas`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.db = null;
  }

  // Asynchronous connect method
  async connect() {
    try {
      await this.client.connect(); // Await the connection
      this.db = this.client.db('files_manager');
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error; // Throw error to properly handle connection failure
    }
  }

  // Check if MongoDB client is connected
  async isAlive() {
    try {
      // A simple ping to check if the client is connected
      await this.client.db().command({ ping: 1 });
      return true;
    } catch (error) {
      console.error('MongoDB is not alive:', error);
      return false;
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
