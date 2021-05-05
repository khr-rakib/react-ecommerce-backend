const User = require('../models/userModel')
const Product = require('../models/productModel')

const fs = require('fs')
const _ = require('lodash')
const formidable = require('formidable')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        req.product = product
        next()
    })
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }
        let product = new Product(fields)
        
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image size could not greater than 1mb'
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            result.photo = undefined
            res.json({
                data: result
            })
        })
    })
}

exports.read = (req, res) => {
    const productId = req.params.productId
    Product.findOne({ _id: productId })
        .populate('category')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            product.photo = undefined
            return res.json(product)
        })
}

exports.remove = (req, res) => {
    let {productId} = req.params
    Product.findByIdAndRemove({_id: productId})
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            return res.json({
                message: "Proudct has been deleted!"
            })
        })
}

exports.update = (req, res) => {
    let productId = req.params.productId

    Product.findOne({ _id: productId })
        .exec((err, product) => {
            let form = new formidable.IncomingForm()
            form.keepExtensions = true;
            form.parse(req, (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Image could not upload'
                    })
                }
                product = _.extend(product, fields)

                if (files.photo) {
                    if (files.photo.size > 1000000) {
                        return res.status(400).json({
                            error: 'Image size could not greater than 1mb'
                        })
                    }
                    product.photo.data = fs.readFileSync(files.photo.path)
                    product.photo.contentType = files.photo.type
                }

                product.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    result.photo = undefined
                    res.json({
                        data: result
                    })
                })
            })
        })
}

/**
* sell / arrival
* by sell = /products?sortBy=sold&order=desc&limit=4
* by arrival = /products?sortBy=createdAt&order=desc&limit=4
* if no params are sent, then all products are retured
*/

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 5

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                })
            }
            return res.json(data)
        })
}

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 *
*/


exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 5
    
    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                })
            }
            return res.json(products)
        })
}

exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Products not found'
            })
        }
        res.json(categories)
    })
}


exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc'
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = parseInt(req.body.skip)
    let findArgs = {}

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key == 'price') {
                findArgs[key] = {
                    $get: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) return res.status(400).json({ error: 'Products not found' });
            return res.json({
                size: data.length,
                data
            })
        })
}

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}


exports.listSearch = (req, res) => {
    const query = {};
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' }
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category
        }

        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(products)

        }).populate('category').select("-photo")
    }
}


exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        }
    })

    Product.bulkWrite(bulkOps, {}, (err, product) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not update product'
            })
        }
        next()
    })
}