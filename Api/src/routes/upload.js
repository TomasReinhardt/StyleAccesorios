const router = require('express').Router();
const uploadController = require('../controllers/upload')
const verifyToken = require('../Middleware/validete-token');

router.post('/uploadImage/:id',verifyToken,uploadController.upload,uploadController.uploadFile);

module.exports = router;

