// controllers/UsersController.js
const crypto = require('crypto');
const dbClient = require('../utils/db'); // Import dbClient

// POST /users handler
const postNew = async (req, res) => {
  const { email, password } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  // Check if password is provided
  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  try {
    // Ensure DB connection is established
    if (!dbClient.db) {
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Check if the email already exists in DB
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Insert the new user into the DB
    const result = await dbClient.db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });

    // Return the new user's id and email (MongoDB generates the ID)
    return res.status(201).json({
      id: result.insertedId.toString(),
      email,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { postNew };
