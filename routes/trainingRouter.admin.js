const express = require('express');
const router = new express.Router();
const userDA = require('../viewModel/UserDA');
const isauthenticated = require('../middlewares/checkAuthentication');
const isAdmin = require('../middlewares/isAdmin');
const Training = require('../models/PersonalTraining');
const trainingDA = require('../viewModel/PersonalTrainingDA');

//Personal Training Routes
//view training page
router.get('/viewTrainingPage', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';

	const training = await trainingDA.adminfetchTraining();
	const trainers = await userDA.fetchEmployees();
	if (training.length < 1) {
		req.flash('noView', 'No packages to View!');
		res.render('admin/PersonalTraining', {
			noView: req.flash('noView'),
			admin: user,
			deleted: req.flash('deleted'),
			failure: req.flash('failure')
		});
	} else {
		res.render('admin/PersonalTraining', {
			training,
			trainers,
			admin: user,
			deleted: req.flash('deleted'),
			warning: req.flash('warning'),
			failure: req.flash('failure')
		});
	}
});
//add training page
router.get('/addTrainingPage', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';

	//get a list of all users that are admin
	const trainers = await userDA.fetchEmployees();

	res.render('admin/PersonalTraining', { admin: user, trainers, failure: req.flash('failure') });
});
//add training packages
router.post('/addTraining', isauthenticated, isAdmin, async (req, res) => {
	const train = new Training(req.body); // instacne of user model

	try {
		const trainers = await trainingDA.addTraining(train); //user.save();
		//successs with flash

		req.flash('warning', 'Package has been added successfully!');
		res.redirect('/admin/viewTrainingPage');
	} catch (error) {
		//failure going back to addTraining
		req.flash('failure', 'Name of the Package do already exist!');
		res.redirect('/admin/addTrainingPage');
	}
});
router.post('/updateTraining/:id', isauthenticated, isAdmin, async (req, res) => {
	const id = req.params.id;
	const val = await trainingDA.updateTraining(id, req.body);

	//failure going back to addTraining
	if (!val) {
		req.flash('failure', 'Package has been updated unsuccessfully!');
		res.redirect('/admin/viewTrainingPage');
	} else {
		//successs with flash
		req.flash('warning', 'Package has been updated successfully!');
		res.redirect('/admin/viewTrainingPage');
	}
});
//deleting packages
router.get('/deleteTraining/:id', isauthenticated, isAdmin, async (req, res) => {
	const id = req.params.id;
	const val = await trainingDA.deleteTraining(id);
	//failure
	if (!val) {
		req.flash('failure', 'Package has been deleted unsuccessfully!');
		res.redirect('/admin/viewTrainingPage');
	} else {
		//successs
		req.flash('deleted', 'Package has been deleted Successfully!');
		res.redirect('/admin/viewTrainingPage');
	}
});


module.exports = router; 