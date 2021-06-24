const multer = require('multer');
const express = require('express');
const router = new express.Router();

const userDA = require('../viewModel/UserDA');
const appDA = require('../viewModel/ApplicationDA');
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');
const isAdmin = require('../middlewares/isAdmin');
const Package = require('../viewModel/packagesDA');

router.get('/registerPage', isauthenticated, isAdmin, (req, res) => {
    //for navigation recognition
    const user = req.user;
    user.password = '';

    res.render('admin/registerEmployee', {
        emailError: req.flash('email'),
        registered: req.flash('registered'),
        admin: user
    });
});


router.get('/memberPage', isauthenticated, isAdmin, (req, res) => {

    const user = req.user;
    user.password = '';
    res.render('member/registerMember', { admin: user });
});


router.post('/register', isauthenticated, isAdmin, async(req, res) => {
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

router.get('/viewapplications', isauthenticated, isAdmin, async(req, res) => {
 
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


router.get('/performAction/:id/:action', isauthenticated, isAdmin, async(req, res) => {
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



//admin dashboard
router.get('/adminProfile', isauthenticated, isAdmin, (req, res) => {
    const user = req.user;
    user.password = '';

    res.render('admin/adminProfile', { admin: user });
});


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


router.get('/addPackagePage', isauthenticated, isAdmin, (req, res) => {
    const user = req.user;
    res.render('admin/addPackage', { admin: user });
});
router.post('/addPackages', isauthenticated, isAdmin, async(req, res) => {
    await Package.savePackage(req.body);
    res.redirect(req.get('referrer'));
});


router.get('/*', (req, res) => {
    res.render('errorPage');
});

module.exports = router;