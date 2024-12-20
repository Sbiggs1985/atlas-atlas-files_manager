// server.js

const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes/index.js');
const dbClient = require('./utils/db.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

dbClient.connect().then(() => {
  console.log("MongoDB connected successfully!");

  app.use('/', router);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

export default app;