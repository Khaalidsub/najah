const merchandiseDA = require('../viewModel/MerchandiseDA');
const Merchandise = require('../models/Merchandise');
const express = require('express');
const router = new express.Router();
const isauthenticated = require('../middlewares/checkAuthentication');
const isAdmin = require('../middlewares/isAdmin');
const multer = require('multer');
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
	'/addMerchandise',
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

router.get('/viewMerchandise', isauthenticated, isAdmin, async (req, res) => {
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
router.get('/deleteMerchandise/:id', isauthenticated, isAdmin, async (req, res) => {
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
router.get('/updateMerchandisePage', isauthenticated, isAdmin, async (req, res) => {
	const item = await Merchandise.findById(req.query.value);
	res.render('admin/updateMerchandise', { value: item, admin: 1 });
});

router.post('/updateMerchandise/:id', isauthenticated, isAdmin, async (req, res) => {
	//logic goes here
	try {
		const updated = await Merchandise.findByIdAndUpdate(req.params.id, req.body);
		req.flash('updateSuccess', 'Item has been updated and saved successfully!');
		res.redirect('/admin/viewMerchandise');
	} catch (error) {}
});


//Merchandise admin controls starts here!
//admin view merchandise

router.get('/addMerchandise', isauthenticated, isAdmin, async (req, res) => {
	res.render('addMerchandise', {
		imageError: req.flash('imageError'),
		addMerchandise: req.flash('addMerchandise'),
		admin: 1
	});
});




//Merchandise admin controls starts here!
//admin view merchandise

router.get('/addMerchandise', isauthenticated, isAdmin, async(req, res) => {
    res.render('addMerchandise', {
        imageError: req.flash('imageError'),
        addMerchandise: req.flash('addMerchandise'),
        admin: 1
    });
});




module.exports = router; 