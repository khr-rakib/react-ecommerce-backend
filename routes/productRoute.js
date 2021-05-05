const router = require('express').Router()

const { create, read, remove, update, list, listRelated, listCategories, listBySearch, photo, productById, listSearch } = require('../controllers/productController')

const { requireSignin, isAuth, isAdmin } = require('../controllers/authController')
const { userById } = require('../controllers/userController')
const { productValidation } = require('../validators/productValidator');
const { runValidation } = require('../validators');

router.get('/product/:productId', read);
router.post('/product/create/:userId', productValidation, runValidation, create)
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove)
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update)

router.get('/products', list)
router.get('/products/search', listSearch)
router.get('/products/related/:productId', listRelated)
router.get('/products/categories', listCategories)
router.post('/products/by/search', listBySearch)
router.get('/product/photo/:productId', photo)

router.param('userId', userById)
router.param('productId', productById)

module.exports = router;