const router = require('express').Router()
const { userById, read, update, purchaseHistory } = require('../controllers/userController')
const { requireSignin, isAuth } = require('../controllers/authController')


router.get('/user/:userId', requireSignin, isAuth, read)
router.put('/user/:userId', requireSignin, isAuth, update)
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory)


router.param('userId', userById)

module.exports = router;