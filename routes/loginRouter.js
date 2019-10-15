const express = require('express');
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');

router.get('/', (req, res) => {
	res.render('Home');
});
router.get('/loginpage', (req, res) => {
	res.render('login');
});
router.post('/login', passport.authenticate('local', { failureFlash: true }), (req, res) => {
	//res.send('you are loggedin as adeen' + req.user.name);
	console.log(req.session);
	//pages rendering depending on the user roles
	if (req.user.role == 'user') {
		console.log(`user role : ${req.user.role}`);
		const profile = req.user;
		profile.password = '';
		res.render('memberMyProfile', { profile });
	} else if (req.user.role == 'admin') {
	} else {
		console.log(`error, no user role found : ${req.user.role}`);
	}
});

router.get('/logout', isauthenticated, async (req, res) => {
	await req.logout();
	console.log(req.session);

	console.log('logged out' + req.user);
	res.render('login');
});

module.exports = router;
