// Sherif Khaled Abouelmagd
// A17CS4009

const equipment = require('../models/Equipment');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerEquipment = async (equ) => {
	await equ.save();
};

const viewEquipment = async () => {
    const val = await equipment.find();
    return val;
};

const deleteEquipment = async function(id){ 
    try {
        const deletedEquipment = await equipment.findByIdAndDelete(id);
        if(!deleteEquipment){
            throw new Error
        }else
            return deletedEquipment;
    }catch (error) {
        return null
    }
}

const findEquipment = async function(id){ 
    try {
        const equ = await equipment.findById(id);
        console.log(id);
        if(!findEquipment){
            throw new Error
        }else
            return equ;
    }catch (error) {
        return null;
    }
}

const updateEquipment = async function(id, body){ 
    try {
        const equ = await equipment.findByIdAndUpdate(id, body);
        if(!updateEquipment){
            throw new Error
        }else
            return equ;
    }catch (error) {
        return null;
    }
}

module.exports = {  
    AddEquipment        : registerEquipment, 
    DelEquipment        : deleteEquipment,
    viewEquipment       : viewEquipment,
    SearchEquipment     : findEquipment,
    updateEquipment     : updateEquipment};