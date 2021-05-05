const mongoose = require('mongoose')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        history: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
)


userSchema.virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = uuidv4()
        this.hashed_password = this.makeEncrypted(password)
    })
    .get(function () {
        return ''
    })

userSchema.methods = {
    authenticate: function (plainText) {
        return this.makeEncrypted(plainText) === this.hashed_password
    },
    makeEncrypted: function (password) {
        if (!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (error) {
            return ''
        }
    }
}

module.exports = mongoose.model('User', userSchema)