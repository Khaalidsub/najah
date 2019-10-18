const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerMember = async (User) => {
	await User.save();
}
const registerEmployee = async function(user){
	try{
		await user.save()
	}catch(e){
		 res.status(401).send('somthing went wrong')
	}
 
 }

 const searchUser = async (email)=>{
	 try {
		const member = await User.find({email: email})
		if(!member){res.send("no member found")}else{
			res.send(member);
		}
	 } catch (e) {
		 res.send(e)
	 }
 }

module.exports = { registerMember: registerMember, registerEmployee: registerEmployee, searchUser:searchUser };
