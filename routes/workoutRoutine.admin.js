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

router.get('/workoutRoutine', isauthenticated, isAdmin, async(req, res) => {
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
router.post('/addWorkoutRoutine', isauthenticated, isAdmin, upload.single('img_path'), async(req, res) => {
    const user = req.user;
    user.password = '';
    req.body.img_path = req.file.filename;
    const wr = new workoutRoutine(req.body);
    workoutRoutineDA.AddWR(wr);
    res.redirect('/admin/workoutRoutine');
});

//Workout update Routine
router.post('/updateWorkoutRoutine', isauthenticated, isAdmin, async(req, res, error) => {
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

module.exports = router;