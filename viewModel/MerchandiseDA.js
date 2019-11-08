const Merchandise  = require('../models/Merchandise')
const mongoose = require('mongoose')


addMerchandise = async function(merchandise){
 console.log("this was executed")
try {
   await  merchandise.save()
    
} catch (error) {
    return null
}

}
fetchMerchandise = async function (req,res){
try{
   const values =  await Merchandise.find({status:true});
   if(values.length > 0){
       return values
   }else
   throw new Error();
}catch(e){
    throw new Error();
}
}

module.exports = {
    addMerchandise: addMerchandise,
    fetchMerchandise: fetchMerchandise
}