const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/User');
const Cart = require('./models/cart');
require('./models/Package');
require('./models/Merchandise');
const auth = require('./middlewares/checkAuthentication');
const userroute = require('./routes/loginRouter');
const memberroute = require('./routes/memberRouter');
const employeeroute = require('./routes/employeeRouter');

const flash = require('connect-flash');
const session = require('express-session');

require('./config/passport')(passport);
require('./config/mongoose'); // to initialize mongoose and mongodb connection
//const db = require('./config/keys').MongoURI;

const app = express();
port = process.env.PORT || 3000;

//set handlebars view engine and hbs helper functions
const handlebars = require('express3-handlebars').create({
	defaultLayout: 'main',
	helpers: {
		get: function(obj) {
			return JSON.stringify(obj);
		},

		math: function(val) {
			parseInt(val);
			return val + 1;
		}
	}
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(function(req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next();
});
app.use(express.json());
app.use(require('body-parser').urlencoded({ extended: false }));

//creating express session object

//**Session EXPIRE TIME NEED TO BE ADDED***
app.use(
	session({
		secret: 'HarryPotty',
		saveUninitialized: false,
		resave: false
		//cookie:{_expires: 12000}
	})
);
app.use(flash()); // for flash messages!
app.use(express.urlencoded({ extended: false }));
//to register stylesheets and images
app.use(express.static('public/images'));
app.use(express.static('public/products'));
app.use(express.static('public/stylesheets'));

app.use(express.static('public/js'));
//app.use(express.static('public/assets'));
//Passport middlewares for session handling
app.use(passport.initialize());
app.use(passport.session());

// All the route files, please Configure Here
//login routes

app.use(userroute);
app.use(memberroute);
app.use(employeeroute);

//server
app.listen(port, () => {
	console.log('the server is up and running at port ' + port);
});
