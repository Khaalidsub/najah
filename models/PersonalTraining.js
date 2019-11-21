const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		default: undefined,
		trim: true
	},
	description: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true,
		enum: [ 'weight-loss', 'muscle-gain', 'athlete' ]
	},
	days: {
		type: Number,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	cost: {
		type: Number,
		required: true
	},
	trainer: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		ref: 'users'
	}
});

//this method is connecting witrh the User table during runtime
TrainingSchema.virtual('Users', {
	ref: 'users',
	localField: '_id',
	foreignField: 'trainingMember',
	justOne: true
});

const training = mongoose.model('Training', TrainingSchema);

module.exports = training;
