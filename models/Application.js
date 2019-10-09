const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
	comment: {
		type: String
		//required: true
	},
	status: {
		type: String,
		required: true
		//default: undefined
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	}
});

const applicant = mongoose.model('Application', ApplicationSchema);

module.exports = applicant;
