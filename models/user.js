const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique: true, 
        index: true
    },
    password:{
        type:String
    },
    verifiedAt:{
        type:Date,
        default:null
    },
    otp:{
        value:{
            type:Number
        },
        attempt:{
            type:Number
        },
        expiredAt:{
            type:Date,
            default: Date.now
        }
    }
})

const User = mongoose.model('User',userSchema)

module.exports = User