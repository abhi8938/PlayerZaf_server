// this model contains schema and for single registered client
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const clientSchema = new mongoose.Schema({
       
    firstName:{
        type: String,
        required:true,
        minlength:2
    },
    lastName:{
        type:String,
        required:true,
        minlength:2
    },
    userName:{
        type:String,
        required:true,
        minlength:5
    },
    emailAddress:{
        type:String,
        required:true,
        minlength:5,
        unique:true
    },
    mobileNumber:{
        type:String,
        required:true,
        minlength:10,
        unique:true
    }, 
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
    },
    walletBalance:{
        type:Number,
        default:0
    },
    customerId:{
        type:String,
        unique:true
    },
    amountWon:{
        type:Number,
        default:0
    },
    totalKills:{
        type:Number,
        default:0
    },
    matchesPlayed:{
        type:Number,
        default:0
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    promoCode:{
        type:String
    },
    resetPasswordToken:{
        type:String,
        default:null
    },
    resetPasswordExpires:{
        type:Number,
        default:null
    },
    update:{
        type:Boolean,
        default:false
    },
    version:{
        type:String
    }
});

clientSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

//create model/class which takes argument Schema and collection in which it should be updated

const Client = mongoose.model('Clients', clientSchema);

function validateClient(req){
    const schema = {
       firstName: Joi.string().min(2).required(),
       lastName: Joi.string().min(2).required(),
       userName: Joi.string().min(5).required(),
       emailAddress: Joi.string().min(5).required().email(),
       mobileNumber: Joi.string().required().min(10).max(10),
       password: Joi.string().min(5).max(255).required(),
       walletBalance: Joi.number(),
       customerId: Joi.string(),
       amountWon: Joi.number(),
       totalKills: Joi.number(),
       matchesPlayed: Joi.number(),
       promoCode: Joi.string(),
       resetPasswordToken: Joi.string(),
       resetPasswordExpires: Joi.number(),
       update:Joi.boolean(),
       version: Joi.string()
    };

    return Joi.validate(req.body, schema);
     
}
function validateMobileNumber(req){
    const schema = {
       mobileNumber: Joi.string(),
       customerId: Joi.string().required(),
       firstName: Joi.string(),
       lastName: Joi.string()
    };

    return Joi.validate(req.body, schema);
     
}
function validatePasswordUpdate(req){
    const schema = {
       customerId: Joi.string().required(),
       oldPassword: Joi.string().required(),
       newPassword: Joi.string().min(5).max(255).required()
      
    };

    return Joi.validate(req.body, schema);
     
}
function validateResetPassword(req){
    const schema = {
       userName: Joi.string().required(),
       password: Joi.string().min(5).max(255).required()
       
    };

    return Joi.validate(req.body, schema);
     
}

exports.Client = Client;
exports.validate = validateClient;
exports.validateMobile = validateMobileNumber;
exports.validatePassword = validatePasswordUpdate;
exports.validateResetPassword = validateResetPassword;
