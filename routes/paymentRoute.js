
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

//! SINGLE RESPONSIBILITY
router.get('/add-to-cart/:id', isauthenticated, async(req, res) => {
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
router.get('/viewcart', isauthenticated, async(req, res) => {
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
        }); //!REMOVE THE UNECCESSARY ITEM FROM THE SENDING OBJECT!
    } else {
        req.flash('no_items', 'Your Cart is Empty, Continue Shopping!');
        res.redirect('/member/shop');
    }
});

//delete Item from the cart route
router.get('/cart/deleteitem/:id', isauthenticated, async(req, res) => {
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

router.get('/checkout', isauthenticated, async(req, res) => {
    const user = {};
    user.name = req.user.name;
    user.email = req.user.email;
    user.phone = req.user.phone;
    user.address = req.user.address;

    const cart = await Cart.findOne({ customer: req.user.id });
    //console.log(res.locals.val);
    await cart.populate('items.item', 'name avatar').execPopulate();

    //set the local storage
    req.session.cartPrice = cart.totalPrice;
    //Do something for the avatar route that is going to be rendered on the front end!
    res.render('checkout', {
        cart: cart,
        user: user,
        profile: req.user.name
    });
});

module.exports = router