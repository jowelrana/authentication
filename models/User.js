const beautifyUnique = require('mongoose-beautiful-unique-validation')

const { Schema, model } = require('mongoose')
const { isEmail } = require('validator')
const userSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: `{VALUE} is already taken`,
        trim: true,
        required: [true, 'Email is required'],
        validate: {
            validator(email) {
                return isEmail(email)
            },
            message: ({ value: email }) =>
                `${email} is not a valid email address`,
        },
    },
    code: {
        type: String,
        default:''
    },
    verify: {
        type: Boolean,
        default: false
    },
    password: {
        type: String
    },
})
userSchema.plugin(beautifyUnique)

module.exports = model('User', userSchema)
