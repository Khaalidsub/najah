//****************************//
// Author of this Code:
// Khaalid Subaan
// A17CS4037
//****************************//

const express = require('express');
const merchandise = require('../models/Merchandise');
const merchandiseDA = require('../viewModel/MerchandiseDA');
const router = new express.Router();
const passport = require('passport');
const User = require('../models/User');
const userDA = require('../viewModel/UserDA');
const applicationDA = require('../viewModel/ApplicationDA');
const isauthenticated = require('../middlewares/checkAuthentication');
const isUser = require('../middlewares/isUser');
const equipment = require('../models/Equipment');
const equipmentDA = require('../viewModel/equipmentDA');
const Training = require('../models/PersonalTraining');
const trainingDA = require('../viewModel/PersonalTrainingDA');
const paymentDA = require('../viewModel/PaymentDA');
const workoutRoutineDA = require('../viewModel/workoutRoutineDA');
const connectEmail = require('../config/mail');
const Cart = require('../models/cart');

//paypal
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('../config/paypal');

const PackageDA = require('../viewModel/packagesDA');
const sendMail = require('../middlewares/email');
//registerpage
router.get('/member/registerPage', (req, res) => {
	//for navigation recognition
	const user = req.user;
	if (!user == null) {
		//for navigation recognition
		user.password = '';
		res.render('registerMember', {
			emailError: req.flash('email'),
			registered: req.flash('registered'),
			admin: user
		});
	} else {
		res.render('member/registerMember', { emailError: req.flash('email'), registered: req.flash('registered') });
	}
});
//main dashboard
router.get('/member/memberProfile', isauthenticated, isUser, async (req, res) => {
	const profile = req.user;
	profile.password = '';
	if (profile.trainingMember == undefined) {
		const wrs = await workoutRoutineDA.viewWR();
		res.render('member/memberMyProfile', { wrs: wrs, profile, warning: req.flash('warning') });
	} else {
		//load personal training
		console.log('hello');

		const training = await trainingDA.getTraining(req.user.trainingMember);
		console.log(req.user.trainingMember);

		res.render('member/memberMyProfile', { profile, training, warning: req.flash('warning') });
	}
});

//registerhandler
router.post('/member/register', async (req, res) => {
	console.log(req.user);

	const user = new User(req.body); // instacne of user model
	var application;
	user.role = 'user';

	//console.log(user.email);

	try {
		if (req.user) {
			console.log(req.user);
			user.status = 'active';
			await userDA.registerMember(user);
		} else {
			user.status = 'pending';
			await userDA.registerMember(user);
			application = await applicationDA.addApplication(user); // saving the application
		}
		//sending email
		await sendMail.sendUser(user);

		//redirection routes  for both admin and user
		if (req.user) {
			req.flash('searchsuccess', 'The member has been registered successfully!');
			res.redirect('/admin/viewMembers');
		} else {
			req.flash('registered', 'We have sent you an email and it should have reached you by now!');
			user.password = '';
			res.render('member/pendingProfile', {
				pending: req.flash('registered'),
				application: application,
				user: user
			});
		}
	} catch (error) {
		req.flash('emailError', 'User email already exists !');
		res.redirect(req.get('referer'));
	}
});
router.post('/member/updateMember', isauthenticated, isUser, async (req, res) => {
	//const user = new User(req.)
	const user = req.user;

	//const old_pass = req.body.old_password;
	//const new_pass = req.body.new_password;
	const phone = req.body.phone;

	//if phone is same
	//if phone not same
	try {
		//user.password = new_pass;
		user.phone = phone;

		userDA.updateMember(user);
	} catch (error) {
		console.log(error);
	}
	res.render('member/memberMyProfile', { profile: user });
});
router.get('/member/memberMyProfile', isauthenticated, isUser, async (req, res) => {
	const profile = req.user;
	profile.password = '';
	if (profile.trainingMember == undefined) {
		res.render('member/memberMyProfile', { profile });
	} else {
		//load personal training
		const training = await trainingDA.getTraining(profile.trainingMember);
		res.render('member/memberMyProfile', { profile, training });
	}
});

