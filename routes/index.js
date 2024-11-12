// routes/index.js

// Existing imports
const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController.js');
const UsersController = require('../controllers/UsersController.js');
const AuthController = require('../controllers/AuthController.js');
const FilesController = require('../controllers/FilesController.js'); // Import FilesController

// Existing routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect); // Sign-in route
router.get('/disconnect', AuthController.getDisconnect); // Sign-out route
router.get('/users/me', UsersController.getMe); // User profile route
router.post('/files', FilesController.postUpload);

// New endpoints
router.get('/files/:id', FilesController.getShow); // Route to retrieve a specific file
router.get('/files', FilesController.getIndex);    // Route to retrieve files with pagination

module.exports = router;