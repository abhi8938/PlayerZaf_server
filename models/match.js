// this model contains schema and for single match document
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const matchSchema = new mongoose.Schema({
       
    matchDetails:{
        type: Array,
        validate: {
            validator: function(v){
                return v && v.length > 0;
            },
        }
    },
    status:{
        type:String,
        enum:['Open','closed', 'completed', 'ongoing']
    },
    participantList:[String],

});

//create model/class which takes argument matchSchema and collection in which it should be updated

const Match = mongoose.model('Matches', matchSchema);

function validateMatch(req){
    const schema = {
        status: Joi.string().min(3).required(),
        matchDetails: Joi.required(),
        participantList: Joi.required()
    };

    return Joi.validate(req.body, schema);
     
}

exports.Match = Match;
exports.validate = validateMatch;