//****************************//
// Author of this Code:
// Khaalid Subaan
// A17CS4037
//****************************//

const express = require('express');
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const userDA = require('../viewModel/UserDA');
const applicationDA = require('../viewModel/ApplicationDA');
const isauthenticated = require('../middlewares/checkAuthentication');
const isUser = require('../middlewares/isUser');
const equipment = require('../models/Equipment');
const equipmentDA = require('../viewModel/equipmentDA');
const Training = require('../models/PersonalTraining');
const trainingDA = require('../viewModel/PersonalTrainingDA');
const connectEmail = require('../config/mail');

//registerpage
router.get('/member/registerPage', (req, res) => {
	//for navigation recognition
	const user = req.user;
	if (!user == null) {
		//for navigation recognition
		user.password = '';
		res.render('registerMember', {
			emailError: req.flash('email'),
			registered: req.flash('registered'),
			admin: user
		});
	} else {
		res.render('member/registerMember', { emailError: req.flash('email'), registered: req.flash('registered') });
	}
});
//main dashboard
router.get('/member/memberProfile', isauthenticated, isUser, async (req, res) => {
	const profile = req.user;
	profile.password = '';
	if (profile.trainingMember == undefined) {
		res.render('member/memberMyProfile', { profile, warning: req.flash('warning') });
	} else {
		//load personal training
		console.log('hello');

		const training = await trainingDA.getTraining(req.user.trainingMember);
		console.log(req.user.trainingMember);

		res.render('member/memberMyProfile', { profile, training, warning: req.flash('warning') });
	}
});

//registerhandler
router.post('/member/register', async (req, res) => {
	console.log(req.user);

	const user = new User(req.body); // instacne of user model
	var application;
	user.role = 'user';

	//console.log(user.email);

	try {
		if (!req.user == null) {
			if (req.user.role == 'admin') {
				await userDA.registerMember(user);
				user.status = 'active';
			} else {
				console.log(req.user);
			}
		} else {
			user.status = 'pending';
			await userDA.registerMember(user);
			application = await applicationDA.addApplication(user); // saving the application
		}
		//connecting with the email proxy
		const mailer = await connectEmail.connect;
		try {
			//sending mail to the user email

			await mailer.sendMail({
				from: 'khaalidsubaan@gmail.com',
				to: user.email,
				subject: 'Registration Najah Complete',
				text:
					'Thank you for applying to najah gym. Your application is in the process and we will response to you shortly!',
				dsn: {
					id: 'some random message specific id',
					return: 'headers',
					notify: [ 'failure', 'delay' ],
					recipient: 'khaalidsubaan@gmail.com'
				}
			});
		} catch (error) {
			console.log(error);
		}
		if (!req.user == null) {
			if (req.user.role == 'admin') {
				req.flash('registered', 'The member has been registered successfully!');
				res.redirect('/admin/viewMembers');
			}
		} else {
			req.flash('registered', 'We have sent you an email and it should have reached you by now!');
			user.password = '';
			res.render('member/pendingProfile', {
				pending: req.flash('registered'),
				application: application,
				user: user
			});
		}
	} catch (error) {
		req.flash('email', 'User email already exists !');
		res.redirect(req.get('referer'));
	}
});
router.post('/member/updateMember', isauthenticated, isUser, async (req, res) => {
	//const user = new User(req.)
	const user = req.user;

	//const old_pass = req.body.old_password;
	//const new_pass = req.body.new_password;
	const phone = req.body.phone;

	//if phone is same
	//if phone not same
	try {
		//user.password = new_pass;
		user.phone = phone;

		userDA.updateMember(user);
	} catch (error) {
		console.log(error);
	}
	res.render('member/memberMyProfile', { profile: user });
});
router.get('/member/memberMyProfile', isauthenticated, isUser, async (req, res) => {
	const profile = req.user;
	profile.password = '';
	if (profile.trainingMember == undefined) {
		res.render('member/memberMyProfile', { profile });
	} else {
		//load personal training
		const training = await trainingDA.getTraining(profile.trainingMember);
		res.render('member/memberMyProfile', { profile, training });
	}
});

router.post('/member/deactivateAccount', isauthenticated, isUser, async (req, res) => {
	const user = req.user;
	user.status = 'deactivated';
	try {
		await userDA.deactivateMember(user);
	} catch (error) {
		console.log(error);
	}
	//add flash messages
	//req.flash('email', 'User email already exists !');
	res.render('login');
});

//Personal Training Routes//
//view Training
router.get('/member/viewTrainingPage', isauthenticated, isUser, async (req, res) => {
	const profile = req.user;
	profile.password = '';

	const training = await trainingDA.fetchTraining();
	const trainers = await userDA.fetchEmployees();
	if (training.length < 1) {
		req.flash('noView', 'No Trainings to View!');
		res.render('member/viewTraining', {
			noView: req.flash('noView'),
			profile,
			failure: req.flash('failure')
		});
	} else {
		res.render('member/viewTraining', {
			training,
			profile,
			deleted: req.flash('deleted'),
			warning: req.flash('warning'),
			failure: req.flash('failure'),
			info: req.flash('info')
		});
	}
});
//join Training
router.post('/member/joinTraining/:id', isauthenticated, isUser, async (req, res) => {
	const id = req.params.id;

	const user = req.user;

	if (user.trainingMember == undefined) {
		user.trainingMember = id;
		//	let val = await userDA.joinTraining(user._id, id);
		let val = await userDA.joinTraining(user._id, id);
		if (!val) {
			req.flash('failure', 'Package has not been added!');
			res.render('/member/viewTrainingPage');
		} else {
			//successs
			req.flash('warning', 'Package has been added into your system Successfully!');
			res.redirect('/member/memberProfile');
		}
	} else {
		req.flash('info', 'You already have another program! ');
		res.redirect('/member/viewTrainingPage');
	}
});
//quit training
router.post('/member/quitTraining/:id', isauthenticated, isUser, async (req, res) => {
	const id = req.params.id;
	const user = req.user;
	console.log('helo there here i am', id);
	let val = await userDA.quitTraining(user._id, id);
	if (!val) {
		req.flash('failure', 'Package has not been added!');
		res.render('/member/memberProfile');
	} else {
		//successs
		req.flash('warning', 'Training Program has been removed from your account Successfully!');
		res.redirect('/member/memberProfile');
	}
});

//Loading an error page if coming request does not matches with
//any of the above configured routes
//MAKE SURE WE PUT IT AT THE END OF ALL THE ROUTES
router.get('/member/*', (req, res) => {
	res.render('errorPage');
});

router.get('/member/registerPage/*', (req, res) => {
	res.render('errorPage');
});

module.exports = router;
