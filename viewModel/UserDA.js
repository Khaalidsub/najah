const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerMember = async (User) => {
	try {
		//await User.save();
		await User.save();
	} catch (error) {
		console.log(error);
		return;
	}
};
const registerEmployee = async function(user) {
	try {
		await user.save();
	} catch (e) {
		res.status(401).send('somthing went wrong');
	}
};
const updateMember = async (user) => {
	try {
		//await User.u

		await User.findByIdAndUpdate(user.id, { phone: user.phone });
	} catch (error) {
		res.status(401).send('something went wrong');
	}
};
const deactivateMember = async (user) => {
	try {
		console.log(user);
		await User.findByIdAndUpdate(user.id, { status: user.status });
	} catch (error) {
		console.log(error);
		res.status(401).send('something went wrong');
	}
};

const searchUser = async (email) => {
	try {
		const member = await User.find({ email: email });
		if (!member) {
			res.send('no member found');
		} else {
			res.send(member);
		}
	} catch (e) {
		res.send(e);
	}
};

module.exports = {
	registerMember: registerMember,
	registerEmployee: registerEmployee,
	updateMember: updateMember,
	deactivateMember: deactivateMember,
	searchUser: searchUser
};
