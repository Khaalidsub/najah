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



//Equipment Route//
router.get('/addEquipmentPage', isauthenticated, isAdmin, (req, res) => {
    const user = req.user;
    user.password = '';

    res.render('admin/equipment');
});

router.get('/viewEquipmentPage', isauthenticated, isAdmin, async(req, res) => {
    const user = req.user;
    user.password = '';

    const equs = await equipmentDA.viewEquipment();
    res.render('admin/equipmentListAdmin', { equ: equs, admin: user });
});

router.post('/addEquipment', isauthenticated, isAdmin, async(req, res) => {
    const user = req.user;
    user.password = '';

    const equ = new equipment(req.body); // instacne of user model
    equipmentDA.AddEquipment(equ); //user.save();
    res.render('admin/equipment', { admin: user });
});

router.get('/deleteEquipment/:id', isauthenticated, isAdmin, async(req, res) => {
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

router.get('/updateEquipmentPage/:id', isauthenticated, isAdmin, async(req, res) => {
    const user = req.user;
    user.password = '';

    const id = req.params.id;
    const val = await equipmentDA.SearchEquipment(req.params.id);
    console.log(id);
    res.render('admin/updateEquipment', { equ: val, admin: user });
});

router.post('/updateEquipment/:id', isauthenticated, isAdmin, async(req, res) => {
    const id = req.params.id;
    const val = await equipmentDA.updateEquipment(id, req.body);
    console.log(id);
    res.redirect('/admin/viewEquipmentPage');
});

module.exports = router;