router.post('/member/deactivateAccount', isauthenticated, isUser, async (req, res) => {
	const user = req.user;
	user.status = 'deactivated';
	try {
		await userDA.deactivateMember(user);
	} catch (error) {
		console.log(error);
	}
	//add flash messages
	//req.flash('email', 'User email already exists !');
	res.render('login');
});

//Personal Training Routes//
//view Training
router.get('/member/viewTrainingPage', isauthenticated, isUser, async (req, res) => {
	const profile = req.user;
	profile.password = '';
	//get the size of weight loss
	const weight = await Training.find({ type: 'weight-loss' });
	//get the size of muscle gain
	const muscle = await Training.find({ type: 'muscle-gain' });
	//get the size of athlete
	const athlete = await Training.find({ type: 'athlete' });

	res.render('member/mainTraining', {
		noView: req.flash('noView'),
		profile,
		weight,
		muscle,
		athlete,
		failure: req.flash('failure')
	});
});
router.get('/member/viewTraining', isauthenticated, isUser, async (req, res) => {
	const profile = req.user;
	profile.password = '';

	const program = req.query.program;
	console.log('Program ' + program);

	const training = await trainingDA.fetchTraining(program);

	const trainers = await userDA.fetchEmployees();
	if (training.length < 1) {
		req.flash('noView', 'No Trainings to View!');
		res.render('member/viewTraining', {
			noView: req.flash('noView'),
			profile,
			failure: req.flash('failure')
		});
	} else {
		res.render('member/viewTraining', {
			training,
			profile,
			deleted: req.flash('deleted'),
			warning: req.flash('warning'),
			failure: req.flash('failure'),
			info: req.flash('info')
		});
	}
});
//join Training
router.get('/member/joinTraining/:id', isauthenticated, isUser, async (req, res) => {
	const id = req.params.id;

	const user = req.user;

	if (user.trainingMember == undefined) {
		user.trainingMember = id;
		//	let val = await userDA.joinTraining(user._id, id);
		let val = await userDA.joinTraining(user._id, id);
		if (!val) {
			req.flash('failure', 'Package has not been added!');
			res.render('/member/viewTrainingPage');
		} else {
			//successs
			//get the training program to get the price
			const trainPackage = await trainingDA.getTraining(id);

			//add amount to the payment module
			const response = await paymentDA.updatePayment(req.user.id, trainPackage.cost);

			req.flash('warning', 'Package has been added into your system Successfully!');
			res.redirect('/member/memberProfile');
		}
	} else {
		req.flash('info', 'You already have another program! ');
		res.redirect('/member/viewTrainingPage');
	}
});
//quit training
router.post('/member/quitTraining/:id', isauthenticated, isUser, async (req, res) => {
	const id = req.params.id;
	const user = req.user;
	console.log('helo there here i am', id);
	let val = await userDA.quitTraining(user._id, id);
	if (!val) {
		req.flash('failure', 'Package has not been added!');
		res.render('/member/memberProfile');
	} else {
		//successs
		req.flash('warning', 'Training Program has been removed from your account Successfully!');
		res.redirect('/member/memberProfile');
	}
});

//****************************//
// Author of this Code:
// Muhammad Adeen Rabbani
// A17CS4006
// ITERRATION 2
//****************************//

//Merchandise Module Routes Starts Here

//**DISCLAIMER** this module is like a son who didnt listen to
// his parents and followed his own path and succeeded xD XD XD
//view all merchandise

router.get('/member/shop', isauthenticated, isUser, async (req, res) => {
	try {
		//chunking the array for better front end rendering
		const vals = await merchandiseDA.fetchMerchandise(req.user.role);
		var chunkarr = [];
		const chunkSize = 3;
		for (var i = 0; i < vals.length; i += chunkSize) {
			chunkarr.push(vals.slice(i, i + chunkSize));
		}

		res.render('merchandiseShop', {
			values: chunkarr,
			cart_msg: req.flash('cart-success'),
			noitem: req.flash('no_items'),
			profile: req.user.name,
			val: req.session.vals
		});
	} catch (e) {}
});

