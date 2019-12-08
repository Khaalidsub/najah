// THIS FILE WILL BE USED LATER MODULE. PLEASE IGNORE. THANK YOU.
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
	member: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		default: undefined,
		ref: 'User'
	},
	status: {
		type: String,
		required: true,
		enum: [ 'paid', 'unpaid' ]
	},
	Date: {
		type: Date,
		default: Date.now
	},
	amount: {
		type: Number,
		required: true,
		default: null
	}
});

//creating databasel model
const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
