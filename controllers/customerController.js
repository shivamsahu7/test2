const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const generateOtp = require('generate-otp')
const jwt = require('jsonwebtoken');
const {handleApiError,handleApiSuccess} = require('./../helper/reponse.js')

const registerCustomer = async (req,res)=>{
    try{
        // random otp generate
        const otp = generateOtp.generate(5)

        // salt password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password,salt)

        // user update or insert
        const user = await User.findOneAndUpdate({
            email:req.body.email,
            verifiedAt:null
        },{
            $set:{
                name:req.body.name,
                email:req.body.email,
                password:hash,
                'otp.value':otp,
                'otp.attempt':5
            }
        },{ 
            upsert: true, new: true 
        })

        // response payload
        const data = {
            otp
        }
        return handleApiSuccess(req,res,data,req.__('USER').OTP_SENT,200)
    }catch(error){
        console.log(error)
        return handleApiError(req,res,{},req.__('ERROR').INTERNAL_SERVER,500)
    }
}

const loginCustomer = async (req,res)=>{
    try{
        const user = await User.findOne({
            number:req.body.number,verifiedAt:{$ne:null}
        }).select('name email password')
        hashResult = await bcrypt.compare(req.body.password, user.password);
        if(hashResult){
            // token valid for 1 year
            let tokenExp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365)
            let token = jwt.sign({
                userId: user._id,
                exp: tokenExp,
            }, 
                process.env.JWT_SECRET_KEY
            );
            delete user.password
            const data = {
                token,
                user
            }
            return handleApiSuccess(req,res,data,req.__('USER').LOGIN,200)
        }
        return handleApiError(req,res,{},req.__('ERROR').WRONG_PASSWORD,400)
    }catch(error){
        console.log(error)
        return handleApiError(req,res,{},req.__('ERROR').INTERNAL_SERVER,500)
    }
}

const otpVerify = async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email,verifiedAt:null})

        if(user.otp.attempt >= 1){
            if(user.otp.value == req.body.otp){
                user.otp.attempt = 0
                user.otp.value = null
                user.verifiedAt = new Date;
                await user.save()

                // create token 
                let tokenExp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365) // token valid for 1 year
                let token = jwt.sign({
                    userId: user._id,
                    exp: tokenExp,
                }, 
                    process.env.JWT_SECRET_KEY
                );
                const data = {
                    token,
                    user
                }
                return handleApiSuccess(req,res,data,req.__('USER').LOGIN,200)
            }else{
                user.otp.attempt = user.otp.attempt - 1
                await user.save()
                return handleApiError(req,res,{},INCORRECT_OTP,500)
            }
        }
        return handleApiError(req,res,{},req.__('ERROR').OTP_ATTEMPT,400)
    }catch(error){
        console.log(error)
        return handleApiError(req,res,{},req.__('ERROR').INTERNAL_SERVER,500)
    }
}

const updateProfile =  async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.userId})
        if(req.body.name){
            user.name = req.body.name
        }
        await user.save()
        return handleApiSuccess(req,res,{user},req.__('USER').PROFILE,200)
    }catch(error){
        console.log(error)
        return handleApiError(req,res,{},req.__('ERROR').INTERNAL_SERVER,500)
    }
}

const getProfile = async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.params.userId,verifiedAt:{$ne:null}}).select('-_id name')
        return handleApiSuccess(req,res,{user},req.__('USER').PROFILE_FETCH,200)
    }catch(error){
        // console.log(error)
        return handleApiError(req,res,{},req.__('ERROR').INTERNAL_SERVER,500,error)
    }
}


module.exports = {
    registerCustomer,
    loginCustomer,
    otpVerify,
    updateProfile,
    getProfile
}