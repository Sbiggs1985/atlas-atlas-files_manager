import Bull from 'bull';
import dbClient from './utils/db.js';
import imageThumbnail from 'image-thumbnail';
import fs from 'fs';
import path from 'path';

// Create a Bull queue for file jobs
const fileQueue = new Bull('fileQueue', {
  redis: { host: 'localhost', port: 6379 }, // Redis configuration
});

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

// Process jobs from the fileQueue
fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  // Find the file document in the DB
  const file = await dbClient.db.collection('files').findOne({ _id: dbClient.getObjectId(fileId), userId: dbClient.getObjectId(userId) });

  if (!file) {
    throw new Error('File not found');
  }

  if (file.type !== 'image') {
    throw new Error('File is not an image');
  }

  // Generate 3 thumbnails with different sizes
  const thumbnailSizes = [500, 250, 100];

  for (const size of thumbnailSizes) {
    const thumbnailPath = path.join(FOLDER_PATH, `${file.localPath}_${size}`);

    try {
      const options = { width: size };
      const thumbnail = await imageThumbnail(path.join(FOLDER_PATH, file.localPath), options);
      fs.writeFileSync(thumbnailPath, thumbnail);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }

  console.log('Thumbnails generated for file:', file.name);
});