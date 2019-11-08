const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
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
	},
	attendees: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		ref: 'users'
	}
});

const training = mongoose.model('Training', TrainingSchema);

module.exports = training;
