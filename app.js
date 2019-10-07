const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('./config/mongoose');

//userController giving the functions and routes
const loginRoute = require('./routes/loginRoute');
const memberRoute = require('./routes/memberRoute');
const employeeRoute = require('./routes/employeeRoute');

app.set('port', process.env.PORT || 3000);

//set handlebars view engine
const handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// routes
//for getting all routes
app.use(loginRoute);
app.use('/member', memberRoute);
//app.use(employeeRoute);
//for debugging or checking one route, use this e.g
//app.use('/user/login', userRoute.login);
// error handler

//server
app.listen(app.get('port'), () => {
	console.log(`Express up and running on chocoalte port buu ${app.get('port')}`);
	console.log('yeahhh');
});
