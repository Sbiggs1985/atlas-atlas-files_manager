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

    this.client.connect().catch((error) => console.error('MongoDB connection error:', error));
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.database.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.database.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbCl