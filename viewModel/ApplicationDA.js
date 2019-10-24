
//****************************//
// Author of this Code:
// Muhammad Adeen Rabbani
// A17CS4006
//****************************//

const User = require('../models/User');
const userDA = require('../viewModel/UserDA');
const Application = require('../models/Application');
const mongoose = require('mongoose');

const check = async function(id, str) {
	const temp = await Application.findById(id);
	return temp.status === str;
};
const update = async function(id, str) {
	
	const val = await Application.findByIdAndUpdate(id, { status: str });
	return val;
};

const addApplication = async (User) => {
	try {
		var comment = '';
		var status = 'pending';
		var owner = User._id;

		const Applicant = new Application({
			comment,
			status,
			owner
		});
		return await Applicant.save();
	} catch (e) {
		console.log(e);
	}
};
//fetching all the applications to view for the admin
const fetchApps = async (query) => {
	try {
		var apps;
		if (query) {
			apps = await Application.find({ status: query });
		} else {
			apps = await Application.find();
		}
		if (!apps) return null;
		// here we are populating the owner fields, means fetching data of one database table from other
		for (var app of apps) {
			const own = await app.populate('owner', '-password -role').execPopulate();
		}
		return apps;
	} catch (e) {
		console.log(e);
	}
};

const performAction = async (id, query, com) => {
	var updated;
	switch (query) {
		case 'accept':
			if (await check(id, 'accepted')) {
				return 0;
			} else {
				 const use = await update(id, 'accepted','_id');
				   await userDA.useractive(use.owner._id);
				   	 
			}
			break;
		case 'reject':
			if (await check(id, 'rejected')) {
				return 0
			} else{
					   await update(id, 'rejected')
					   await Application.findOneAndUpdate(id,{comment:com})
			}
			break;
		case 'delete':
			updated = await Application.findByIdAndDelete(id);
			break;
	}

};
module.exports = { addApplication: addApplication, fetchApps: fetchApps, performAction };
