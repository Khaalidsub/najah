const User = require('../models/User');
const Application = require('../models/Application')
const mongoose = require('mongoose');

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
		await Applicant.save();
	} catch (e) {
		console.log(e);
	}
};

 const fetchApps = async (query)=>{
	  try {  
		  
		const apps = await Application.find({status: query})
		console.log(apps);
		
		if(!apps){
			return null;
		}
		for( var app of apps){
			const own = await app.populate('owner','-password').execPopulate()	
		}
        return apps;
	  } catch (error) {
		  console.log(error);

	  }
	 
 };


module.exports = { addApplication: addApplication, fetchApps: fetchApps };
