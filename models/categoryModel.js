const mongoose = require('mongoose')


const categoryModel = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            unique: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Category', categoryModel)