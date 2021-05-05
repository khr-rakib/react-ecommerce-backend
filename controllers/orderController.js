const { OrderItem } = require('../models/orderModel')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.orderById = (req, res, next, id) => {
    OrderItem.findById(id)
        .populate('products.product', 'name price')
        .exec((err, data) => {
            console.log(data)
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            req.order = data;
            next()
        })
}

exports.create = (req, res) => {
    req.body.order.user = req.profile
    const order = new OrderItem(req.body.order)
    order.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)        
    })
}


exports.listOrders = (req, res) => {
    OrderItem.find()
        .populate('user', '_id name address')
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(orders)
        })
}


exports.getStatusValues = (req, res) => {
    res.json(OrderItem.schema.path('status').enumValues)
}

exports.updateOrderStatus = (req, res) => {
    OrderItem.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(order)
    })
}