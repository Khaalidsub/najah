const express = require('express');
const mongoose = require('mongoose');
//const userRoute = require('./routes/usersRoute');

const app = express();
const userRoute = require('./routes/usersRoute');

const db = require('./config/keys').MongoURI;
//connect
mongoose
	.connect(db, { useUnifiedTopology: true })
	.then(() => console.log('MongoDB connected...'))
	.catch((err) => console.log(err));

app.set('port', process.env.PORT || 3000);
//userController giving the functions and routes

//set handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' }, { ext: 'hbs' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'hbs');

// routes
app.use('/user/login', userRoute.login);
//app.use(userRoute);
app.use('/user/register', userRoute.register);
app.get('/user/registerUser', userRoute.registerUser);
// error handler

//server
app.listen(app.get('port'), () => {
	console.log(`Express up and running on chocoalte port buu ${app.get('port')}`);
	console.log('yeahhh');
});
