const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const cartItemSchema = new mongoose.Schema(
    {
        product: { type: ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        count: Number
    },
    { timestamps: true }
)

const CartItem = mongoose.model('CartItem', cartItemSchema)


const orderSchema = new mongoose.Schema(
    {
        products: [cartItemSchema],
        transaction_id: {},
        amount: Number,
        address: String,
        status: {
            type: String,
            default: 'Not processed',
            enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"]
        },
        updated: Date,
        user: {type: ObjectId, ref: "User"}
    },
    { timestamps: true }
)

const OrderItem = mongoose.model('Order', orderSchema)

module.exports = { OrderItem, CartItem }