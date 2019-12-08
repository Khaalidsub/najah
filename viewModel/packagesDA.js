const Packages = require('../models/Package')



const fetchPackages  = async (usertype)=>{

    try {
          const dbPackages = await Packages.find({type:usertype})
          if(dbPackages){
              return dbPackages;
          }else
          throw new Error();
    } catch (error) {
        return null;
    }
}
const save = async (value)=>
{
    obj = new Packages(value);
    await obj.save();
    return;
}

module.exports = {fetchPackages:fetchPackages, savePackage:save}