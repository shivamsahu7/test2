var jwt = require('jsonwebtoken');
const {handleApiError} = require('./../helper/reponse.js')
module.exports = async (req,res,next)=>{
    try{
        const temp = req.headers.authorization
        const token = temp.split(" ")[1]
        const data = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(data){
            req.userId = data.userId
            if(Math.floor(Date.now()/1000) >=  data.exp){
                return handleApiError(req,res,{},req.__('ERROR').TOKEN_EXP,400)
            }
        }else{
            return handleApiError(req,res,{},req.__('ERROR').UNAUTHORIZE,401)
        }
        next()
    }catch(err){
        console.log(err)
        return handleApiError(req,res,{},req.__('ERROR').INTERNAL_SERVER,500)
    }
}