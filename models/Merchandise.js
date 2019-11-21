// Sherif Khaled Abouelmagd
// A17CS4009

const mongoose = require('mongoose');
const validator = require('validator');
const fs = require('fs')

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
        type: String,
        require: true,
        enum: ['available','unavailable']
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

 merchandise.virtual('cart', {
	ref: 'cart',
	localField: '_id',
	foreignField: 'ite',
	//justOne: true
});

merchandise.pre('remove', async function (next){
    const path = this.avatar;
     fs.unlinkSync(path)
    next()  
})

//creating databasel model
const Merchandise = mongoose.model('merchandise', merchandise);
module.exports = Merchandise;