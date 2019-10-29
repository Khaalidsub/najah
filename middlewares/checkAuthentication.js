
//****************************//
    // Author of this Code:
    // Muahmmad Adeen Rabbani
    // A17CS4006
    //****************************// 
    

require('passport');

//isAthenticated() is given by passport library
const checkAuthentication = (req, res, next) => {

	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).redirect('/loginPage');
		//or later we redirect to login page
	}
};
module.exports = checkAuthentication;