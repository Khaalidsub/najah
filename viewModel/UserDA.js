//This file contains all the database access logic for USER database


const User = require('../models/User')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//Method to fetch details for authentication 
const findByCredentials =  async function (email,password){ 
    try{
    const foundUser = await User.findOne({email}) 
    if(!foundUser){throw new Error()}
    const isMatch = await bcrypt.compare(password , foundUser.password)
    if(!isMatch){throw new Error()}
    
    return foundUser
    } catch(e){
         return null
    }
   
}

module.exports = {findByCredentials: findByCredentials}
