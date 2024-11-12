// /controllers/FilesController.js

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const Bull = require('bull');
const imageThumbnail = require('image-thumbnail');

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

// Create a Bull queue for file jobs
const fileQueue = new Bull('fileQueue', {
  redis: { host: 'localhost', port: 6379 }, // Redis configuration
});

if (!fs.existsSync(FOLDER_PATH)) {
  fs.mkdirSync(FOLDER_PATH, { recursive: true });
}

class FilesController {
  // **Updated postUpload with background job**
  static async postUpload(req, res) {
    const { name, type, parentId = 0, isPublic = false, data } = req.body;
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing or invalid type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId !== 0) {
      const parentFile = await dbClient.db.collection('files').findOne({ _id: dbClient.getObjectId(parentId) });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }

      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    let localPath = '';
    if (type === 'file' || type === 'image') {
      const fileName = uuidv4();
      localPath = path.join(FOLDER_PATH, fileName);

      const fileBuffer = Buffer.from(data, 'base64');
      fs.writeFileSync(localPath, fileBuffer);
    }

    const newFile = {
      userId: dbClient.getObjectId(userId),
      name,
      type,
      isPublic,
      parentId,
      localPath: localPath || '',
    };

    try {
      const result = await dbClient.db.collection('files').insertOne(newFile);
      const file = result.ops[0];

      // If the file is an image, add a job to the queue for thumbnail generation
      if (type === 'image') {
        fileQueue.add({
          userId,
          fileId: file._id.toString(),
        });
      }

      res.status(201).json(file);
    } catch (error) {
      console.error('Error creating file:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // **Updated getFile method to handle size query**
  static async getFile(req, res) {
    const { id } = req.params;
    const { size } = req.query;

    if (![500, 250, 100].includes(Number(size))) {
      return res.status(400).json({ error: 'Invalid size parameter. Valid sizes are 500, 250, 100.' });
    }

    const file = await dbClient.db.collection('files').findOne({ _id: dbClient.getObjectId(id) });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    // If the file is not public and the user is not authenticated or the owner
    const token = req.headers['x-token'];
    const userId = token ? await redisClient.get(`auth_${token}`) : null;

    if (!file.isPublic && (!userId || userId !== file.userId.toString())) {
      return res.status(404).json({ error: 'Not found' });
    }

    // If the file is a folder
    if (file.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }

    // Check if the thumbnail for the requested size exists
    const thumbnailPath = path.join(FOLDER_PATH, `${file.localPath}_${size}`);

    if (!fs.existsSync(thumbnailPath)) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Return the thumbnail with the correct MIME type
    const mimeType = require('mime-types').lookup(thumbnailPath);
    res.setHeader('Content-Type', mimeType);

    fs.createReadStream(thumbnailPath).pipe(res);
  }
}

export default FilesController;