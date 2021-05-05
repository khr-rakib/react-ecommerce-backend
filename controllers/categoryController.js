const Category = require('../models/categoryModel')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.categoryById = (req, res, next, id) => {
    Category.findById(id)
        .exec((err, category) => {
            if (err || !category) {
                return res.status(400).json({
                    error: 'Category does not exits'
                })
            }
            req.category = category
            next()
        })
}

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, cat) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json({ data: cat });
    })
}

exports.read = (req, res) => {
    return res.json(req.category)
}

exports.update = (req, res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json({
            message: 'Category update success'
        })
    })
}

exports.remove = (req, res) => {
    const category = req.category
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json({
            message: 'Category delete success'
        })
    })
}

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json(data)
    })
}