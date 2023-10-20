const router = require('express').Router();
const { application } = require('express');
const controllerAuth = require('../controllers/auth');
const verifyToken = require('../Middleware/validete-token');

router.post('/register', verifyToken,controllerAuth.registerUser);
router.post('/login', controllerAuth.loginUser);
router.get('/tokencheck', verifyToken,controllerAuth.checkToken);
router.get('/checkapi',controllerAuth.checkApi);

module.exports = router;