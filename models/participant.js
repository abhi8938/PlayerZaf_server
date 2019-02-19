// this model contains schema for single participant document
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const participantSchema = new mongoose.Schema({
       
    matchId:{
       type:Number,
       required:true,
    },
    playerName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:40
    },
    clientDetails:[String]

});

//create model/class which takes argument participantSchema and collection in which it should be updated

const Participant = mongoose.model('Participants', participantSchema);

function validateParticipant(req){
    const schema = {
        matchId: Joi.number().min(1).required(),
        playerName: Joi.string().min(4).required(),
        clientDetails: Joi.array().required()
    };

    return Joi.validate(req.body, schema);
     
}

exports.Participant = Participant;
exports.validate = validateParticipant;