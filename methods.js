const CryptoJS = require("crypto-js");
const unirest = require('unirest');
const axios = require('axios');
const { Transaction } = require('./models/transaction');
const { MatchDetail } = require('./models/matchDetail');
const { Participant } = require ('./models/participant');
const { Result } = require('./models/result');
const { Client } = require('./models/client');
const Api = 'Sas4t3c3HmOMieIt8gABl61UZiksE98sSJVEpv5xxbVi6OL5txq1E8yi1jsp';

//START
async function userMatches(){
    // get all the participants
      //then

    //get all the matches
}
//END

//START
async function promoCode(customerId){
    //check if promocode
    const refer = await Client.findOne({ customerId:customerId});
    if(refer.promoCode != undefined){
       refer.walletBalance = refer.walletBalance + 5;
       const referer = await Client.findOne({ userName: refer.promoCode});
       if(referer){
           referer.walletBalance = referer.walletBalance + 10;
           refer.promoCode = undefined;
           await refer.save();
           await referer.save();
       }else{
           return
       }
    
    }else{
        return;
    }
        
}
//END
//START
async function countTransactions(){
//TODO: Generate TxnId consecutive
const count = await Transaction.estimatedDocumentCount();
const sum = parseInt(count);
const txnid = `TXNN-${sum + 1}`;
console.log(`sum${sum}`);
return txnid;
}
//END
//START
async function addTransactions(resp, txnId, customerId){

      //TODO: if Successfull deduct money from wallet and show alert and addtransaction 
       if(resp.response.txnList[0].status == 1){
           //callfunction addTransaction() and pass parameters
           const Amount = resp.response.txnList[0].txnAmount;
           const TxnStatus = resp.response.txnList[0].message;
           const TxnDate = Date.now();
           const TxnType = 'WITHDRAWN';
           let transactions = new Transaction({
            //TODO: handlepost request
            customerId: customerId,
            TxnId: txnId,
            Amount: Amount,
            TxnStatus: TxnStatus,
            TxnDate:TxnDate,
            TxnType: TxnType
  
      })
      transactions = await transactions.save();
      const result = await deductMoney(customerId, Amount);
           console.log(result);
           return result;
       }else{
           //TODO: if not successfull alert error
           const Amount = resp1.response.txnList[0].txnAmount;
           const TxnStatus = 'FAILED';
           const TxnDate = Date.now();
           const TxnType = 'WITHDRAWN';
           let transactions = new Transaction({
            //TODO: handlepost request
            customerId: customerId,
            TxnId: txnId,
            Amount: Amount,
            TxnStatus: TxnStatus,
            TxnDate:TxnDate,
            TxnType: TxnType
  
      })
      transactions = await transactions.save();
           return`Transaction ${transactions.TxnStatus}`;
       }
}
//END
//START
async function deductMoney(customerId, Amount){
    let client = await Client.findOne({ customerId:customerId});
    if(!client) return `Oops! Something Went Wrong`;
    const walletBalance = client.walletBalance;
    client.walletBalance = walletBalance - Amount;
    console.log(walletBalance, client.walletBalance, Amount);
    client = await client.save();
    return 'Transaction Success';
}
//END
//START
async function updateWallet(matchId, customerId){
    // console.log(matchId, customerId);
    let matchDetail = await MatchDetail.findOne({ matchId: matchId});
    let Participants = await Participant.find({matchId:matchId});
    if(!Participants) return;
    if(!matchDetail) {
        console.log('match not found');
        return
    }else{
        const entryfee = matchDetail.matchEntryFee;
        matchDetail.matchParticipants = Participants.length + 1 ;
        console.log(matchDetail.matchParticipants);
        const result = await matchDetail.save();
        let client = await Client.findOne({ customerId: customerId});
        if(!client) {
            console.log('not found client');
            return
        }else{
        const Balance = client.walletBalance; 
        const updatedBalance = Balance - entryfee;
        client.walletBalance = updatedBalance;
        const response = await client.save();
         return response;
        }
    }
   
}
//END

