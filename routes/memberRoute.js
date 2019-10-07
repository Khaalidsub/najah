var express = require('express');
var router = express.Router();

//models
const User = require('../models/User');

//Dao aka viewModels
const userView = require('../viewModel/memberDao');

register: router.get('/member/register', (req, res) => {
	console.log('inside the register function ' + req.body);
	res.render('registerUser');
});

registerUser: router.get('/member/registerUser', (req, res, next) => {
	var name = req.params.name;
	var email = req.params.email;
	const newUser = new User({
		name,
		email
	});
	console.log('inside the registeruser function ' + req.body);
	console.log(`user saved : ${newUser}`);
	res.render('login', userView.save(newUser));
});
module.exports = router;
