const router = require('express').Router()
const { signup, signin, signout, requireSignin } = require('../controllers/authController');
const { userSignupValidator } = require('../validators/userValidator');
const { runValidation } = require('../validators');


router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/signin',  signin)
router.get('/signout', signout)

router.get('/test', requireSignin, (req, res) => {
    res.json({
        message: 'this is protected routes'
    })
})

module.exports = router;