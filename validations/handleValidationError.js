const {handleApiError} = require('./../helper/reponse')
const {validationResult} = require('express-validator')

handleValidationErrors = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return handleApiError(req,res,errors.array(),"validation error",200)
    }
    next()
} 

module.exports = handleValidationErrors