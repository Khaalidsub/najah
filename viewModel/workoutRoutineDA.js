// Sherif Khaled Abouelmagd
// A17CS4009

const WR = require('../models/workoutRoutine');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerWR = async (wr) => {
	await wr.save();
};

const viewWR = async () => {
    const val = await WR.find();
    return val;
};

const deleteWR = async function(id){ 
    try {
        const deletedWR = await WR.findByIdAndDelete(id);
        if(!deleteWR){
            throw new Error
        }else
            return deletedWR;
    }catch (error) {
        return null
    }
}

const findWR = async function(id){ 
    try {
        const equ = await WR.findById(id);
        console.log(id);
        if(!findWR){
            throw new Error
        }else
            return WR;
    }catch (error) {
        return null;
    }
}

const updateWR = async function(id, body){ 
    try {
        const wr = await WR.findByIdAndUpdate(id, body);
        if(!updateWR){
            throw new Error
        }else
            return wr;
    }catch (error) {
        return null;
    }
}

module.exports = {  
    AddWR        : registerWR, 
    DelWR        : deleteWR,
    viewWR       : viewWR,
    SearchWR     : findWR,
    updateWR     : updateWR};