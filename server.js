// server.js
import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';
import dbClient from './utils/db.js'; // Import dbClient to ensure DB connection

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Ensure the DB connection is established before starting the server
dbClient.connect().then(() => {
  console.log("MongoDB connected successfully!");

  // Load all routes after DB connection is successful
  app.use('/', router);

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1); // Exit the process if DB connection fails
});

export default app;
