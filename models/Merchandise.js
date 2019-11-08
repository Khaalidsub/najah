// Sherif Khaled Abouelmagd
// A17CS4009

const mongoose = require('mongoose');
const validator = require('validator');

const merchandise = new mongoose.Schema({
    
    name: {
        type: String,
        requried: true,
        trim: true
    },

    description: {
        type: String,
        requried: true,
    },

    price: {
        type: Number,
        requried: true,
    },

    quantity: {
        type: Number,
        requried: true,
    },

    status: {
        type: Boolean,
        require: true,
    },

    category: {
        type: String,
        requried: true,
    },

    avatar: {
        type: String,
        requried: true,
    }

})

//creating databasel model
const Merchandise = mongoose.model('merchandise', merchandise);
module.exports = Merchandise;