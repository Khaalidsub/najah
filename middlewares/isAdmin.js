
module.exports = function(req,res,next){
    if(req.user.role == 'admin'){
        next()
    }else{
        res.send('You are not allowed To access this')
        //later will be be redirected to some page
    }
}