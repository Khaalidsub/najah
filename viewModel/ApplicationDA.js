const User = require('../models/User');
const Applicant = require('../models/Application');
const mongoose = require('mongoose');

const addApplication = async (User) => {
	try {
		var comment = '';
		var status = 'pending';
		var owner = User._id;

		const Applicantion = new Applicant({
			comment,
			status,
			owner
		});
		await Applicantion.save();
		await User.populate({ path: 'application' }).execPopulate();
		console.log(User.application);
	} catch (e) {
		console.log(e);
	}
};

module.exports = { addApplication: addApplication };
