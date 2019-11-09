const Training = require('../models/PersonalTraining');
const user = require('../models/User');
const mongoose = require('mongoose');

const addTraining = async (train) => {
	try {
		console.log(train);

		const training = await train.save();
		if (!train) {
			throw new Error();
		} else {
			return training;
		}
	} catch (error) {
		console.log(e);
		return null;
	}
};
const fetchTraining = async () => {
	try {
		// taking out the sensitive information of the user, before sending back to the client!
		const trainingList = await Training.find();
		console.log(trainingList);
		//get the trainer id from user
		if (!trainingList) {
			throw new Error();
		}
		for (var training of trainingList) {
			const trainees = await training.populate('trainer', '-password -role').execPopulate();
			console.log('hello' + trainees);
		}

		return trainingList;
	} catch (error) {
		return null;
	}
};

const updateTraining = async (id, body) => {
	try {
		const training = await Training.findByIdAndUpdate(id, body);
		if (!updateTraining) {
			throw new Error();
		} else {
			console.log(training);
			return training;
		}
	} catch (error) {
		return null;
	}
};

const deleteTraining = async (id) => {
	try {
		const training = await Training.findByIdAndDelete(id);
		if (!deleteTraining) {
			throw new Error();
		} else {
			return training;
		}
	} catch (error) {
		return null;
	}
};
const getTraining = async (id) => {
	try {
		console.log(id);

		const training = await Training.findById(id);
		console.log(training);

		if (!training) {
			throw new Error();
		} else {
			return training;
		}
	} catch (error) {
		return null;
	}
};
module.exports = { getTraining, addTraining, fetchTraining, updateTraining, deleteTraining };
