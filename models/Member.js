const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	idurl: {
		type: String,
		required: true
	}
});
const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
