const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/User');
const auth = require('./middlewares/checkAuthentication');
const userroute = require('./routes/loginRouter');
const memberroute = require('./routes/memberRouter');
const employeeroute = require('./routes/employeeRouter');
const equipmentRouter = require('./routes/equipmentRouter');
const flash = require('connect-flash');
const session = require('express-session');

require('./config/passport')(passport);
require('./config/mongoose'); // to initialize mongoose and mongodb connection
//const db = require('./config/keys').MongoURI;

const app = express();
port = process.env.PORT || 3000; /*

ADDD EMAIL PART WHERE IT WILL SAY YOU ADDED AND APPLICATION IS PERNDING


*/

//set handlebars view engine
const handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(require('body-parser').urlencoded({ extended: false }));

//creating express session object

//**Session EXPIRE TIME NEED TO BE ADDED***
app.use(
	session({
		secret: 'HarryPotty',
		saveUninitialized: false,
		resave: false,
		//cookie:{_expires: 12000}
	})
);
app.use(flash()); // for flash messages!
app.use(express.urlencoded({ extended: false }));
//to register stylesheets and images
app.use(express.static('public/images'));
app.use(express.static('public/stylesheets'));

//Passport middlewares for session handling
app.use(passport.initialize());
app.use(passport.session());

// All the route files, please Configure Here
//login routes

app.use(userroute);
//member routes
app.use(memberroute);
app.use(employeeroute);
//equipmentRouters
app.use(equipmentRouter);
//server
app.listen(port, () => {
	console.log('the server is up and running at port ' + port);
});
