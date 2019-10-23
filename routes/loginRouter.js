const express = require('express');
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');
const nodemailer = require('nodemailer');
const connectEmail = require('../config/mail');

router.get('/', (req, res) => {
	res.render('Home');
});
router.get('/loginpage', (req, res) => {
	res.render('login', { error: req.flash('error') });
});
router.post('/login',passport.authenticate('local', { failureRedirect: '/loginPage', failureFlash: true }),
	(req, res) => {
		//res.send('you are loggedin as adeen' + req.user.name);

		const profile = req.user;
		profile.password = '';

		//pages rendering depending on the user roles
		if (req.user.role == 'user') {
			//console.log(`user role : ${req.user.role}`);
			res.render('memberMyProfile', { profile });
		} else if (req.user.role == 'admin') {
			res.render('memberMyProfile', { profile });
		} else {
			console.log(`error, no user role found : ${req.user.role}`);
		}
	}
);

router.get('/logout', isauthenticated, async (req, res) => {
	await req.logout();

	console.log('logged out' + req.user);
	res.render('login');
});

module.exports = router;
