//Shubham Gupta
const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    itemCost: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    sellerName: {
        type: String,
        default: Date.now
    },
    userEmail: {
        type: String,
        required: true
    },
})
module.exports = mongoose.model('Product', ProductSchema);