
//****************************//
// Author of this Code:
// Muhammad Adeen Rabbani
// A17CS4006
//****************************//

const express = require('express');
const router = new express.Router();
const passport = require('passport');
const userDA = require('../viewModel/UserDA');
const appDA = require('../viewModel/ApplicationDA');
const User = require('../models/User');
const isauthenticated = require('../middlewares/checkAuthentication');
const isAdmin = require('../middlewares/isAdmin');

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

  const urlArr = (req.url).split('/')
  const id = req.params.id;
  const action = req.params.action;
  const com = req.query.comment;

  
  const updated = await appDA.performAction(id, action, com);
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

	//Admin can delete Member Profiles. After that That member has to be registered again

	router.get('/admin/deleteMember/:id', isauthenticated, isAdmin, async (req, res) => {
		const id = req.params.id;
		const val = await userDA.deleteMember(id);
		if (!val) {
			req.flash('failure', 'Error occured while Deleting!');
			res.redirect('/admin/viewMembers');
		} else {
			req.flash('deleted', 'Member has been deleted Successfully!');
			res.redirect('/admin/viewMembers');
		}
	});
});
//route for member search
router.get('/admin/searchMember', isauthenticated, isAdmin, async (req, res) => {

  const member = await userDA.searchUser(req.query.email);
  console.log(member);

  	//for navigation recognition
	const user = req.user;
	user.password = '';

  if (member.length) {
    req.flash('foundsearch', 'We have found a member!')
    res.render('MembersView', { apps: member, searchsuccess: req.flash('foundsearch'),admin:user })
  } else {
    req.flash('nosearch', 'No member found with this email. Please provide valid email.');
    res.redirect('/admin/viewMembers')
  }

  //remove sensitive credentials brefore sending the database object
})


//admin dashboard
router.get('/admin/adminProfile', isauthenticated, isAdmin, (req, res) => {
	const user = req.user;
	user.password = '';
	res.render('adminProfile', { admin: user });
});
//Loading an error page if coming request does not matches with 
//any of the above configured routes
//MAKE SURE WE PUT IT AT THE END OF ALL THE ROUTES
router.get('/admin/*', (req,res)=>{
  res.render('errorPage');
})







module.exports = router;
