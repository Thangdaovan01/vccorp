const express = require('express');
const apiController = require('../controllers/apiController');
const apiRouter = express.Router();

//login logout

apiRouter.post('/login', apiController.login);

apiRouter.post('/register', apiController.register);

// apiRouter.get('/authentication', apiController.authentication);

module.exports = apiRouter;