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
const isUser = require('../middlewares/isUser');
// /Personal Training Routes/ /
//view Training
router.get('/viewTrainingPage', isauthenticated, isUser, async(req, res) => {
    const profile = req.user;
    profile.password = '';
    //get the size of weight loss
    const weight = await Training.find({ type: 'weight-loss' });
    //get the size of muscle gain
    const muscle = await Training.find({ type: 'muscle-gain' });
    //get the size of athlete
    const athlete = await Training.find({ type: 'athlete' });

    res.render('member/mainTraining', {
        noView: req.flash('noView'),
        profile,
        weight,
        muscle,
        athlete,
        failure: req.flash('failure')
    });
});
router.get('/viewTraining', isauthenticated, isUser, async(req, res) => {
    const profile = req.user;
    profile.password = '';

    const program = req.query.program;
    console.log('Program ' + program);

    const training = await trainingDA.fetchTraining(program);

    const trainers = await userDA.fetchEmployees();
    if (training.length < 1) {
        req.flash('noView', 'No Trainings to View!');
        res.render('member/viewTraining', {
            noView: req.flash('noView'),
            profile,
            failure: req.flash('failure')
        });
    } else {
        res.render('member/viewTraining', {
            training,
            profile,
            deleted: req.flash('deleted'),
            warning: req.flash('warning'),
            failure: req.flash('failure'),
            info: req.flash('info')
        });
    }
});
//join Training
router.get('/joinTraining/:id', isauthenticated, isUser, async(req, res) => {
    const id = req.params.id;

    const user = req.user;

    if (user.trainingMember == undefined) {
        user.trainingMember = id;
        //	let val = await userDA.joinTraining(user._id, id);
        let val = await userDA.joinTraining(user._id, id);
        if (!val) {
            req.flash('failure', 'Package has not been added!');
            res.render('/member/viewTrainingPage');
        } else {
            //successs
            //get the training program to get the price
            const trainPackage = await trainingDA.getTraining(id);

            //add amount to the payment module
            const response = await paymentDA.updatePayment(req.user.id, trainPackage.cost);

            req.flash('warning', 'Package has been added into your system Successfully!');
            res.redirect('/member/memberProfile');
        }
    } else {
        req.flash('info', 'You already have another program! ');
        res.redirect('/member/viewTrainingPage');
    }
});
//quit training
router.post('/quitTraining/:id', isauthenticated, isUser, async(req, res) => {
    const id = req.params.id;
    const user = req.user;
    console.log('helo there here i am', id);
    let val = await userDA.quitTraining(user._id, id);
    if (!val) {
        req.flash('failure', 'Package has not been added!');
        res.render('/member/memberProfile');
    } else {
        //successs
        req.flash('warning', 'Training Program has been removed from your account Successfully!');
        res.redirect('/member/memberProfile');
    }
});


module.exports = router;