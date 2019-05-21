// this model contains schema and for single registered client
//fsgdfgxhfcghfhfgfaeeadda
const Joi = require('joi');
const cors = require('cors');
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
           required:true
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
        unique:true
    },
    playerResults:[playerResultSchema]
 });
 
//create model/class which takes argument Schema and collection in which it should be updated
const Result = mongoose.model('results', resultSchema);

function validateResult(req){
    const schema = {
       matchId: Joi.string().min(2).required(),
       playerResults:Joi.array().min(4).max(100)
    };

    return Joi.validate(req.body, schema);
     
}
function validatePlayerResult(playerResult){
    // console.log(playerResult);
    const schema = {
        id:Joi.number(),
       matchId: Joi.string().min(2).required(),
       playerName: Joi.string().min(3).required(),
       totalKills: Joi.number().min(0).max(30),
       winner: Joi.boolean().required(),
       rank: Joi.number().integer().max(100).min(1).required()
    };

    return Joi.validate(playerResult, schema);
     
}

exports.Result = Result;
exports.PlayerResult = PlayerResult;
exports.validate = validateResult;
exports.validatePlayer = validatePlayerResult;