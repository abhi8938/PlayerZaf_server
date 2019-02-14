//This module contains model for new match details
// data: kill, winPrize, perKill, time, matchTitle, type, version

const mongoose = require('mongoose');
// const {genreSchema} = require('./genre');

const matchDetails = mongoose.model('matchDetails', new mongoose.Schema({
                matchId: Number,
                matchTitle: String,
                matchTime: String,
                matchDate: Date,
                matchWinPrize: Number,
                matchPerkill: Number,
                matchEntryFee: Number,
                matchType: String,
                matchVersion: String,
                matchMap: String
            }));

exports.Details = matchDetails  ; 