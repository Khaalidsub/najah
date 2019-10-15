const express = require('express');
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const memberDA = require('../viewModel/memberDA');
const applicationDA = require('../viewModel/ApplicationDA');
const isauthenticated = require('../middlewares/checkAuthentication');

//THESE ROUTES WERE CREATED FOR TESTING PURPOSES
router.get('/member/registerPage', (req, res) => {
	res.render('registerMember');
});

router.post('/member/register', async (req, res) => {
	const user = new User(req.body); // instacne of user model
	user.role = 'user';
	try {
		memberDA.registerMember(user); //user.save();
		applicationDA.addApplication(user);
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
