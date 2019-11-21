// Sherif Khaled Abouelmagd
// A17CS4009

const mongoose = require('mongoose');


const cart = new mongoose.Schema({
    totalItems: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }

    ,

    totalPrice: {
        type: Number,
        required: true
    },

    items: [{
        quantity: {
            type: Number,
            requried: true,
            default: 0
        },

        price: {
            type: Number,
            requried: true,
        },
        //it will be the product field will be populated with product information!
        item: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'merchandise'
        }
        // customer who order the product in the cart
    }]
})
//creating databasel model
module.exports = mongoose.model('cart', cart);
