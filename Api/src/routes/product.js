const router = require('express').Router();
const controllerProduct = require('../controllers/product');
const verifyToken = require('../Middleware/validete-token');

router.get('/products',controllerProduct.getProducts);
router.get('/productsEdit',verifyToken,controllerProduct.getProductsEdit);
router.get('/product/:id',controllerProduct.getProduct);
router.get('/categorys',controllerProduct.getCategorys);
router.get('/getImage/:image',controllerProduct.getImage);
router.get('/productsValidate/:id',controllerProduct.getProductsValidate);
router.post('/addProduct',verifyToken,controllerProduct.addProduct)
router.post('/addCategory',verifyToken,controllerProduct.addCategory);
router.put('/updateProduct/:id',verifyToken,controllerProduct.updateProduct)
router.put('/updateCategory/:id',verifyToken,controllerProduct.updateCategory)
router.delete('/deleteProduct/:id',verifyToken,controllerProduct.deleteProduct)
router.delete('/deleteCategory/:id',verifyToken,controllerProduct.deleteCategory);

module.exports = router;
