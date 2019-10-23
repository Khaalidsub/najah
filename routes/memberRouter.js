const express = require('express');
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const userDA = require('../viewModel/UserDA');
const applicationDA = require('../viewModel/ApplicationDA');
const isauthenticated = require('../middlewares/checkAuthentication');

const connectEmail = require('../config/mail');

//THESE ROUTES WERE CREATED FOR TESTING PURPOSES
router.get('/member/registerPage', (req, res) => {
	res.render('registerMember');
});

router.post('/member/register', async (req, res) => {
	const user = new User(req.body); // instacne of user model
	var application;
	user.role = 'user';
	user.status = 'pending';
	console.log(user.email);

	try {
		await userDA.registerMember(user);
		application = await applicationDA.addApplication(user); // saving the application

		try {
			//connecting with the email proxy
			const mailer = await connectEmail.connect;
			//sending mail to the user email
			console.log('I am hereee');
			await mailer.sendMail({
				from: 'khaalidsubaan@hotmail.com',
				to: user.email,
				subject: 'Registration Najah Complete',
				text:
					'Thank you for applying to najah gym. Your application is in the process and we will response to you shortly!',
				dsn: {
					id: 'some random message specific id',
					return: 'headers',
					notify: [ 'failure', 'delay' ],
					recipient: 'khaalidsubaan@hotmail.com'
				}
			});
		} catch (error) {
			console.log(error);
		}
		req.flash('registered', 'We have sent you an email and it should have reached you by now!');
		user.password = '';
		res.render('pendingProfile', { pending: req.flash('registered'), application: application, user: user });
	} catch (error) {
		req.flash('exists', 'User email already exists !');
		res.render('registerMember', { emailError: req.flash('exists') });
	}
});
router.post('/member/updateMember', async (req, res) => {
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
	res.render('memberMyProfile', { profile: user });
});
router.get('/member/memberMyProfile', isauthenticated, (req, res) => {
	const profile = req.user;
	profile.password = '';
	res.render('memberMyProfile', { profile });
});

router.post('/member/deactivateAccount', async (req, res) => {
	const user = req.user;
	user.status = 'deactivated';
	try {
		userDA.deactivateMember(user);
	} catch (error) {
		console.log(error);
	}
	//add flash messages
	res.render('login');
});

module.exports = router;
