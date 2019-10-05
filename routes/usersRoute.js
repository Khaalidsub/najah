var express = require('express');
var router = express.Router();

//models
const User = require('../models/User');

//Dao aka viewModels
const userView = require('../viewModel/userViewModel');

module.exports = {
	registerRoutes: (app) => {
		app.use('/user/login', this.login);
		app.use('/user/register', this.register);
		app.get('/user/registerUser', this.registerUser);
	},
	login: (req, res) => {
		console.log('inside the login function ' + req.body);
		res.render('login');
	},

	register: (req, res) => {
		console.log('inside the register function ' + req.body);
		res.render('registerUser');
	},

	registerUser: (req, res, next) => {
		var name = req.params.name;
		var email = req.params.email;
		const newUser = new User({
			name,
			email
		});
		console.log('inside the registeruser function ' + req.body);
		console.log(`user saved : ${newUser}`);
		res.render('login', userView.save(newUser));
	}
};
