const axios = require('axios');
const CryptoJS = require("crypto-js");
const unirest = require('unirest');
const { MatchDetail } = require('./models/matchDetail');
const { Participant } = require ('./models/participant');
const { Result } = require('./models/result');
const { Client } = require('./models/client');

//START
async function updateMatchStatus(matchId){
    const match = await MatchDetail.findOne({ matchId: matchId});
    match.matchStatus = 'COMPLETED'
    await match.save();
    }
//THE END

//START
async  function updateParticipants(matchId){
    const match = await MatchDetail.findOne({ matchId: matchId});
    match.matchParticipants = match.matchParticipants + 1;
    await match.save();
   return match;
  }
//THE END

//START
async  function addMoneyWallet(customer_Id, amount){
    const success = 'Payment Successfull: Wallet Updated'
    const client = await Client.findOne({ customerId: customer_Id});
    if(!client) return;
    client.walletBalance = client.walletBalance + amount;
    await client.save();
    return client;
    }
//THE END

//START
//RAZORPAY
async function authorizePayment(request){
     const razorpay_signature = request.body.razorpay_signature;
     const razorpay_payment_id = request.body.razorpay_payment_id;
     const razorpay_order_id = request.body.razorpay_order_id;
     const key_secret = '1DhJOuaW4MGHlSGzGYHv5FEF';  
     const generated_signature = CryptoJS.HmacSHA256(razorpay_order_id + '|' + razorpay_payment_id,key_secret);
     const success = 'Payment is Successful';
     const fail = 'Payment Failed';
     const customer_Id = request.body.customer_Id;
     const amount = request.body.amount;
if(generated_signature == razorpay_signature){
    await addMoneyWallet(customer_Id, amount);
     return success;
}else{
    return fail;
}}

//THE END


async function sendBulkMessage(request){
    const Api = 'Sas4t3c3HmOMieIt8gABl61UZiksE98sSJVEpv5xxbVi6OL5txq1E8yi1jsp';
    const message = `Attention!\n PlayerZon ${request.matchId} is about to start.\n Please find the Room Details below & join the room ASAP\n ROOMID:${request.roomId} \n PASSWORD:${request.password} \n GOOD LUCK!`;
    // find the participant of the match with matchId
const participants = await Participant.find({ matchId: request.matchId});
const numbers = new Array();
// for each participant 
//    -call the messaging api
//    -save all the numbers in an array
//    -stringify numbers Array 
//    -
participants.map( (element) =>{
      numbers.push(element.mobileNumber);
})
//call the api with request body and header
const numberString = numbers.toString();
var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");
req.query({
    "authorization": Api,
    "sender_id": "PLAYER",
    "message": message,
    "language": "english",
    "route": "p",
    "numbers": numberString,
  });
  
  req.headers({
    "cache-control": "no-cache"
  });
  
  
  req.end(function (res) {
    if (res.error) throw new Error(res.error);
    if(res.body.return == true){
        return res.body.message
    }else{
        return res.body.message
    }
  });
  return req;
// notifyUser();
}


async function sendReward(result){
    //Gather information to work with
    const results = await Result.findOne({matchId: result.matchId});
    

    // extract required data
    const playerResults = results.playerResults;
    playerResults.forEach(async (element) => {
        const participant = await Participant
        .findOne()
        .and([{ matchId:element.matchId },{ playerName:element.playerName}]);
        updatePlayerStats(participant.customerId, element.winnings, element.totalKills);
    });
}

async function updatePlayerStats(customerId, winnings, kills){
   const client = await Client.findOne({ customerId:customerId});
   if(!client) return;
   const previousBalance = client.walletBalance;
   const updatedBalance = previousBalance + winnings;
   client.walletBalance = updatedBalance;
   client.amountWon = client.amountWon + winnings;
   client.totalKills = client.totalKills + kills;
   client.matchesPlayed = client.matchesPlayed + 1;
   await client.save();
   return client
}



async function updateWinnings(result){
    //get result and match details:::::::::::gathering information
    const matchDetail = await MatchDetail.findOne({matchId: result.matchId});  
    
     // extracting valuable information
    const winPrize = matchDetail.matchWinPrize;
    const perKill = matchDetail.matchPerkill;
  
    const playerResults = result.playerResults;
     
    // foreach playerResult calculate and add winnings to playerResult.winnings
  
    playerResults.forEach(element => {
        if(matchDetail.matchType == 'SOLO'){
        if(element.winner){
        element.winnings = (element.totalKills * perKill) + winPrize; 
        }else if(!element.winner){
            element.winnings = element.totalKills * perKill;
        }
    }else if(matchDetail.matchType == 'DUO'){
        if(element.winner){
            element.winnings = (element.totalKills * perKill) + (winPrize/2); 
            }else if(!element.winner){
                element.winnings = element.totalKills * perKill;
            }
    }else if(matchDetail.matchType == 'SQUAD'){
        if(element.winner){
            element.winnings = (element.totalKills * perKill) + (winPrize/4); 
            }else if(!element.winner){
                element.winnings = element.totalKills * perKill;
            }
    }

    });
  await result.save();
   sendReward(result);
  }

  exports.updateWinnings = updateWinnings;
  exports.sendReward = sendReward;
  exports.sendBulkMessage = sendBulkMessage;
  exports.authorizePayment = authorizePayment;
  exports.addMoneyWallet = addMoneyWallet;
  exports.updateParticipants = updateParticipants;
  exports.updateMatchStatus = updateMatchStatus;