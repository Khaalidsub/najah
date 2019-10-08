const express = require('express')
const router = new express.Router()
const passport = require('passport')
const User = require('../models/User')
const isauthenticated = require('../middlewares/checkAuthentication')



//THESE ROUTES WERE CREATED FOR TESTING PURPOSES


router.post('/register', async (req,res)=>{ 
    const user = new User(req.body)// instacne of user model
    user.role ='user'
    try {
         await user.save()
         res.send("registered")
    } catch (error) {
        res.send(error)
    }
 })
 router.get('/registration', (req,res)=>{
    res.render('register')})

 router.get ('/loginpage',(req,res)=>{
     res.render('Login')
 })
 router.get('/login',passport.authenticate('local'), (req,res)=>{
     console.log(req.query);
     
     res.send('you are loggedin as adeen' + req.user.name)
    
 
 })
 
 router.get('/profile', isauthenticated, (req,res)=>{
     res.send('this route is working fine')
 })

 


module.exports = router