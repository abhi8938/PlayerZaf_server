// this model contains schema for single participant document
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const participantSchema = new mongoose.Schema({
       
    matchId:{
       type:String,
       required:true,
    },
    playerName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:40
    },
    customerId:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
    },
    mobileNumber:{
        type:String,
        required:true
    }

});

//create model/class which takes argument participantSchema and collection in which it should be updated

const Participant = mongoose.model('Participants', participantSchema);

function validateParticipant(req){
    const schema = {
        matchId: Joi.string().min(1).required(),
        playerName: Joi.string().min(4).required(),
        mobileNumber: Joi.string().min(10).required(),
        userName: Joi.string().required(),
        customerId: Joi.string().required()
    };

    return Joi.validate(req.body, schema);
     
}

exports.Participant = Participant;
exports.validate = validateParticipant;