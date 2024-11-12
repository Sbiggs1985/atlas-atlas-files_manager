import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

if (!fs.existsSync(FOLDER_PATH)) {
  fs.mkdirSync(FOLDER_PATH, { recursive: true });
}

class FilesController {
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

      res.status(201).json(file);
    } catch (error) {
      console.error('Error creating file:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method to publish a file
  static async putPublish(req, res) {
    const token = req.headers['x-token'];
    const { id } = req.params;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = await dbClient.db.collection('files').findOneAndUpdate(
      { _id: dbClient.getObjectId(id), userId: dbClient.getObjectId(userId) },
      { $set: { isPublic: true } },
      { returnOriginal: false }
    );

    if (!file.value) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.status(200).json(file.value);
  }

  // Method to unpublish a file
  static async putUnpublish(req, res) {
    const token = req.headers['x-token'];
    const { id } = req.params;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = await dbClient.db.collection('files').findOneAndUpdate(
      { _id: dbClient.getObjectId(id), userId: dbClient.getObjectId(userId) },
      { $set: { isPublic: false } },
      { returnOriginal: false }
    );

    if (!file.value) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.status(200).json(file.value);
  }

  // **New method: getFile**
  static async getFile(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];

    const file = await dbClient.db.collection('files').findOne({ _id: dbClient.getObjectId(id) });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    const userId = token ? await redisClient.get(`auth_${token}`) : null;
    const isOwner = userId && userId === file.userId.toString();

    if (!file.isPublic && !isOwner) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (file.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }

    if (!fs.existsSync(file.localPath)) {
      return res.status(404).json({ error: 'Not found' });
    }

    const mimeType = mime.lookup(file.name);
    res.setHeader('Content-Type', mimeType || 'application/octet-stream');

    const fileContent = fs.readFileSync(file.localPath);
    res.status(200).send(fileContent);
  }
}

export default FilesController;