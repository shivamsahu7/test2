const log = require('./../config/logConfig')

function handleApiSuccess(req,res,data,message,status){
    return res.status(status).json({
        status:true,
        message,
        data
    })
}

function handleApiError(req,res,errors,message,status,exception=null){
    log.error({userId:req.userId,path:req.path,errors,body:req.body,ip:req.ip,exception:exception.stack})
    return res.status(status).json({
        status:false,
        message,
        errors
    })
}

module.exports = {
    handleApiSuccess,
    handleApiError
}