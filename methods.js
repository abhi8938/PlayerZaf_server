const axios = require('axios');
const { MatchDetail } = require('./models/matchDetail');
const { Participant } = require ('./models/participant');
const { Result } = require('./models/result');
const { Client } = require('./models/client');


async function sendBulkMessage(request){
    // const user = 'abhishek8938';
    // const Api = 'SKtQdDTbuHoaUMMHhpc9';
    // const type = 'txt';
    // const message = `Attention!\n PlayerZon Match#809 is about to start.\n Please find the Room Details below & join the room ASAP\n ROOMID:${request.roomId} \n PASSWORD:${request.password} \n GOOD LUCK!`;
    // find the participant of the match with matchId
const participants = await Participant.find({ matchId: request.matchId});

// for each participant call the messaging api and send request.message and participant.mobileNumber
// participants.map(async (element) =>{
//     const number = element.mobileNumber;
//     console.log(number);
// await axios.get()
//      .then(response => console.log(response.data))
//      .catch(err => console.log("errp" + err));
// })

// notifyUser();
}

async function notifyUser(){

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
        updateWallet(participant.customerId, element.winnings);
    });
}

async function updateWallet(customerId, winnings){
   const client = await Client.findOne({ customerId:customerId});
   if(!client) return;
   const previousBalance = client.walletBalance;
   const updatedBalance = previousBalance + winnings;
   console.log(winnings);
   client.walletBalance = updatedBalance;
   
   await client.save();
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
        if(element.winner){
        element.winnings = (element.totalKills * perKill) + winPrize; 
        }else if(!element.winner){
            element.winnings = element.totalKills * perKill;
        }
  
    });
   const resolve = await result.save();
   sendReward(result);
    console.log(resolve);
  }

  exports.updateWinnings = updateWinnings;
  exports.sendReward = sendReward;
//   exports.generateCheckSumHash = generateCheckSumHash;
  exports.sendBulkMessage = sendBulkMessage;