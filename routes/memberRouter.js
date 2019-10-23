const express = require('express');
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const userDA = require('../viewModel/UserDA');
const applicationDA = require('../viewModel/ApplicationDA');
const isauthenticated = require('../middlewares/checkAuthentication');

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
		res.render('registerMember', { emailError: req.flash('email'), registered: req.flash('registered') });
	}
});
//main dashboard
router.get('/member/memberProfile', isauthenticated, (req, res) => {
	const user = req.user;
	user.password = '';
	res.render('memberMyProfile', { profile: user });
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
			if (!req.user.role == 'admin') {
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
		if (!req.user == null) {
			if (req.user.role == 'admin') {
				req.flash('registered', 'The member has been registered successfully!');
				res.redirect(req.get('referer'));
			}
		} else {
			req.flash('registered', 'We have sent you an email and it should have reached you by now!');
			user.password = '';
			res.render('pendingProfile', { pending: req.flash('registered'), application: application, user: user });
		}
	} catch (error) {
		req.flash('email', 'User email already exists !');
		res.redirect(req.get('referer'));
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
	//req.flash('email', 'User email already exists !');
	res.render('login');
});

module.exports = router;
