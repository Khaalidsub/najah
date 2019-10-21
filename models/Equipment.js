const mongoose = require('mongoose');
const validator = require('validator');

const equipment = new mongoose.Schema({
    
    name: {
        type: String,
        requried: true,
        default: undefined,
        trim: true
    },

    cost: {
        type: Number,
        requried: true,
        default: undefined,
        trim: true
    },

    supplier_name: {
        type: String,
        requried: true,
        default: undefined,
        trim: true
    },

    supplier_phone: {
        type: String,
        requried: true,
        default: undefined,
        trim: true,
        unique: true, //One email can register once
        validate(value) {
            if (!validator.isMobilePhone(value, 'ms-MY', { strictMode: true })) {
                throw new Error('Phone Number is invalid');
            }
        }
    },

    date_of_buy: {
        type: Date,
        require: true,
        default: undefined,
        trim: true,
    },

    visibility: {
        type: Boolean,
        requried: true,
        default: false,
    },

    maintenance: {
        type: Boolean,
        requried: true,
        default: false,
    },

    photo: {
        type: String,
        requried: true,
        default: false,
    },

})

//creating databasel model
const equipments = mongoose.model('equipment', equipment);
module.exports = equipments;