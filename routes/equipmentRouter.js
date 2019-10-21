const express = require('express');
const router = new express.Router();
const passport = require('passport');
const equipment = require('../models/Equipment');
const equipmentDA = require('../viewModel/equipmentDA');
const isauthenticated = require('../middlewares/checkAuthentication');
const isuser = require('../middlewares/isUser');
var http = require('http');
var formidable = require('formidable');

router.get('/member/addEquipmentPage', (req, res) => {
	res.render('equipment');
});

router.get('/member/viewEquipmentPage', async (req, res) => {
    const equs = await equipmentDA.viewEquipment();
	res.render('equipmentList',{equ: equs});
});

router.post('/member/addEquipment', async (req, res) => {
    const equ = new equipment(req.body); // instacne of user model
	try {
        let form = new formidable.IncomingForm({
            keepExtensions: true
        });
        // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.
        form.parse(req, function(err, fields, files) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(files);
            let path = __dirname + '/' + files.upload.name;
            fs.rename(files.upload.path, path, function (err) {
                if (err) throw err;
            });
        });
		equipmentDA.AddEquipment(equ); //user.save();
		res.render('equipment');
	} catch (error) {
		res.send(error);
	}
});

module.exports = router;