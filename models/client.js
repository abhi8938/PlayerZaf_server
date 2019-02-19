// this model contains schema and for single registered client
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
        type:Number,
        required:true,
        minlength:10,
    }, 
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
    }
     
});

//create model/class which takes argument Schema and collection in which it should be updated

const Client = mongoose.model('Clients', clientSchema);

function validateClient(req){
    const schema = {
       firstName: Joi.string().min(2).required(),
       lastName: Joi.string().min(2).required(),
       userName: Joi.string().min(5).required(),
       emailAddress: Joi.string().min(5).required().email(),
       mobileNumber: Joi.number().min(10).required(),
       password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req.body, schema);
     
}

exports.Client = Client;
exports.validate = validateClient;