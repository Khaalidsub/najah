var express = require('express');
var router = express.Router();

//models
const Member = require('../models/Member');

//Dao aka viewModels
const userView = require('../viewModel/memberDao');

register: router.get('/registerPage', (req, res) => {
	console.log('inside the register function ' + req.body);
	res.render('registrationMember');
});

registerUser: router.get('/register', (req, res, next) => {
	var name = req.query.name;
	var email = req.query.email;
	var password = req.query.password;
	var DOB = req.query.DOB;
	const newUser = new Member({
		name,
		email,
		password,
		DOB
	});
	console.log('inside the registeruser function ' + req.params);
	console.log(`user saved : ${newUser}`);
	res.render('login', userView.save(newUser));
});
module.exports = router;
