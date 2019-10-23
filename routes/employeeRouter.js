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

  res.render('registerEmployee', { emailError: req.flash('email'), registered: req.flash('registered') });
})

//route for handling the registration 
router.post('/admin/register', isauthenticated, isAdmin, async (req, res) => {
  const employee = req.body
  employee.role = 'admin'
  const emp = new User(employee)
  try {
    await userDA.registerEmployee(emp)
    req.flash('registered', 'The admin has been registered successfully!')
    res.redirect(req.get('referer'))
  } catch (e) {

    req.flash('email', 'This Email has already been Registered!')
    res.redirect('/admin/registerPage')
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
    res.render('applications', { apps: fetchedApps, info: req.flash('info'), warning: req.flash('warning') })
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
    req.flash('info', 'Application already been ' + action + 'ed')

    res.redirect(req.get('referer'))
  }
  else {
    req.flash('warning', 'Application has been ' + action + 'ed successfully!')
    res.redirect(req.get('referer'))
  }
})

router.get('/admin/viewMembers', isauthenticated, isAdmin, async (req, res) => {
  const members = await userDA.fetchMembers();
  if (members == null) {
    req.flash('noView', "There are no members Registered!")
    res.render('MembersView', { noView: req.flash('noView'), deleted: req.flash('deleted'), failure: req.flash('failure'), searchfailure: req.flash('nosearch') })
  } else {

    res.render('MembersView', { apps: members, deleted: req.flash('deleted'), failure: req.flash('failure'), searchfailure: req.flash('nosearch') })
  }

  //Admin can delete Member Profiles. After that That member has to be registered again

  router.get('/admin/deleteMember/:id', isauthenticated, isAdmin, async (req, res) => {
    const id = req.params.id
    const val = await userDA.deleteMember(id);
    if (!val) {
      req.flash('failure', 'Error occured while Deleting!')
      res.redirect('/admin/viewMembers')
    } else {
      req.flash('deleted', 'Member has been deleted Successfully!')
      res.redirect('/admin/viewMembers');
    }

  })

})
//route for member search
router.get('/admin/searchMember', isauthenticated, isAdmin, async (req, res) => {

  const member = await userDA.searchUser(req.query.email);
  console.log(member);

  if (member.length) {
    req.flash('foundsearch', 'We have found a member!')
    res.render('MembersView', { apps: member, searchsuccess: req.flash('foundsearch') })
  } else {
    req.flash('nosearch', 'No member found with this email. Please provide valid email.');
    res.redirect('/admin/viewMembers')
  }

  //remove sensitive credentials brefore sending the database object
})




module.exports = router