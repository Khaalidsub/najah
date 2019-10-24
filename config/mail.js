//****************************//
// Author of this Code:
// Khaalid Subaan
// A17CS4037
//****************************//

const nodemailer = require('nodemailer');
const credentials = require('./credentials');

//connect mail transport

const transporter = nodemailer.createTransport({
	service: 'Gmail', // no need to set host or port etc.
	auth: {
		user: 'khaalidsubaan@gmail.com',
		//I hope you guys dont check my email :P
		pass: 'Wer123zebra'
		//future purposes when we put the app live
		//type: 'OAuth2',
		//clintId: '1070247141333-79vhftj1k4o6brck71sd50dilv8lbbc2.apps.googleusercontent.com',
		//clientSecret: 'wGM1tNWvJnp8mrJHENjQJOpc'
	}
});

module.exports = { connect: transporter };
