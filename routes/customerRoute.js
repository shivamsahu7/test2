const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const customerController = require('../controllers/customerController')
const customerValidation =require('../validations/customerValidation')
const handleValidationErrors = require('./../validations/handleValidationError')

router.post("/register",customerValidation.registerValidationRules,handleValidationErrors,customerController.registerCustomer)

router.post("/login",customerValidation.loginValidationRules,handleValidationErrors,customerController.loginCustomer)

router.post("/otp-verify",customerValidation.otpValidationRules,handleValidationErrors,customerController.otpVerify)

// verify token
router.use('/',authMiddleware)

router.post("/update-profile",customerValidation.updateProfileValidationRules,handleValidationErrors,customerController.updateProfile)

router.get("/profile-by-id/:userId",customerValidation.getProfileByIdValidationRules,handleValidationErrors,customerController.getProfile)

module.exports = router