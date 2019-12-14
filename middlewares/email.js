const connectEmail = require('../config/mail');

const sendUser = async (user) => {
	//connecting with the email proxy
	const mailer = await connectEmail.connect;
	try {
		//sending mail to the user email

		await mailer.sendMail({
			from: 'khaalidsubaan@gmail.com',
			to: user.email,
			subject: 'Registration Najah Complete',
			text:
				'Thank you for applying to najah gym. Your application is in the process and we will response to you shortly!',
			dsn: {
				id: 'some random message specific id',
				return: 'headers',
				notify: [ 'failure', 'delay' ],
				recipient: 'khaalidsubaan@gmail.com'
			}
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	sendUser
};
