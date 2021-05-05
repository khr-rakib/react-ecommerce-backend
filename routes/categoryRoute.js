const router = require('express').Router()
const { create, categoryById, read, update, remove, list } = require('../controllers/categoryController');

const { requireSignin, isAdmin, isAuth } = require('../controllers/authController')
const { userById } = require('../controllers/userController')

router.get('/category/:categoryId', read)
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create)
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update)
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove)
router.get('/categories', list)

router.param('userId', userById)
router.param('categoryId', categoryById)

module.exports = router