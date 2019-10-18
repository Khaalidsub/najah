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

router.get('/admin/registerPage',isauthenticated,isAdmin, (req,res)=>{
     res.render('registerEmployee');
})

//route for handling the registration 
router.post('/admin/register',isauthenticated,isAdmin,async (req,res)=>{
   const employee = req.body
   employee.role  = 'admin'
   const emp = new User(employee)
   try{
     await userDA.registerEmployee(emp)
     res.send('The admin Has been registered successfully!')
   }catch(e){
       res.send(e)
   }
})
  //Viewing member applications. (aslo add pagination)

router.get('/admin/viewapplications',isauthenticated,isAdmin, async (req,res)=>{
    const query = req.query.status
   const fetchedApps = await appDA.fetchApps(query);
   // *** render same page with no applicaitoion flash mesg
  if(fetchedApps.length < 1){res.send('no applications to display')}else
      res.render('applications',{apps:fetchedApps})
})
//accept or reject the application of the member

//route for member search
router.post('/admin/usersearch', isauthenticated, isAdmin, async (req,res)=>{
   const member = await userDA.searchUser(req.body.email);
     
})




module.exports = router