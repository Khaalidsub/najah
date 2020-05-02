//****************************//
// Author of this Code:
// Muhammad Adeen Rabbani
// A17CS4006
//****************************//
const merchandiseDA = require('../viewModel/MerchandiseDA');
const Merchandise = require('../models/Merchandise');
const checking = require('../models/checking');
const multer = require('multer');
const express = require('express');
const router = new express.Router();
const passport = require('passport');
const userDA = require('../viewModel/UserDA');
const appDA = require('../viewModel/ApplicationDA');
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');
const isAdmin = require('../middlewares/isAdmin');
const equipment = require('../models/Equipment');
const equipmentDA = require('../viewModel/equipmentDA');
const Training = require('../models/PersonalTraining');
const trainingDA = require('../viewModel/PersonalTrainingDA');
const workoutRoutine = require('../models/workoutRoutine');
const workoutRoutineDA = require('../viewModel/workoutRoutineDA');
const Package = require('../viewModel/packagesDA');

//const applications = require('../models/Application')

//Employee Registration
router.get('/admin/registerPage', isauthenticated, isAdmin, (req, res) => {
	//for navigation recognition
	const user = req.user;
	user.password = '';

	res.render('admin/registerEmployee', {
		emailError: req.flash('email'),
		registered: req.flash('registered'),
		admin: user
	});
});

//member registration
router.get('/admin/memberPage', isauthenticated, isAdmin, (req, res) => {
	//for navigation recognition
	const user = req.user;
	user.password = '';
	res.render('member/registerMember', { admin: user });
});

//route for handling the registration
router.post('/admin/register', isauthenticated, isAdmin, async (req, res) => {
	const employee = req.body;
	employee.role = 'admin';
	const emp = new User(employee);
	try {
		await userDA.registerEmployee(emp);
		req.flash('registered', 'The admin has been registered successfully!');
		res.redirect(req.get('referer'));
	} catch (e) {
		req.flash('email', 'This Email has already been Registered!');
		res.redirect('/admin/registerPage');
	}
});
//Viewing member applications. (aslo add pagination)

router.get('/admin/viewapplications', isauthenticated, isAdmin, async (req, res) => {
	//for navigation recognition
	const user = req.user;
	user.password = '';

	const query = req.query.status;

	const fetchedApps = await appDA.fetchApps(query);
	// *** render same page with no applicaitoion flash mesg
	if (fetchedApps.length < 1) {
		req.flash('noView', 'No Applications to View!');
		res.render('admin/applications', { noView: req.flash('noView'), admin: user });
	} else
		res.render('admin/applications', {
			apps: fetchedApps,
			info: req.flash('info'),
			warning: req.flash('warning'),
			admin: user
		});
});

//accept reject and delete application is done from the single controller
// Url is used to identify what action need to be performed!
//This is done to skip the redundant code in all the routes

router.get('/admin/performAction/:id/:action', isauthenticated, isAdmin, async (req, res) => {
	const urlArr = req.url.split('/');
	const id = req.params.id;
	const action = req.params.action;
	const com = req.query.comment;

	const updated = await appDA.performAction(id, action, com);
	if (updated == 0) {
		req.flash('info', 'Application already been ' + action + 'ed');

		res.redirect(req.get('referer'));
	} else {
		req.flash('warning', 'Application has been ' + action + 'ed successfully!');
		res.redirect(req.get('referer'));
	}
});

router.get('/admin/viewMembers', isauthenticated, isAdmin, async (req, res) => {
	const members = await userDA.fetchMembers();

	//for navigation recognition
	const user = req.user;
	user.password = '';

	if (members === null) {
		req.flash('noView', 'There are no members Registered!');
		res.render('admin/MembersView', {
			noView: req.flash('noView'),
			deleted: req.flash('deleted'),
			failure: req.flash('failure'),
			searchfailure: req.flash('nosearch'),
			admin: user
		});
	} else {
		res.render('admin/MembersView', {
			apps: members,
			deleted: req.flash('deleted'),
			failure: req.flash('failure'),
			searchfailure: req.flash('nosearch'),
			admin: user
		});
	}
});
//Admin can delete Member Profiles. After that That member has to be registered again

router.get('/admin/deleteMember/:id', isauthenticated, isAdmin, async (req, res) => {
	const id = req.params.id;
	console.log(id);

	const val = await userDA.deleteMember(id);
	if (!val) {
		req.flash('failure', 'Error occured while Deleting!');
		res.redirect('/admin/viewMembers');
	} else {
		req.flash('deleted', 'Member has been deleted Successfully!');
		res.redirect('/admin/viewMembers');
	}
});

