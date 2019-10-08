const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	DOB: {
		type: Date,
		required: true
	}
});
const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
