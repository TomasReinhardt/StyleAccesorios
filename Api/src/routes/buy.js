const router = require('express').Router();
const controllerBuy = require('../controllers/buy');
const verifyToken = require('../Middleware/validete-token');

router.post('/validateStock',controllerBuy.stockValidate);
router.post('/updateStock',controllerBuy.updateStock);

module.exports = router;