//route for member search
router.get('/admin/searchMember', isauthenticated, isAdmin, async (req, res) => {
	const member = await userDA.searchUser(req.query.email);
	console.log(member);

	//for navigation recognition
	const user = req.user;
	user.password = '';

	if (member.length) {
		req.flash('foundsearch', 'We have found a member!');
		res.render('admin/MembersView', { apps: member, searchsuccess: req.flash('foundsearch'), admin: user });
	} else {
		req.flash('nosearch', 'No member found with this email. Please provide valid email.');
		res.redirect('/admin/viewMembers');
	}

	//remove sensitive credentials brefore sending the database object
});

//admin dashboard
router.get('/admin/adminProfile', isauthenticated, isAdmin, (req, res) => {
	const user = req.user;
	user.password = '';

	res.render('admin/adminProfile', { admin: user });
});

//Merchandise admin controls starts here!
//admin view merchandise

router.get('/admin/addMerchandise', isauthenticated, isAdmin, async (req, res) => {
	res.render('addMerchandise', {
		imageError: req.flash('imageError'),
		addMerchandise: req.flash('addMerchandise'),
		admin: 1
	});
});

//where to store, and with what name config.
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'public/products');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});

const uploadmarch = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg)/)) {
			return cb(new Error('File type not supported!'));
		}

		cb(undefined, true);
	},
	storage: storage
});

//adding new Merchandise
router.post(
	'/admin/addMerchandise',
	uploadmarch.single('image'),
	async (req, res) => {
		var merch = new Merchandise(req.body);
		merch.avatar = req.file.filename;
		await merchandiseDA.addMerchandise(merch);
		req.flash('addMerchandise', 'The item has been added successfully');
		res.redirect(req.get('referer'));
	},
	(error, req, res, next) => {
		req.flash('imageError', error.message + ' Please Uplaod .JPEG or JPG file');
		res.redirect(req.get('referer'));
	}
);

router.get('/admin/viewMerchandise', isauthenticated, isAdmin, async (req, res) => {
	try {
		const values = await merchandiseDA.fetchMerchandise(req.user.role);
		if (values) {
			res.render('admin/adminMerchandise', {
				merchandise: values,
				updated: req.flash('updateSuccess'),
				deleted: req.flash('deleted'),
				deleteErr: req.flash('deleteErr'),
				admin: req.user.role
			});
		} else {
			req.flash('nothingToShow', 'There are no merchandise in the system!');
			res.render('admin/adminMerchandise', {
				admin: req.user.name,
				merchandise: values,
				nothing: req.flash('nothingToShow')
			});
		}
	} catch (e) {
		console.log(e);
	}
});

//delete Merchandise from the system
router.get('/admin/deleteMerchandise/:id', isauthenticated, isAdmin, async (req, res) => {
	try {
		const deleted = await merchandiseDA.deleteMerchandise(req.params.id);
		if (deleted) {
			req.flash('deleted', 'Item has been deleted...');
			res.redirect(req.get('referer'));
		}
	} catch (error) {
		req.flash('deleteErr', 'Something Went Wrong While Deleting!');
		res.redirect(req.get('referer'));
	}
});

//update an existing Merchandise in the system
router.get('/admin/updateMerchandisePage', isauthenticated, isAdmin, async (req, res) => {
	const item = await Merchandise.findById(req.query.value);
	res.render('admin/updateMerchandise', { value: item, admin: 1 });
});

router.post('/admin/updateMerchandise/:id', isauthenticated, isAdmin, async (req, res) => {
	//logic goes here
	try {
		const updated = await Merchandise.findByIdAndUpdate(req.params.id, req.body);
		req.flash('updateSuccess', 'Item has been updated and saved successfully!');
		res.redirect('/admin/viewMerchandise');
	} catch (error) {}
});

//=============================

//****************************//
// Author of this Code:
// Sheref Abolmagd
// matic number goes here**
//****************************//

//Equipment Route//
router.get('/admin/addEquipmentPage', isauthenticated, isAdmin, (req, res) => {
	const user = req.user;
	user.password = '';

	res.render('admin/equipment');
});

router.get('/admin/viewEquipmentPage', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';

	const equs = await equipmentDA.viewEquipment();
	res.render('admin/equipmentListAdmin', { equ: equs, admin: user });
});

router.post('/admin/addEquipment', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';

	const equ = new equipment(req.body); // instacne of user model
	equipmentDA.AddEquipment(equ); //user.save();
	res.render('admin/equipment', { admin: user });
});

router.get('/admin/deleteEquipment/:id', isauthenticated, isAdmin, async (req, res) => {
	const id = req.params.id;
	const val = await equipmentDA.DelEquipment(id);

	if (!val) {
		req.flash('failure', 'Error occured while Deleting!');
		res.redirect('/admin/viewEquipmentPage');
	} else {
		req.flash('deleted', 'Equipment has been deleted Successfully!');
		res.redirect('/admin/viewEquipmentPage');
	}
});

