const logger = require('./../libs/loggerLib')
const response = require('./../libs/responseLib')
const check = require('./../libs/checkLib')

let isAuthenticated = (req,res,next)=>{
    if(req.params.authToken || req.query.authToken || req.header('authToken')){
        if(req.params.authToken == "admin" || req.query.authToken == "admin" || req.header('authToken')=="admin"){
            req.user={fullName:'Admin',useId:'Admin'}
            next()
        }
        else{
            logger.error('Incorrect authentication token','Authentication Middleware',5)
            let apiResponse = response.generate(true,'Incorrect authentication token',403)
            res.send(apiResponse)
        }
    }else{
        logger.error('Authentication Token Missing','Authentication Middleware',5)
        let apiResponse = response.generate(true,'Authentication Token Is Missing In Request')
        res.send(apiResponse)
    }
}
module.exports={
    isAuthenticated : isAuthenticated
}