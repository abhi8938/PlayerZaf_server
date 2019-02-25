// this model contains schema and for single registered client

const Joi = require('joi');
const mongoose = require('cors');
const mongoose = require('mongoose');

const playerResultSchema = mongoose.Schema({
       playerName: {
           type:String,
           required:true
       },
        matchId:{
            type:String,
            required:true,
       },
       totalKills:{
           type:Number,
           required:true
       },
       winner:{
           type:Boolean,
       },
       winnings:{
           type:Number
       },
       rank:{
           type:Number,
           required:true
       }
});
const PlayerResult = mongoose.model('PlayerResult', playerResultSchema);

//create schema/blueprint for the document
const resultSchema = new mongoose.Schema({      
    matchId:{
        type:String,
        required:true,
    },
    playerResults:[playerResultSchema]
 });
 
//create model/class which takes argument Schema and collection in which it should be updated
const Result = mongoose.model('results', resultSchema);

function validateResult(req){
    const schema = {
       matchId: Joi.string().min(2).required(),
       playerResults:Joi.array().required()
    };

    return Joi.validate(req.body, schema);
     
}

exports.Result = Result;
exports.PlayerResult = PlayerResult;
exports.validate = validateResult;