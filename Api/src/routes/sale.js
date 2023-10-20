const router = require('express').Router();
const controllerSale = require('../controllers/sale');
const verifyToken = require('../Middleware/validete-token');

router.get('/sales/:date',controllerSale.getSales);
router.get('/dates',controllerSale.getDates);
router.post('/addSale',controllerSale.addSale);
router.delete('/deleteSale/:id',controllerSale.deleteSale);

module.exports = router;
