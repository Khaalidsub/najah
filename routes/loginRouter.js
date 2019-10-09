const express = require('express');
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');

//THESE ROUTES WERE CREATED FOR TESTING PURPOSES
router.get('/', (req, res) => {
	res.render('Home');
});
router.get('/loginpage', (req, res) => {
	res.render('login');
});
router.post('/login', passport.authenticate('local'), (req, res) => {
	console.log(req.body);

	//res.send('you are loggedin as adeen' + req.user.name);
	res.render('memberDashboard');
});

router.get('/profile', isauthenticated, (req, res) => {
	res.send('this route is working fine');
});

module.exports = router;
