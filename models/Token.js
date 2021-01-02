const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type : String,
        required: true
    },
})
module.exports = mongoose.model('Token', tokenSchema);