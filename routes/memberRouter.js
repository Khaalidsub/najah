//****************************//
// Author of this Code:
// Khaalid Subaan
// A17CS4037
//****************************//

const express = require('express');
const merchandiseDA = require('../viewModel/MerchandiseDA')
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const userDA = require('../viewModel/UserDA');
const applicationDA = require('../viewModel/ApplicationDA');
const isauthenticated = require('../middlewares/checkAuthentication');
const isUser = require('../middlewares/isUser');
const equipment = require('../models/Equipment');
const equipmentDA = require('../viewModel/equipmentDA');

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
router.get('/member/memberProfile', isauthenticated, isUser, (req, res) => {
	const user = req.user;
	user.password = '';
	res.render('member/memberMyProfile', { profile: user });
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
				res.redirect(req.get('referer'));
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
router.get('/member/memberMyProfile', isauthenticated, isUser, (req, res) => {
	const profile = req.user;
	profile.password = '';
	res.render('member/memberMyProfile', { profile });
});

router.post('/member/deactivateAccount', isauthenticated, isUser, async (req, res) => {
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

//Equipment Route//
router.get('/member/viewEquipmentPage', isauthenticated, isUser, async (req, res) => {
	const profile = req.user;
	profile.password = '';

	const equs = await equipmentDA.viewEquipment();
	res.render('member/equipmentList', { equ: equs, profile });
});

//Personal Training Routes//
//view Training
router.get('/member/viewTrainingPage', isauthenticated, isUser, async (req, res) => {});
//join Training
router.post('/member/joinTraining', isauthenticated, isUser, async (req, res) => {});
//quit training
router.get('/member/quitTraining/:id', isauthenticated, isUser, async (req, res) => {});

//Loading an error page if coming request does not matches with
//any of the above configured routes
//MAKE SURE WE PUT IT AT THE END OF ALL THE ROUTES
router.get('/member/*', (req, res) => {
	res.render('errorPage');
});

router.get('/member/registerPage/*', (req, res) => {
	res.render('errorPage');
});


//****************************//
// Author of this Code:
// Muhammad Adeen Rabbani
// A17CS4006
//****************************//

//Merchandise Module Routes Starts Here

//view all merchandise


router.get('/user/shop',isauthenticated, async (req,res)=>{
	 
	try {
		
		const vals = await merchandiseDA.fetchMerchandise()
		console.log(vals);
		
	    res.render('merchandiseShop', {values: vals})
	} catch (e) {
		
	}
	
})






module.exports = router;
