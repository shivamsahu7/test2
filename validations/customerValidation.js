const {body,param} = require('express-validator')
const User = require('../models/user')
registerValidationRules = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage("Name must be a string"),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage("Email is invalid")
    .custom(async(email)=>{
        const checkUser =  await User.countDocuments({email,verifiedAt:{$ne:null}})
        if(checkUser >= 1){
            throw new Error('User allready exist.')
        }
        return true
    }),
    body('password').notEmpty().withMessage('New Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
]

loginValidationRules = [
    body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be String'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage("Email is invalid")
    .custom(async(email)=>{
        const checkUser = await User.countDocuments({email,verifiedAt:{$ne:null}})
        if(checkUser <= 0){
            throw new Error('User does not exist.')
        }
        return true
    })
]

otpValidationRules = [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage("Email is invalid")
    .custom(async(email)=>{
        const checkUser = await User.countDocuments({email,verifiedAt:null})
        if(checkUser <= 0){
            throw new Error('Invalid operation.')
        }
        return true
    }),
    body('otp').custom(async(otp)=>{
        if(!/^[0-9]{5}$/.test(otp)){
            throw new Error('otp must be a 5-digit number')
        }
        return true
    })
]

updateProfileValidationRules =[
    body('name').optional().isString().withMessage('value must be string')
]

getProfileByIdValidationRules = [
    param('userId').isString().withMessage('userId must be string')
    .custom(async(userId)=>{
        const checkUser = await User.countDocuments({_id:userId,verifiedAt:{$ne:null}})
        if(checkUser <= 0){
            throw new Error('User does not exist.')
        }
        return true
    }),
]

module.exports = {
    registerValidationRules,
    loginValidationRules,
    otpValidationRules,
    updateProfileValidationRules,
    getProfileByIdValidationRules
}