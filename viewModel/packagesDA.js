const Packages = require('../models/Package');

const fetchPackages = async (usertype) => {
	try {
		const dbPackages = await Packages.find({ type: usertype });
		if (dbPackages) {
			return dbPackages;
		} else throw new Error();
	} catch (error) {
		return null;
	}
};
const save = async (value) => {
	obj = new Packages(value);
	await obj.save();
	return;
};

const getPackage = async (id) => {
	try {
		const db = await Packages.findById(id);
		if (db) {
			return db;
		} else throw new Error();
	} catch (error) {
		console.log(error);
	}
};

module.exports = { fetchPackages: fetchPackages, savePackage: save, getPackage };
