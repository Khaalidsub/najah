const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const userDA = require('../viewModel/loginDA');

module.exports = function(passport) {
	//here we have defined a strategy for user authentication .

	passport.use(
		'local',
		new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async function(username,password,done) {
			try {
				const dbuser = await userDA.findByCredentials(username, password);
				if (!dbuser) {
					done(null, false, {error:'invalid username/Password'});
				}
				if (dbuser) {
					done(null, dbuser);
				}
			} catch (error) {
				done(error, null, {msg:"Please Enter the details"});
			}
		})
	);
	//Mehtods used for sessions, by passportjs
	//after authentication is done, this will be executed
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};