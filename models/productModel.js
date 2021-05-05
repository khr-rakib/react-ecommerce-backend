const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        description: {
            type: String,
            required: true,
            max: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            required: true
        },
        quantity: {
            type: Number,
            trim: true,
            required: true
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        shipping: {
            required: false,
            type: Boolean
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)