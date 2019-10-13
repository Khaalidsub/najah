const User = require('../models/User');
const mongoose = require('mongoose');

const registerEmployee = async function(user){
   try{
       await user.save()
   }catch(e){
        res.status(401).send('somthing went wrong')
   }

}
module.exports = {registerEmployee : registerEmployee}