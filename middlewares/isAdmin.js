
//****************************//
// Author of this Code:
// Muhammad Adeen Rabbani
// A17CS4006
//****************************//

module.exports = function(req,res,next){
    if(req.user.role == 'admin'){
        next()
    }else{
        res.render('unAuth')
        //later will be be redirected to some page
    }
}