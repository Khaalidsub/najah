

//This file only configure mongoose with mongoDB
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/NajjahApplication' , {useUnifiedTopology:true,useCreateIndex:true, useNewUrlParser:true, useFindAndModify:false})

module.exports = mongoose
