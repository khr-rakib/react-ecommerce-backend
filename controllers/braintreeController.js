require('dotenv').config()
const User = require('../models/userModel')
const braintree = require('braintree')

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MARCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})


exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(response)
        }
    })
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromClient = req.body.amount
    // charge the user
    let newTransaction = gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
}