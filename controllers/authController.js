const User = require("../models/userModel")
const { errorHandler } = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')

exports.signup = (req, res) => {
    const user = new User(req.body)
    user.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        data.salt = undefined
        data.hashed_password = undefined
        return res.json(data)
    })
}

exports.signin = (req, res) => {
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup.'
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password don\'t match'
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.cookie('t', token, { expires: new Date(Date.now() + 900000) })
        
        const { _id, name, email, role } = user
        return res.json({ token, user: { _id, name, email, role } })
        
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({
        message: 'Singout success'
    })
}

exports.requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ['HS256']
})

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if (!user) {
        return res.status(403).json({
            error: 'Access Denied'
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resource! Access Denied'
        })
    }
    next()
}