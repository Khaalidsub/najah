const express = require('express');
const router = new express.Router();
const Cart =  require('../models/cart')
const passport = require('passport');
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');
const nodemailer = require('nodemailer');
const connectEmail = require('../config/mail');
require('../app')


router.get('/auth/facebook', passport.authenticate('facebook'));

//app.get('/auth/facebook/callback',passport.authenticate('facebook', {failureRedirect: '/loginpage' }),(req,res)=>{

   

//});

router.get('/', (req, res) => {
	res.render('Home');
});
router.get('/loginpage', (req, res) => {
	res.render('login', { error: req.flash('error') });
});
router.post('/login',passport.authenticate('local', { failureRedirect: '/loginPage', failureFlash: true }),async (req, res) => {
		//res.send('you are loggedin as adeen' + req.user.name);

		const profile = req.user;
		profile.password = '';
		const userCart = await Cart.findOne({customer: req.user.id})
		if(userCart){
		await req.user.populate('cartItems').execPopulate()
		if(req.user.cartItems[0].totalItems){
			
		req.session.vals = {items: userCart.totalItems}
		res.locals.val = req.session.vals
		
		}
	}
		//pages rendering depending on the user roles
		if (req.user.role == 'user') {
			//if user application has not been accepted yet
			if (req.user.status == 'pending') {
				req.flash('pending', 'Your application is still being reviewed by the admins.');
				res.render('member/pendingProfile', { pending: req.flash('pending'), user: profile });
			} else if (req.user.status == 'deactivated') {
				//displaying alert card asking to reApply

				req.flash('deactivated', 'Your Account has been deactivated, Would you like to re-apply?');
				res.render('login');
			} else {
				//console.log(`user role : ${req.user.role}`);

				res.redirect('/member/memberProfile');
			}
		} else if (req.user.role == 'admin') {
			res.render('admin/adminProfile', { admin: profile });
		} else {
			console.log(`error, no user role found : ${req.user.role}`);
		}
	}
);

router.get('/logout', isauthenticated, async (req, res) => {
	await req.session.destroy()
	console.log(req.session);
	//delete req.session
	console.log('logged out ' + req.user.name);
	res.render('Home');
});

module.exports = router;
