const express = require('express');
const mongoose = require('mongoose');
const app = express();

const db = require('./config/keys').MongoURI;
//connect
mongoose
	.connect(db, { useUnifiedTopology: true })
	.then(() => console.log('MongoDB connected...'))
	.catch((err) => console.log(err));

app.set('port', process.env.PORT || 3000);
//userController giving the functions and routes
const userRoute = require('./routes/usersRoute');

//set handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' }, { ext: 'hbs' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'hbs');

// routes
app.use('/user/login', userRoute.login);
app.use('/user/register', userRoute.register);
app.get('/user/registerUser', userRoute.registerUser);
// error handler

//server
app.listen(app.get('port'), () => {
	console.log(`Express up and running on chocoalte port buu ${app.get('port')}`);
	console.log('yeahhh');
});
