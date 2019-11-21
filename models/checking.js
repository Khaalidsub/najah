const mongoose = require('mongoose');



const images = new mongoose.Schema({
    
    //later image will be added.
   
      avatar:{
          type:String ///saving the binary data
          //not required so far
      }

})



module.exports = mongoose.model('checking',images);