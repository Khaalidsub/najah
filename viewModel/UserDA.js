const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerMember = async (User) => {
	const response = await User.save();
	if (response) {
		return response;
	} else {
		return new Error();
	}
};

const registerEmployee = async function(user) {
	try {
		await user.save();
	} catch (e) {
		res.status(401).send('somthing went wrong');
	}
};
const passwordRecovery = async (email) => {
	const user = await User.findOne({ email: email });
	if (user) {
		const newPass = `123456789`;
		user.password = newPass;
		return await user.save();
	} else return null;
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
		const member = await User.find({ email: email }, { password: 0, role: 0 }); //excluding the sensitive information
		return member;
	} catch (e) {
		return;
	}
};

//route for fetching the members form db

const fetchMembers = async function() {
	try {
		// taking out the sensitive information of the user, before sending back to the client!
		dbValues = await User.find({ role: 'user' }, { password: 0, role: 0 });
		if (!dbValues) {
			throw new Error();
		}
		return dbValues;
	} catch (error) {
		return null;
	}
};
const fetchEmployees = async () => {
	try {
		// taking out the sensitive information of the user, before sending back to the client!
		dbValues = await User.find({ role: 'admin' }, { password: 0, role: 0 });
		if (!dbValues) {
			throw new Error();
		}
		return dbValues;
	} catch (error) {
		return null;
	}
};
const deleteMember = async function(id) {
	try {
		const deletedMember = await User.findById(id);

		await deletedMember.remove();
		if (!deletedMember) {
			throw new Error();
		} else return deletedMember;
	} catch (error) {
		return null;
	}
};

const useractive = async function(id) {
	await User.findByIdAndUpdate(id, { status: 'active' });

	return;
};

const joinTraining = async (userid, id) => {
	try {
		const joined = await User.findByIdAndUpdate(userid, { trainingMember: id });
		console.log(joined);

		if (!joined) {
			throw new Error();
		} else {
			return joined;
		}
	} catch (error) {
		return null;
	}
};
const quitTraining = async (userid, id) => {
	try {
		const joined = await User.findByIdAndUpdate(userid, { trainingMember: undefined });
		console.log(joined);

		if (!joined) {
			throw new Error();
		} else {
			return joined;
		}
	} catch (error) {
		return null;
	}
};

const addPackage = async (id, userId) => {
	const val = await User.findByIdAndUpdate(userId, { package: id });
	//console.log(val);

	return val;
};

const findByCardId = async (id) => {
	const user = await User.findOneAndUpdate({ code: id }, { $set: { attendance: Date.now() } }, { new: true });
	console.log(Date.now());
	return user;
};

module.exports = {
	registerMember: registerMember,
	registerEmployee: registerEmployee,
	updateMember: updateMember,
	deactivateMember: deactivateMember,
	searchUser: searchUser,
	fetchMembers: fetchMembers,
	fetchEmployees: fetchEmployees,
	deleteMember: deleteMember,
	useractive: useractive,
	findByCard: findByCardId,
	passwordRecovery,
	addPackage,
	joinTraining,
	quitTraining
};
