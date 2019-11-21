
//****************************//
// Author of this Code:
// Muahmmad Adeen Rabbani
// A17CS4006
//****************************// 


require('passport');
require('mongoose')
const Cart = require('../models/cart')

//isAthenticated() is given by passport library
const checkAuthentication = async (req, res, next) => {

	if (req.isAuthenticated()) {

		const userCart = await Cart.findOne({ customer: req.user.id })
		if (userCart) {
			req.session.vals = { items: userCart.totalItems }
			res.locals.val = req.session.vals
		}
		next();
	} else {
		res.status(401).redirect('/loginPage');
		//or later we redirect to login page
	}
};
module.exports = checkAuthentication;