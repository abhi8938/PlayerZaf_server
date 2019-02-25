const { Participant } = require ('./models/participant');
const { Result } = require('./models/result');
const { Client } = require('./models/client');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/pubgC-db')
.then(() => console.log('connected to mongodb....'))
.catch(err => console.error('could not connect', err));


async function sendReward(){
    //Gather information to work with
    const result = await Result.findOne({matchId: 'MATCH##2'});
    

    // extract required data
    const playerResults = result.playerResults;
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
   
   client.walletBalance = updatedBalance;
   
   await client.save();
   console.log(client.walletBalance);
}

sendReward();


































































































// const { MatchDetail } = require('./models/matchDetail');
// const { Result } = require('./models/result');
// // const { Client } = require('./models/client');
// const mongoose = require('mongoose');


// mongoose.connect('mongodb://localhost/pubgC-db')
// .then(() => console.log('connected to mongodb....'))
// .catch(err => console.error('could not connect', err));

// async function updateWinnings(){
//     //get result and match details:::::::::::gathering information
//     const result = await Result.findOne()
//     const matchDetail = await MatchDetail.findOne({matchId: result.matchId});  
    
//      // extracting valuable information
//     const winPrize = matchDetail.matchWinPrize;
//     const perKill = matchDetail.matchPerkill;
  
//     const playerResults = result.playerResults;
     
//     // foreach playerResult calculate and add winnings to playerResult.winnings

//     playerResults.forEach(element => {
//         if(element.winner){
//         element.winnings = (element.totalKills * perKill) + winPrize; 
//         }else if(!element.winner){
//             element.winnings = element.totalKills * perKill;
//         }

//     });
//    const resolve = await result.save();
//     console.log(resolve);
// }

// updateWinnings();












































































































































































































































































































































































































































































// // this model contains schema and for single registered client
// // const Joi = require('joi');
// // const mongoose = require('mongoose');


// // mongoose.connect('mongodb://localhost/pubgC-db')
// // .then(() => console.log('connected to mongodb....'))
// // .catch(err => console.error('could not connect', err));


// const playerResultSchema = mongoose.Schema({
//        playerName: {
//            type:String,
//            required:true
//        },
//         matchId:{
//             type:String,
//             required:true,
//        },
//        totalKills:{
//            type:Number,
//            required:true
//        },
//        winner:{
//            type:Boolean,
//        },
//        rank:{
//            type:Number,
//            required:true
//        }
// });
// // const PlayerResult = mongoose.model('PlayerResult', playerResultSchema);

// // async function createPlayerResult(playerName, matchId, totalKills, winner, rank) { 
// //     const playerResult = new PlayerResult({
// //       playerName,
// //       matchId,
// //       totalKills,
// //       winner,
// //       rank
// //     });
  
// //     const result = await playerResult.save();
// //     console.log(result);
// //   }
// //create schema/blueprint for the document
// const resultSchema = new mongoose.Schema({      
//    matchId:{
//        type:String,
//        required:true,
//    },
//    playerResults:[playerResultSchema]
// });

// //create model/class which takes argument Schema and collection in which it should be updated
// const Result = mongoose.model('results', resultSchema);

// // async function createResult(matchId, playerResults) {
// //     const result = new Result({
// //       matchId,
// //       playerResults
// //     }); 
// //     const resolve = await result.save();
// //     console.log(resolve);
// //   }

//     //   async function listResults() { 
//     //     const results = await Result
//     //       .find()
//     //       .populate('playerResult')
//     //       .select('matchId playerResult')
//     //     console.log(results);
//     //   }

//     // async function addPlayerResult(resultId, playerResult){
//     //     const result = await Result.findById(resultId);
//     //     result.playerResults.push(playerResult);
//     //     result.save();
//     // }

//     // addPlayerResult('5c6e809d9306ec4a94efb09f',new PlayerResult({ 
//     //     playerName:'Goku8938', 
//     //     matchId:'MATCH#0014',
//     //     totalKills:9,
//     //     winner:true,
//     //     rank:1 
//     //   }));

// //       async function removePlayerResult(resultId, playerResultId){
// //           const result =await Result.findById(resultId);
// //           const playerResult= result.playerResults.id(playerResultId);
// //           playerResult.remove();
// //           result.save();
// //         }

// // removePlayerResult('5c6e809d9306ec4a94efb09f','5c6e822132944147d8e147fa')
// //   createPlayerResult('abhishek8938','MATCH#001', 5, true, 1);
//   createResult('MATCH#001',[
//   new PlayerResult({ 
//       playerName:'Goku8938', 
//       matchId:'MATCH#001',
//       totalKills:9,
//       winner:true,
//       rank:1 
//     }),
//     new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#001',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#002',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#003',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#004',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#005',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#006',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#007',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#008',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#009',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#0010',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#0011',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#0012',
//         totalKills:9,
//         winner:true,
//         rank:1 
//       }),
//       new PlayerResult({ 
//         playerName:'Goku8938', 
//         matchId:'MATCH#0013',
//         totalKills:9,
//         winner:true,
//         rank:3
//       }),
                             
// ]); 

// //     async function updatePlayerResult(resultId){
// //         const result = await Result.update({_id: resultId},{
// //             $set:{
// //                 'playerResult.playerName':''
// //             }
// //         });
// //     }
// //  updatePlayerResult('5c6dcf142cee22422440641b');
// //   listResults(); 

// // function validateResult(req){
// //     const schema = {
// //        matchId: Joi.number().min(2).required(),
// //     };

// //     return Joi.validate(req.body, schema);
     
// // }

// exports.Result = Result;
// exports.validate = validateResult;