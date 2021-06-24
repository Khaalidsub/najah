// const mongoose = require('mongoose');
const Cart = require("../models/cart");

const getUserCarts = async function(id) {
    return await Cart.findOne({ customer: id });
};

module.exports = getUserCarts;