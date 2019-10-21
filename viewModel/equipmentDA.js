const equipment = require('../models/Equipment');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerEquipment = async (equ) => {
	await equ.save();
};

const deleteEquipment = async (equ) => {
	await equ.remove();
};

const viewEquipment = async () => {
    const val = await equipment.find();
    return val;
};



module.exports = {  
    AddEquipment: registerEquipment, 
    DelEquipment: deleteEquipment,
    viewEquipment: viewEquipment};