//This module contains model for new match details
// data: kill, winPrize, perKill, time, matchTitle, type, version
const Joi = require('joi');
const mongoose = require('mongoose');
const MatchDetail = mongoose.model('MatchDetails', new mongoose.Schema({
                matchId: String,
                matchTitle: String,
                matchTime: String,
                matchDate: String,
                matchWinPrize: Number,
                matchPerkill: Number,
                matchEntryFee: Number,
                matchType: String,
                matchVersion: String,
                matchMap: String
}));
     function validateMatchDetail(req){
                const schema = {
                    matchId: Joi.string().min(1).required(),
                matchTitle: Joi.string().min(3).required(),
                matchTime: Joi.string().min(4).required(),
                matchDate: Joi.string().min(4).required(),
                matchWinPrize: Joi.number().min(10).max(5000).required(),
                matchPerkill: Joi.number().min(10).max(300).required(),
                matchEntryFee: Joi.number().min(10).max(400).required(),
                matchType: Joi.string().min(2).required(),
                matchVersion: Joi.string().min(3).required(),
                matchMap: Joi.string().min(2).required(),
                  
                };
            
                return Joi.validate(req.body, schema);
                 
            }
            

exports.MatchDetail = MatchDetail  ; 
exports.validate = validateMatchDetail;