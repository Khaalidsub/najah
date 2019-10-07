var express = require('express');
var router = express.Router();

//models
const User = require('../models/User');

//Dao aka viewModels
const userView = require('../viewModel/memberDao');

login: router.get('/user/login', (req, res) => {
	console.log('inside the login function ' + req.body);
	res.render('login');
});

module.exports = router;
