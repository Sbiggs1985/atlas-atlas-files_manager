// Added the new getMe endpoint while retaining existing postNew endpoint
const crypto = require('crypto');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const postNew = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  try {
    if (!dbClient.db) {
      return res.status(500).json({ error: 'Database connection error' });
    }

    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const result = await dbClient.db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      id: result.insertedId.toString(),
      email,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getMe = async (req, res) => {
  const token = req.headers['x-token'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const tokenKey = `auth_${token}`;
  const userId = await redisClient.get(tokenKey);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await dbClient.db.collection('users').findOne({ _id: dbClient.getObjectId(userId) });
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json({ id: user._id.toString(), email: user.email });
};

module.exports = { postNew, getMe };