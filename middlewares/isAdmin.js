
module.exports = function(req,res,next){
    if(req.user.role == 'admin'){
        next()
    }else{
        res.render('unAuth')
        //later will be be redirected to some page
    }
}