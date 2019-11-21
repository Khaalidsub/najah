// Sherif Khaled Abouelmagd
// A17CS4009

const mongoose = require('mongoose');
const validator = require('validator');

const workoutRoutine = new mongoose.Schema({
    
    name: {
        type: String,
        requried: true,
        default: undefined,
        trim: true
    },

    type: {
        type: String,
        requried: true,
        default: undefined,
        trim: true
    },

    body_part: {
        type: String,
        requried: true,
        default: undefined,
        trim: true
    },

    duration: {
        type: Number,
        requried: true,
        default: undefined,
        trim: true,
    },

    comment: {
        type: String,
        require: true,
        trim: true,
        default: ''
    },

    img_path: {
        type: String,
        require: true,
        trim: true,
        default: ''
    },

    time: {
        type: Date,
        required: true,
        default: Date.now().toString()
    }
})

//creating databasel model
const wr = mongoose.model('workoutRoutine', workoutRoutine);
module.exports = wr;