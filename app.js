const express = require('express');
const mongoose = require('mongoose');
const app = express();

//userController giving the functions and routes
const userRoute = require('./routes/usersRoute');

const db = require('./config/keys').MongoURI;

//connect
mongoose
	.connect(db, { useUnifiedTopology: true })
	.then(() => console.log('MongoDB connected...'))
	.catch((err) => console.log(err));

app.set('port', process.env.PORT || 3000);

//set handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' }, { ext: 'hbs' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'hbs');

// routes
//for getting all routes
app.use(userRoute);
//for debugging or checking one route, use this e.g
//app.use('/user/login', userRoute.login);
// error handler

//server
app.listen(app.get('port'), () => {
	console.log(`Express up and running on chocoalte port buu ${app.get('port')}`);
	console.log('yeahhh');
});
