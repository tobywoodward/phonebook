const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error.message)
    })

const contactSchema = new mongoose.Schema({
    name : {
        type: String,
        minLength: 3,
        required: true
    },
    number : {
        type: String,
        required: true,
        validate: [
            {
                validator: function(v) {
                    const numberRegex = /^\d{2,3}-\d+$/
                    return numberRegex.test(v)
                },
                message: 'Number must be in the format XX-XXXXXX'
            },
            {
                validator: function(v) {
                    return (v.replace('-', '').length >= 8)
                },
                message: 'Number must contain at least 8 digits'
            }
        ]
    }
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)