
// This is useless I guess xD cuz member who is authenticated no need to check role.
//Because admin can also visit member routes.
//later we remove if no use

module.exports = function(req,res, next){
    if(req.user.role=='user'){
        next()
    }else{
        
        res.redirect('/admin/viewMerchandise')
    }
}