//START
async function generateToken(orderId, amount){
    // console.log(`tokenpara:${orderId}+ ${amount}`);
    var req = unirest("POST", "https://api.cashfree.com/api/v2/cftoken/order");
      req.headers({
        'Content-Type':'application/json',
        'x-client-id':'1186014786b6ec7db6fc8e66906811',
        'x-client-secret':'35b20b16e9c72046e12d7057320a67960b864f7e'
      });
      req.send({
        "orderId": orderId,
        "orderAmount":amount,
        "orderCurrency": "INR"
      });
      
      req.end(function (res) {
        if (res.error) return res.error
        if(res.body.status == 'OK'){
            return res.body.cftoken
        }else{
            return res.body.message
        }
      });
      return req;
    }
//END
//START
async function sendResetMessage(token, clientNumber){
    const resetMessage = `Click the link to reset your PlayerZaf App Password:\n http://playerzaf.com/dashboard/#/reset/?token=${token}`;
    var req = unirest("GET", "https://www.txtguru.in/imobile/api.php");

    req.headers({
        "cache-control": "no-cache",
      });
    
    req.query({
        "username": 'playerzaf.contact' ,
        "password": "15060138",
        "source": 'PLAZAF',
        "dmobile": `91${clientNumber}`,
        "message":resetMessage
      });
 
  
  
  req.end(function (res) {
    if(res.body.return == true){
        return res.body.message
    }else{
        return res.body.message
    }
  });
  return req;

}
//END

//START
async function updateMatchStatus(matchId){
    const match = await MatchDetail.findOne({ matchId: matchId});
    match.matchStatus = 'COMPLETED'
    await match.save();
    }
//THE END

//START
async function updateParticipants(matchId){
    const match = await MatchDetail.findOne({ matchId: matchId});
  }
//THE END

//START
async  function addMoneyWallet(customer_Id, amount){
    const success = 'Payment Successfull: Wallet Updated'
    const client = await Client.findOne({ customerId: customer_Id});
    if(!client) return ;
    client.walletBalance = client.walletBalance + amount;
    await client.save();
    console.log(`balance:${client.walletBalance}`);
    return 'Payment Successful';
    }
//THE END

//START
//RAZORPAY
async function authorizePayment(request){
     const razorpay_signature = request.body.razorpay_signature;
     const razorpay_payment_id = request.body.razorpay_payment_id;
     const razorpay_order_id = request.body.razorpay_order_id;
     const key_secret = 'naAmOknspcgDOpUV9EpejXDh';  
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
    const message = `Hello Players\n PlayerZaf ${request.matchId} is about to start.\n Please find the Room Details below & join the room ASAP\n ROOMID:${request.roomId} \n PASSWORD:${request.password} \n GOOD LUCK!`;
    // find the participant of the match with matchId
const participants = await Participant.find({ matchId: request.matchId});

const numbers = new Array();
// for each participant 
//    -call the messaging api
//    -save all the numbers in an array
//    -stringify numbers Array 
participants.map( (element) =>{
      numbers.push(`91${element.mobileNumber}`);
})
//call the api with request body and header
const numberString = numbers.toString();
const config = {
    "cache-control": "no-cache",
    params:{
        "username": 'playerzaf.contact' ,
        "password": "15060138",
        "source": 'PLAZAF',
        "dmobile": numberString,
        "message": message
    }
}

return axios.default.get('https://www.txtguru.in/imobile/api.php',config)
               .then(resp =>{
                   console.log('resp',resp.status);
                   return resp
            
               }).catch(err =>{
                   console.log('error',err);
                   return err;
               })


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
   // update 'withdrawWallet' field of client
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
  exports.sendResetMessage = sendResetMessage;
  exports.generateToken = generateToken;
  exports.updateWallet = updateWallet;
  exports.addTransactions = addTransactions;
  exports.countTransactions = countTransactions;
  exports.promoCode = promoCode;