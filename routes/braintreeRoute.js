const router = require('express').Router()
const { requireSignin, isAuth } = require('../controllers/authController')
const { generateToken, processPayment } = require('../controllers/braintreeController')
const { userById } = require('../controllers/userController')

router.get('/braintree/getToken/:userId', requireSignin, isAuth, generateToken)
router.post('/braintree/payment/:userId', requireSignin, isAuth, processPayment)

router.param('userId', userById)


module.exports = router