const express = require('express');
const webController = require('../controllers/webController');
const webRouter = express.Router();
const {checkAdminRole} = require('../middleware/checkAdmin');


webRouter.get('/', webController.getHomepage);
webRouter.get('/login-register', webController.getLoginPage);
// webRouter.get('/admin', checkAdminRole, webController.getAdminPage); 
webRouter.get('/admin', webController.getAdminPage); 
webRouter.get('/accounts', webController.getAccountList); 
webRouter.get('/websiteList', webController.getWebsiteList); 

module.exports = webRouter; 