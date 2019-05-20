//This module contains model for new match details
// data: kill, winPrize, perKill, time, matchTitle, type, version
const Joi = require('joi');
const mongoose = require('mongoose');
const MatchDetail = mongoose.model('MatchDetails', new mongoose.Schema({
                matchId:{
                    type:String,
                    unique:true
                },
                matchTitle: String,
                matchTime: String,
                matchDate: String,
                matchWinPrize: Number,
                matchPerkill: Number,
                matchEntryFee: Number,
                matchType:{ 
                    type:String,
                    uppercase:true,
                    enum:[ 'SQUAD', 'DUO', 'SOLO']
                },
                matchVersion: String,
                matchMap: String,
                matchParticipants:{
                     type: Number,
                     default:0
                },
                matchStatus:{
                    type:String ,
                    uppercase:true,
                    enum: [ 'OPEN', 'COMPLETED', 'ONGOING'],
                    default: 'OPEN'
                },
                roomId:{
                    type:String
                },
                password:{
                    type:String
                }
}));
     function validateMatchDetail(req){
                const schema = {
                matchId: Joi.string().min(1).required(),
                matchTitle: Joi.string().min(3).required(),
                matchTime: Joi.string().min(4).required(),
                matchDate: Joi.string().min(4).required(),
                matchWinPrize: Joi.number().min(10).max(5000).required(),
                matchPerkill: Joi.number().min(5).max(300).required(),
                matchEntryFee: Joi.number().min(0).max(400).required(),
                matchType: Joi.string().min(2).required().uppercase(),
                matchVersion: Joi.string().min(3).required(),
                matchMap: Joi.string().min(2).required(),
                matchParticipants: Joi.number(),
                matchStatus: Joi.string().uppercase()  
                };
            
                return Joi.validate(req.body, schema);
                 
            }
            

exports.MatchDetail = MatchDetail  ; 
exports.validate = validateMatchDetail;