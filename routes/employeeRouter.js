const express = require('express');
const router = new express.Router();
const passport = require('passport');
const userDA = require('../viewModel/UserDA')
const appDA = require('../viewModel/ApplicationDA')
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');
const isAdmin = require('../middlewares/isAdmin');

//const applications = require('../models/Application')

//Employee Registration

router.get('/admin/registerPage', isauthenticated, isAdmin, (req, res) => {
  res.render('registerEmployee');
})

//route for handling the registration 
router.post('/admin/register', isauthenticated, isAdmin, async (req, res) => {
  const employee = req.body
  employee.role = 'admin'
  const emp = new User(employee)
  try {
    await userDA.registerEmployee(emp)
    res.send('The admin Has been registered successfully!')
  } catch (e) {
    res.send(e)
  }
})
//Viewing member applications. (aslo add pagination)

router.get('/admin/viewapplications', isauthenticated, isAdmin, async (req, res) => {
  const query = req.query.status
  const fetchedApps = await appDA.fetchApps(query);
  // *** render same page with no applicaitoion flash mesg
  if (fetchedApps.length < 1) {
    req.flash('noView', "No Applications to View!")
    res.render('applications', { noView: req.flash('noView') })
  } else
    res.render('applications', { apps: fetchedApps })
})


//accept reject and delete application is done from the single controller
// Url is used to identify what action need to be performed!
//This is done to skip the redundant code in all the routes

router.get('/admin/performAction/:id/:action', isauthenticated, isAdmin, async (req, res) => {
  const urlArr = (req.url).split('/')
  const id = req.params.id;
  const action = req.params.action;
  const updated = await appDA.performAction(id, action);
  if (updated == 0) {
    req.flash('err', 'Application already been' + action + 'ed')
    res.render('applications', { error: req.flash('err') })
  }
  else {
    req.flash('success', 'Application has been ' + action + 'ed successfully!')
    res.render('applications', { msg: req.flash('success') })

  }

})

//route for member search
router.post('/admin/searchMember', isauthenticated, isAdmin, async (req, res) => {
  const member = await userDA.searchUser(req.body.email);
  //remove sensitive credentials brefore sending the database object
})




module.exports = router