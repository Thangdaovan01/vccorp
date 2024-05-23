const express = require('express');
const apiController = require('../controllers/apiController');
const apiRouter = express.Router();

//login logout
apiRouter.post('/login', apiController.login);
apiRouter.get('/style', apiController.getStyle); 
apiRouter.post('/register', apiController.register);

apiRouter.get('/row', apiController.getRow);
apiRouter.post('/row', apiController.createRow);
apiRouter.put('/row', apiController.updateRow);
apiRouter.delete('/row', apiController.deleteRow);
// apiRouter.get('/authentication', apiController.authentication);
 
apiRouter.get('/account', apiController.getAccount);
apiRouter.get('/accounts', apiController.getAccounts);
apiRouter.put('/account', apiController.updateAccount);
apiRouter.delete('/account', apiController.deleteAccount);

apiRouter.get('/websites', apiController.getWebsites);
apiRouter.put('/website', apiController.updateWebsite);
apiRouter.delete('/website', apiController.deleteWebsite);

module.exports = apiRouter;