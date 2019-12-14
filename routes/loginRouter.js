const express = require('express');
const router = new express.Router();
const Cart = require('../models/cart');
const passport = require('passport');
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');
const nodemailer = require('nodemailer');
const connectEmail = require('../config/mail');
const equipmentDA = require('../viewModel/equipmentDA');
const paymentDA = require('../viewModel/PaymentDA');
const userDA = require('../viewModel/UserDA');
const PackageDA = require('../viewModel/packagesDA');

router.get('/', async (req, res) => {
	const equs = await equipmentDA.viewEquipment();
	res.render('Home', { equ: equs });
});
router.get('/loginpage', (req, res) => {
	res.render('login', { error: req.flash('error') });
});
router.post(
	'/login',
	passport.authenticate('local', { failureRedirect: '/loginPage', failureFlash: true }),
	async (req, res) => {
		//res.send('you are loggedin as adeen' + req.user.name);

		const profile = req.user;
		profile.password = '';

		const userCart = await Cart.findOne({ customer: req.user.id });
		if (userCart) {
			await req.user.populate('cartItems').execPopulate();
			if (req.user.cartItems[0].totalItems) {
				req.session.vals = { items: userCart.totalItems };
				res.locals.val = req.session.vals;
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
				//check last payment date and current date
				const payment = await paymentDA.getPayment(req.user.id);

				if (payment) {
					//sort
					const sortedTransaction = payment.transactions.reverse();
					//if payment is above 30 days:

					const prevDate = new Date(sortedTransaction[0].Date).getTime();

					const currDate = new Date().getTime();

					console.log(currDate, '  ', prevDate);

					const differenceTime = currDate - prevDate;
					const differenceDays = differenceTime / (1000 * 3600 * 24);

					console.log('timeee', differenceDays);
					if (differenceDays > 30) {
						// check for the package user registered
						//console.log('user');

						const package = await PackageDA.getPackage(req.user.package);
						const cost = package.price;
						//problem arising : payment is stil above 30 and he logs in,payment add again

						// if (cost >= payment.amount) {
						// }
						// check the price and add it in the payment amount
						const updatedPayment = await paymentDA.updatePayment(req.user.id, cost);
					}
				}

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
	await req.session.destroy();
	console.log(req.session);
	//delete req.session
	console.log('logged out ' + req.user.name);
	res.render('Home');
});

module.exports = router;
