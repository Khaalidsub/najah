const mongoose = require('mongoose');


const packageSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim:true
    },

     description:{
         type:String,
         required:true,
         trim:true
     },

     price:{
         type: Number,
         required:true
     },
     type:{
         type:String,
         enum:['male', 'female'],
         required:true
     }

})


  
const pkgs  =  mongoose.model('package', packageSchema);
  module.exports = pkgs
