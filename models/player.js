//This module contains model for a single player
//data: playerDetails

const mongoose = require('mongoose');

const Player = mongoose.model('PlayerList', new mongoose.Schema({
                matchId:String,
                playerName:{
                    type: String,
                    required:true,
                    min:4,
                    max:20
                },
                ClientSignIn: String,
                walletId: Number,
            
            }));

exports.Player = Player; 