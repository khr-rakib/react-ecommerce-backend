const { check } = require('express-validator')

exports.productValidation = [
    check('name')
        .isEmpty()
        .withMessage('Name is required'),
    check('description')
        .isEmpty()
        .withMessage('Description is required'),
    check('price')
        .isEmpty()
        .withMessage('Price is required'),
    check('category')
        .isEmpty()
        .withMessage('Category is required'),
    check('quantity')
        .isEmpty()
        .withMessage('Quantity is required'),
]