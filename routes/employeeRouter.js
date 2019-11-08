//****************************//
// Author of this Code:
// Muhammad Adeen Rabbani
// A17CS4006
//****************************//
const merchandiseDA = require('../viewModel/MerchandiseDA')
const Merchandise = require('../models/Merchandise')
const checking = require('../models/checking')
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

//const applications = require('../models/Application')

//Employee Registration

router.get('/admin/registerPage', isauthenticated, isAdmin, (req, res) => {
	//for navigation recognition
	const user = req.user;
	user.password = '';

	res.render('registerEmployee', {
		emailError: req.flash('email'),
		registered: req.flash('registered'),
		admin: user
	});
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
		res.render('applications', { noView: req.flash('noView'), admin: user });
	} else
		res.render('applications', {
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

	if (members == null) {
		req.flash('noView', 'There are no members Registered!');
		res.render('MembersView', {
			noView: req.flash('noView'),
			deleted: req.flash('deleted'),
			failure: req.flash('failure'),
			searchfailure: req.flash('nosearch'),
			admin: user
		});
	} else {
		res.render('MembersView', {
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
		res.render('MembersView', { apps: member, searchsuccess: req.flash('foundsearch'), admin: user });
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

	res.render('adminProfile', { admin: user });
});


//admin view merchandise

router.get('/admin/addMerchandisePage', isauthenticated, isAdmin, async (req, res) => {
	res.render('addMerchandise', {imageError:req.flash('imageError') , addMerchandise: req.flash('addMerchandise')});
})





//where to store, and with what name config.
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname)
	}
})


const upload = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg)/)) {
			console.log('came here');
			
		  return	cb(new Error("File type not supported!"))
		}
		console.log('came here as well');
		
		cb(undefined, true);
	},
	storage: storage
})
router.post('/admin/addMerchandise', upload.single('image'), async (req, res) => {

	var merch = new Merchandise(req.body);
	merch.avatar = req.file.path
	merch.status = true
	await merchandiseDA.addMerchandise(merch)
	req.flash('addMerchandise','The item has been added successfully')
	res.redirect(req.get('referer'));

}, (error, req, res, next) => { 
	req.flash('imageError', error.message);
	res.redirect(req.get('referer'));
})


// PRACTICE FOR AJAX

 router.get('/ajax',(req,res)=>{
	 res.render('ajaxPractice');
 })

 router.post('/admin/ajax', (req,res)=>{
	 console.log("the request came");
	 console.log(req.body)
	 res.send({name: req.body.name})
 })




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

	res.render('equipment');
});

router.get('/admin/viewEquipmentPage', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';

	const equs = await equipmentDA.viewEquipment();
	res.render('equipmentListAdmin', { equ: equs, admin: user });
});

router.post('/admin/addEquipment', isauthenticated, isAdmin, async (req, res) => {
	const user = req.user;
	user.password = '';

	const equ = new equipment(req.body); // instacne of user model
	equipmentDA.AddEquipment(equ); //user.save();
	res.render('equipment', { admin: user });
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
	res.render('updateEquipment', { equ: val, admin: user });
});

router.post('/admin/updateEquipment/:id', isauthenticated, isAdmin, async (req, res) => {
	const id = req.params.id;
	const val = await equipmentDA.updateEquipment(id, req.body);
	console.log(id);
	res.redirect('/admin/viewEquipmentPage');
});





// router.get('/checkPage', (req, res) => {
// 	res.render('checking')
// })

// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, 'public/images')
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, Date.now() + file.originalname)
// 	}
// })


// const upload1 = multer({
// 	storage: storage
// })

// router.post('/checking', upload.single('upload'), async (req, res) => {
// 	var image = new checking();
// 	image.avatar = req.file.path;
// 	console.log(req.file.path)
// 	console.log(image.avatar.replace("public\\images\\", ""))
// 	await image.save()
// 	res.send("The file has been uploaded!")
// })

router.get('/getpic', async (req, res) => {
	const image = await Merchandise.findById("5dc4cb59d230af3da461dc80")
	console.log(image)
    image.avatar = image.avatar.replace("images\\","")
	//res.set('Content-Type', 'image/jpeg')
	res.render('image', {path: image.avatar });
})

//Loading an error page if coming request does not matches with
//any of the above configured routes
//MAKE SURE WE PUT IT AT THE END OF ALL THE ROUTES
router.get('/admin/*', (req, res) => {
	res.render('errorPage');
});






module.exports = router;