router.get('/add-to-cart/:id', isauthenticated, async (req, res) => {
	const id = req.params.id;
	//first we have to check if the product is already in cart
	console.log('product id : ', id);
	//check if the user already as a cart to his name
	const foundCart = await Cart.findOne({ customer: req.user.id });
	isthere = false;
	//if there is a cart for the user, check if the item he is trying to add is there alredy
	//this is to group the elements .
	if (foundCart) {
		for (var val of foundCart.items) {
			if (val['item'] == id) {
				await foundCart.populate('items.item').execPopulate();
				isthere = true;
				foundCart.totalPrice += val.item.price;
				val.price += val.item.price;
				val.quantity++;
				foundCart.totalItems++;
				await foundCart.save();
				break;
			}
		}

		if (isthere == false) {
			const product = await merchandise.findById(id, 'price'); // to get the price
			foundCart.totalPrice += product.price;
			item = { item: id, price: product.price };
			item.quantity = 1;
			foundCart.totalItems++;

			//console.log(item);
			foundCart.items.push(item);
			await foundCart.save();
		}
	} else {
		//create the new cart for the customer carting first time
		const cart = new Cart();
		const Product = await merchandise.findById(id, 'price'); //getting the price

		cart.totalItems = 1;
		cart.totalPrice = Product.price; //change later
		item = { item: id, price: Product.price };
		item.quantity = 1;
		item.item = id;
		cart.customer = req.user.id;
		cart.items.push(item);
		await cart.save(); //document method
	}
	req.flash('cart-success', 'Item has been added successfully :)');
	res.redirect(req.get('referer'));
});

//view cart router goes here
router.get('/viewcart', isauthenticated, async (req, res) => {
	//logged in user can view their cart
	console.log(req.locals);
	console.log(req.session.vals);

	const cart = await Cart.findOne({ customer: req.user.id });
	if (cart) {
		//console.log(res.locals.val);

		await cart.populate('items.item', 'name avatar').execPopulate();
		//Do something for the avatar route that is going to be rendered on the front end!
		res.render('cart', {
			cart: cart,
			deleteMsg: req.flash('deleteSuccess'),
			profile: req.user.name,
			val: req.session.vals
		}); //REMOVE THE UNECCESSARY ITEM FROM THE SENDING OBJECT!
	} else {
		req.flash('no_items', 'Your Cart is Empty, Continue Shopping!');
		res.redirect('/user/shop');
	}
});

//delete Item from the cart route
router.get('/cart/deleteitem/:id', isauthenticated, async (req, res) => {
	const userCart = await Cart.findOne({ customer: req.user.id });
	const item = userCart.items.id(req.params.id);
	//updating numeric values in the cart
	userCart.totalPrice -= item.price;
	userCart.totalItems -= item.quantity;
	if (userCart.items.length == 1) {
		await Cart.findOneAndDelete({ customer: req.user.id });
		req.session.vals -= 1;
		req.session.save();
		console.log('Latest', req.session);
	} else {
		item.remove(); //subdoc own remove method
		await userCart.save();

		req.flash('deleteSuccess', 'Item has been deleted!');
	}

	res.redirect('/viewcart');
});

router.get('/checkout', isauthenticated, async (req, res) => {
	const user = {};
	user.name = req.user.name;
	user.email = req.user.email;
	user.phone = req.user.phone;
	user.address = req.user.address;

	const cart = await Cart.findOne({ customer: req.user.id });
	//console.log(res.locals.val);
	await cart.populate('items.item', 'name avatar').execPopulate();
	//Do something for the avatar route that is going to be rendered on the front end!
	res.render('checkout', {
		cart: cart,
		user: user,
		profile: req.user.name
	});
});
router.get('/member/viewWorkoutRoutine', isauthenticated, async (req, res) => {
	const user = req.user;
	user.password = '';
	const wrs = await workoutRoutineDA.viewWR();
	res.render('member/workoutRoutine', { wrs: wrs, profile: user });
});
//res.render('checkout', { cart: cart, user: user, profile: req.user.name });

