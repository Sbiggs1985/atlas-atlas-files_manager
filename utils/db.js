// utils/db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.database = this.client.db(database);

    // Connect to MongoDB server
    this.client.connect().catch((error) => console.error('MongoDB connection error:', error));
  }

  // Method to check if MongoDB connection is alive
  isAlive() {
    return this.client.isConnected();
  }

  // Asynchronous method to count the number of users
  async nbUsers() {
    return this.database.collection('users').countDocuments();
  }

  // Asynchronous method to count the number of files
  async nbFiles() {
    return this.database.collection('files').countDocuments();
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbCl