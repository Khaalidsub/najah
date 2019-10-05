//acts as a dao for models

//models
const User = require('../models/User');
module.exports = {
	save: (User) => {
		User.save().then().catch((err) => console.log(err));
	}
};