router.get('/member/viewPackages', isauthenticated, async (req, res) => {
	//console.log(req.user.gender);
	const pkgs = await PackageDA.fetchPackages(req.user.gender);
	if (pkgs == null) {
		//right now MY DICK
	} else {
		res.render('member/packages', {
			profile: req.user.name,
			packages: pkgs,
			pkgalrdy: req.flash('alrdyPackage'),
			pkgsuc: req.flash('packageSuccess')
		});
	}
});

router.get('/member/subscription/:id', isauthenticated, isUser, async (req, res) => {
	if (req.user.package) {
		req.flash('alrdyPackage', 'You have already registered one package! please come to the counter.');
		res.redirect(req.get('referer'));
	} else {
		const id = req.params.id;
		const val = await userDA.addPackage(id, req.user.id);
		//get the package cost
		const package = await PackageDA.getPackage(id);
		//create payment document for that user
		const response = await paymentDA.createPayment(req.user.id, package.price);
		req.flash('packageSuccess', 'Package successfully subscribed!');
		res.redirect(req.get('referer'));
	}
});

//console.log(val);

router.get('/member/paymentPage', isauthenticated, async (req, res) => {
	const profile = req.user;
	//get the payment table for that certain user
	const payment = await paymentDA.getPayment(req.user.id);
	//display the outstanding balance etc
	res.render('member/Payment', { profile, payment });
});
router.get('/member/paymentHistory', isauthenticated, async (req, res) => {
	const profile = req.user;
	//get the payment table for that certain user
	const payment = await paymentDA.fetchPayments(req.user.id);
	//display the outstanding balance etc
	if(payment)
		res.render('member/PaymentHistory', { profile, transactions: payment.transactions });
	else
		res.render('member/PaymentHistory', { profile, transactions: null });
});
router.get('/member/printPayment/:id', isauthenticated, async (req, res) => {
	const profile = req.user;
	//get the payment table for that certain user
	const payment = await paymentDA.fetchPayments(req.user.id);
	//display the outstanding balance etc
	res.render('member/PaymentHistory', { profile, transactions: payment.transactions });
});

router.post('/member/pay', isauthenticated, async (req, res) => {
	//getting the payment db
	const payment = await paymentDA.getPayment(req.user.id);

	//orderID
	const orderID = req.body.orderID;

	//enter the orderID that has been given from the user
	let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

	let order;
	try {
		//process the orderId to find the transaction details
		order = await payPalClient.client().execute(request);
	} catch (err) {
		//handle errors if there is no transaction details of that order id
		console.error(err);
		return res.send(500);
	}

	if (Math.round(order.result.purchase_units[0].amount.value) !== payment.amount) {
		//send error page once the payment is not similar
		res.sendStatus(400);
	}
	//create an object containing
	const name = order.result.payer.name.given_name;
	const email = order.result.payer.email_address;
	const amount = order.result.purchase_units[0].amount.value;
	const payerid = order.result.payer.payer_id;
	const reason = 'outstanding balance najah gym';

	//save it to the payment so it can be retrieved once it has been refreshed
	const invoice = { orderID, name, payerid, email, amount, payerid, reason };

	//save the transaction into the payment db and make amount into null
	const updatedPayment = await paymentDA.completePayment(req.user.id, invoice);
	const sendInvoice = await sendMail.sendTransaction(invoice);
	res.sendStatus(200);
	//console.log('transaction', Math.round(order.result.purchase_units[0].amount.value));
});

//Loading an error page if coming request does not matches with
//any of the above configured routes
//MAKE SURE WE PUT IT AT THE END OF ALL THE ROUTES
router.get('/member/*', (req, res) => {
	res.render('errorPage');
});

router.get('/member/registerPage/*', (req, res) => {
	res.render('errorPage');
});

router.get('/member/registerPage/*', (req, res) => {
	res.render('errorPage');
});

module.exports = router;
