var checksum = require('../models/utility/checksum');
var http = require('http');
const auth = require('../middleWare/auth');
// const admin = require('../middleWare/admin');
var request = require('request');

module.exports = function (app) {

 app.get('/withdraw',auth, function(req,res){
var samarray = new Array();

samarray = 
{"request":
{
  "requestType":null, 
  "merchantGuid":"d03eef72-e248-47f9-9b47-8194e13407b0",
  "salesWalletName":'PayTM',
  "salesWalletGuid":"2ccee9c7-bac1-4ad0-9053-73790a8fb775",
  "payeeEmailId":null,
  "payeePhoneNumber":req.headers.paytmnumber,
  "payeeSsoId":null,
  "merchantOrderId":req.headers.txnid,
  "appliedToNewUsers":"N",
  "amount":req.headers.amount,
  "currencyCode":"INR",
  "callbackURL": "https://paytm.com/market/salesToUserCredit" 
},

"metadata":"Testing",
"ipAddress":"192.168.43.16",
"platformName":"PayTM",
"operationType":"SALES_TO_USER_CREDIT"
};


var finalstring = JSON.stringify(samarray);
 checksum.genchecksumbystring(finalstring, "F_F#bnxKhtfH41jy", function (err, result) 
        {
            request({
            url: 'https://trust.paytm.in/wallet-web/asyncSalesToUserCredit', //URL to hit
          //  qs: finalstring, //Query string data
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    'mid': 'd03eef72-e248-47f9-9b47-8194e13407b0',
                    'checksumhash': result
                     },
            body: finalstring//Set the body as a string
            },function(error, response, body){
            if(error) {
                res.send(error);
                console.log(error);
            } else {
              var resp = JSON.parse(response.body);
              console.log(resp);
              setTimeout(function(){
              return checkTXN(resp,res);
              }, 8000);
            }
                });
        });
  });
// vidisha code finish
};

function checkTXN(resp, res){
  // console.log(resp.orderId);
var check = {
  "request":{ 
  "requestType":"merchanttxnid", 
  "txnType":"SALES_TO_USER_CREDIT", 
  "txnId":resp.orderId, 
  "merchantGuid":"d03eef72-e248-47f9-9b47-8194e13407b0"
}, 
"operationType":"CHECK_TXN_STATUS",
"platformName":"PayTM",
"ipAddress":"PayTM" 
}
var checkString = JSON.stringify(check);
return checksum.genchecksumbystring(checkString, "F_F#bnxKhtfH41jy", function (err, result) 
        {
         return request({
            url:'https://trust.paytm.in//wallet-web/checkStatus',
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
              'mid': 'd03eef72-e248-47f9-9b47-8194e13407b0',
              'checksumhash': result
               },
            body:checkString
          }, function(error, response, body){
            if(error){
              return error;
            }else{
              const resp1 = JSON.parse(response.body);
              // console.log(resp1);
              return res.send(resp1);
            }
          });
        });

}



