const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerMember = async (User) => {
	await User.save();
};

module.exports = { registerMember: registerMember };
