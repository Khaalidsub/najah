const Payment = require('../models/Payment');
const user = require('../models/User');
const mongoose = require('mongoose');

const createPayment = async (id, cost) => {
	try {
		const newPayment = new Payment({ member: id, status: 'unpaid', amount: cost });

		const db = await newPayment.save();
		console.log('db', db);
	} catch (error) {
		console.log(error);
	}
};

const updatePayment = async (id, cost) => {
	try {
		const payment = await Payment.findOne({ member: id });

		if (payment) {
			var fee = payment.amount;
			fee += cost;
			console.log('cost', fee);
			payment.amount = fee;
			payment.status = 'unpaid';
			const response = await payment.save();

			return response;
			//payment.status = 'unpaid';
		} else {
			throw new Error();
		}
	} catch (error) {
		console.log(error);
	}
};

const getPayment = async (id) => {
	try {
		const payment = await Payment.findOne({ member: id });
		//payment.populate('member')
		return payment;
	} catch (error) {
		console.log(error);
	}
};
const fetchPayments = async (id) => {
	try {
		const payment = await Payment.findOne({ member: id });

		//payment.populate('member')
		return payment;
	} catch (error) {
		console.log(error);
	}
};

const completePayment = async (userid, transaction) => {
	try {
		const payment = await Payment.findOne({ member: userid });
		payment.amount = 0;
		//pushing the transaction id
		payment.transactions.push(transaction);
		return await payment.save();
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	createPayment,
	updatePayment,
	getPayment,
	completePayment,
	fetchPayments
};
