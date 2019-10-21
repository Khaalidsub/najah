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
	user.role = 'user';
	console.log(user.email);

	try {
		userDA.registerMember(user); //user.save();
		applicationDA.addApplication(user); // saving the application
		//connecting with the email proxy
		const mailer = connectEmail.connect;
		try {
			//sending mail to the user email
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

		res.render('login');
	} catch (error) {
		res.send(error);
	}
});
router.get('/member/memberMyProfile', isauthenticated, (req, res) => {
	const profile = req.user;
	profile.password = '';
	res.render('memberMyProfile', { profile });
});
module.exports = router;
