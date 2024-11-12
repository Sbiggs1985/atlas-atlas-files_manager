const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController.js');
const UsersController = require('../controllers/UsersController.js');
const AuthController = require('../controllers/AuthController.js');
const FilesController = require('../controllers/FilesController.js');

// Existing routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.post('/files', FilesController.postUpload);

// New routes added
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

// ** New endpoint to get file content by ID **
router.get('/files/:id/data', FilesController.getFile);

module.exports = router;