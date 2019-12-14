// THIS FILE WILL BE USED LATER MODULE. PLEASE IGNORE. THANK YOU.
const mongoose = require('mongoose');
const TransactionsSchema = new mongoose.Schema({
	orderID: {
		type: String
	},
	name: {
		type: String
	},
	email: {
		type: String
	},
	amount: {
		type: String
	},
	payerid: {
		type: String
	},
	reason: {
		type: String
	},
	Date: {
		type: Date,
		default: Date.now
	}
});
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
	transactions: [ TransactionsSchema ],
	amount: {
		type: Number,
		required: false,
		default: null
	}
});

//creating databasel model
const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