router.get('/admin/updateEquipmentPage/:id', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';

	const id = req.params.id;
	const val = await equipmentDA.SearchEquipment(req.params.id);
	console.log(id);
	res.render('admin/updateEquipment', { equ: val, admin: user });
});

router.post('/admin/updateEquipment/:id', isauthenticated, isAdmin, async (req, res) => {
	const id = req.params.id;
	const val = await equipmentDA.updateEquipment(id, req.body);
	console.log(id);
	res.redirect('/admin/viewEquipmentPage');
});

//Personal Training Routes
//view training page
router.get('/admin/viewTrainingPage', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';

	const training = await trainingDA.adminfetchTraining();
	const trainers = await userDA.fetchEmployees();
	if (training.length < 1) {
		req.flash('noView', 'No packages to View!');
		res.render('admin/PersonalTraining', {
			noView: req.flash('noView'),
			admin: user,
			deleted: req.flash('deleted'),
			failure: req.flash('failure')
		});
	} else {
		res.render('admin/PersonalTraining', {
			training,
			trainers,
			admin: user,
			deleted: req.flash('deleted'),
			warning: req.flash('warning'),
			failure: req.flash('failure')
		});
	}
});
//add training page
router.get('/admin/addTrainingPage', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';

	//get a list of all users that are admin
	const trainers = await userDA.fetchEmployees();

	res.render('admin/PersonalTraining', { admin: user, trainers, failure: req.flash('failure') });
});
//add training packages
router.post('/admin/addTraining', isauthenticated, isAdmin, async (req, res) => {
	const train = new Training(req.body); // instacne of user model

	try {
		const trainers = await trainingDA.addTraining(train); //user.save();
		//successs with flash

		req.flash('warning', 'Package has been added successfully!');
		res.redirect('/admin/viewTrainingPage');
	} catch (error) {
		//failure going back to addTraining
		req.flash('failure', 'Name of the Package do already exist!');
		res.redirect('/admin/addTrainingPage');
	}
});
router.post('/admin/updateTraining/:id', isauthenticated, isAdmin, async (req, res) => {
	const id = req.params.id;
	const val = await trainingDA.updateTraining(id, req.body);

	//failure going back to addTraining
	if (!val) {
		req.flash('failure', 'Package has been updated unsuccessfully!');
		res.redirect('/admin/viewTrainingPage');
	} else {
		//successs with flash
		req.flash('warning', 'Package has been updated successfully!');
		res.redirect('/admin/viewTrainingPage');
	}
});
//deleting packages
router.get('/admin/deleteTraining/:id', isauthenticated, isAdmin, async (req, res) => {
	const id = req.params.id;
	const val = await trainingDA.deleteTraining(id);
	//failure
	if (!val) {
		req.flash('failure', 'Package has been deleted unsuccessfully!');
		res.redirect('/admin/viewTrainingPage');
	} else {
		//successs
		req.flash('deleted', 'Package has been deleted Successfully!');
		res.redirect('/admin/viewTrainingPage');
	}
});

router.get('/admin/addPackagePage', isauthenticated, isAdmin, (req, res) => {
	const user = req.user;
	res.render('admin/addPackage', { admin: user });
});
router.post('/admin/addPackages', isauthenticated, isAdmin, async (req, res) => {
	await Package.savePackage(req.body);
	res.redirect(req.get('referrer'));
});

//update packages like trainer and cost

//Workout add Routine View
router.get('/admin/workoutRoutine', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';
	const wrs = await workoutRoutineDA.viewWR();
	res.render('admin/workoutRoutine', { wrs: wrs, admin: user });
});

//Upload File
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/images/upload/');
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.substring(file.mimetype.search('/') + 1));
	}
});
var upload = multer({ storage: storage });

//Workout add Routine
router.post('/admin/addWorkoutRoutine', isauthenticated, isAdmin, upload.single('img_path'), async (req, res) => {
	const user = req.user;
	user.password = '';
	req.body.img_path = req.file.filename;
	const wr = new workoutRoutine(req.body);
	workoutRoutineDA.AddWR(wr);
	res.redirect('/admin/workoutRoutine');
});

//Workout update Routine
router.post('/admin/updateWorkoutRoutine', isauthenticated, isAdmin, async (req, res, error) => {
	console.log(req.body);
	if (req.body.action == 'Update') {
		console.log('upd');
		const del = await workoutRoutineDA.updateWR(req.body.id, req.body);
	} else if (req.body.action == 'Delete') {
		console.log('dle');
		await workoutRoutineDA.DelWR(req.body.id);
	}
	res.redirect('/admin/workoutRoutine');
});

//Loading an error page if coming request does not matches with
//any of the above configured routes
//MAKE SURE WE PUT IT AT THE END OF ALL THE ROUTES
router.get('/admin/*', (req, res) => {
	res.render('errorPage');
});

module.exports = router;
