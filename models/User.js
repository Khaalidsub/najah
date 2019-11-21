
//****************************//
// Author of this Code:
// Muhammad Adeen Rabbani
// A17CS4006
//****************************// 




const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
		// add
		// Gender
		//IC number

		name: {
			type: String,
			requried: true,
			default: undefined,
			trim: true
		},
		IC: {
			type: String,
			requried: false,
			default: undefined,
			trim: true
		},
		gender: {
			type: String,
			requried: true,
			default: undefined
		},
		email: {
			type: String,
			requried: true,
			default: undefined,
			trim: true,
			unique: true, //One email can register once
			vlaidate(value) {
				if (!validator.isEmail(value)) {
					throw new error('Email is invalid.');
				}
			}
		},
		password: {
			type: String,
			require: true,
			default: undefined,
			trim: true,
			minlength: 9 //password must be 9 characters long
		},
		phone: {
			type: String,
			requried: true,
			default: undefined,
			maxlength: 14,
			//checking for Malaysian Number
			validate(value) {
				if (!validator.isMobilePhone(value, 'ms-MY', { strictMode: true })) {
					throw new Error('Phone Number is invalid');
				}
			}
		},
		//for members to know wether they deactivated or the application is pending
		status: {
			type: String,
			default: undefined,
			enum: ['active', 'deactivated', 'pending']
		},
		//roles will be assigned by the server.
		role: {
			type: String,
			requried: true,
			enum: ['user', 'admin']
		},
		imageProfile: {
			type: String,
			default: undefined,
			trim: true
		}
	},
	{
		timestamps: true
	}
);
//this method is connecting witrh the Application table during runtime
userSchema.virtual('application', {
	ref: 'Application',
	localField: '_id',
	foreignField: 'owner',
	justOne: true
});
//connecting with the cart model .
userSchema.virtual('cartItems',{
	ref: 'cart',
	localField: '_id',
	foreignField:'customer',
	count:false
})
//This method will make sure, the password is hashed before saving into the database
userSchema.pre('save', async function (next) {
	const user = this;
	console.log(user);
	if (user.isModified('password') || user.password) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.pre('remove', async function (next) {
	//Later we have to put here the logic that
	//when ever the user is romoved, delete all his applications
	//before deleting
});

//creating databasel model
const Users = mongoose.model('users', userSchema);
module.exports = Users;
//schema methods to be defined here.
