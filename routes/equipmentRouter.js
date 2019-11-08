// Sherif Khaled Abouelmagd
// A17CS4009

const express = require('express');
const router = new express.Router();
const passport = require('passport');
const equipment = require('../models/Equipment');
const equipmentDA = require('../viewModel/equipmentDA');
const isauthenticated = require('../middlewares/checkAuthentication');
const isuser = require('../middlewares/isUser');
var http = require('http');
var formidable = require('formidable');

router.get('/member/viewEquipmentPage', async (req, res) => {
	const equs = await equipmentDA.viewEquipment();
	res.render('equipmentList', { equ: equs });
});

router.get('/admin/addEquipmentPage', (req, res) => {
	res.render('equipment');
});

router.get('/admin/viewEquipmentPage', async (req, res) => {
	const equs = await equipmentDA.viewEquipment();
	res.render('equipmentListAdmin', { equ: equs });
});

router.post('/admin/addEquipment', async (req, res) => {
	const equ = new equipment(req.body); // instacne of user model
	equipmentDA.AddEquipment(equ); //user.save();
	res.render('equipment');
});

router.get('/admin/deleteEquipment/:id', async (req, res) => {
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

router.get('/admin/updateEquipmentPage/:id', async (req, res) => {
	const id = req.params.id;
	const val = await equipmentDA.SearchEquipment(req.params.id);
	console.log(id);
	res.render('updateEquipment', { equ: val });
});

router.post('/admin/updateEquipment/:id', async (req, res) => {
	const id = req.params.id;
	const val = await equipmentDA.updateEquipment(id, req.body);
	console.log(id);
	res.redirect('/admin/viewEquipmentPage');
});

module.exports = router;
