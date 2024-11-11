// Added routes for new endpoint for task 4
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

module.exports = router;