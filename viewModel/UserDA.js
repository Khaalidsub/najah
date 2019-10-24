const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerMember = async (User) => {
	try {
		//await User.save();
		await User.save();
	} catch (error) {
		res.status(401).send('somthing went wrong');
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
		const member = await User.find({ email: email }, { password: 0, role: 0 }); //excluding the sensitive information
		return member;
	} catch (e) {
		return;
	}
};

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
const deleteMember = async function(id) {
	try {
		const deletedMember = await User.findByIdAndDelete(id);
		if (!deleteMember) {
			throw new Error();
		} else return deletedMember;
	} catch (error) {
		return null;
	}
};

 const useractive = async function (id){
	 
	  console.log(await User.findByIdAndUpdate(id,{status:'active'}));
	  
	  return
 }
module.exports = {
	registerMember: registerMember,
	registerEmployee: registerEmployee,
	updateMember: updateMember,
	deactivateMember: deactivateMember,
	searchUser: searchUser,
	fetchMembers: fetchMembers,
	deleteMember: deleteMember,
	useractive:useractive
	
};
