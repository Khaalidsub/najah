const Training = require('../models/PersonalTraining');
const user = require('../models/User');
const mongoose = require('mongoose');

const addTraining = async (train) => {
	const training = await train.save();
	if (!train) {
		throw new Error();
	} else {
		return training;
	}
};
const fetchTraining = async (program) => {
	try {
		// taking out the sensitive information of the user, before sending back to the client!
		const trainingList = await Training.find({ type: program });

		//get the trainer id from user
		if (!trainingList) {
			throw new Error();
		}
		for (var training of trainingList) {
			const trainees = await training.populate('trainer', '-password -role').execPopulate();
		}

		return trainingList;
	} catch (error) {
		return null;
	}
};
const adminfetchTraining = async () => {
	try {
		// taking out the sensitive information of the user, before sending back to the client!
		const trainingList = await Training.find();

		//get the trainer id from user
		if (!trainingList) {
			throw new Error();
		}
		for (var training of trainingList) {
			const trainees = await training.populate('trainer', '-password -role').execPopulate();
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
		const training = await Training.findById(id);

		if (!training) {
			throw new Error();
		} else {
			return training;
		}
	} catch (error) {
		return null;
	}
};
module.exports = { getTraining, adminfetchTraining, addTraining, fetchTraining, updateTraining, deleteTraining };
