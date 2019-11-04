const express = require('express');
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');
const nodemailer = require('nodemailer');
const connectEmail = require('../config/mail');


router.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',passport.authenticate('facebook', {failureRedirect: '/loginpage' }),(req,res)=>{

   

});

router.get('/', (req, res) => {
	res.render('Home');
});
router.get('/loginpage', (req, res) => {
	res.render('login', { error: req.flash('error') });
});
router.post('/login',passport.authenticate('local', { failureRedirect: '/loginPage', failureFlash: true }),(req, res) => {
		//res.send('you are loggedin as adeen' + req.user.name);

		const profile = req.user;
		profile.password = '';

		//pages rendering depending on the user roles
		if (req.user.role == 'user') {
			//if user application has not been accepted yet
			if (req.user.status == 'pending') {
				req.flash('pending', 'Your application is still being reviewed by the admins.');
				res.render('pendingProfile', { pending: req.flash('pending'), user: profile });
			} else if (req.user.status == 'deactivated') {
				//displaying alert card asking to reApply

				req.flash('deactivated', 'Your Account has been deactivated, Would you like to re-apply?');
				res.render('login');
			} else {
				//console.log(`user role : ${req.user.role}`);

				res.redirect('/member/memberProfile');
			}
		} else if (req.user.role == 'admin') {
			res.render('adminProfile', { admin: profile });
		} else {
			console.log(`error, no user role found : ${req.user.role}`);
		}
	}
);

router.get('/logout', isauthenticated, async (req, res) => {
	await req.logout();
	console.log('logged out' + req.user);
	res.render('Home');
});

module.exports = router;
