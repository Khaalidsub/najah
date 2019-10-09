require('passport');

//isAthenticated() is given by passport library
const checkAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).send({ error: 'You are logged out. Please Login' });
		//or later we redirect to login page
	}
};
module.exports = checkAuthentication;
