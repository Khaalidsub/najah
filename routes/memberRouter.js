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


//Loading an error page if coming request does not matches with 
//any of the above configured routes
//MAKE SURE WE PUT IT AT THE END OF ALL THE ROUTES
router.get('/member/*', (req,res)=>{
	res.render('errorPage');
  })

  router.get('/member/registerPage/*', (req,res)=>{
	res.render('errorPage');
  })

module.exports = router;
