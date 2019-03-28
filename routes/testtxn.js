var checksum = require('../models/utility/checksum');
var http = require('http');
var request = require('request');

module.exports = function (app) {

 app.get('/withdraw', function(req,res){
var samarray = new Array();

samarray = 
{"request":
{
  "requestType":null, 
  "merchantGuid":"6c119d23-9ae0-42ea-bb8c-b180ca4d3efb",
  "salesWalletName":'PayTM',
  "salesWalletGuid":"3856aa1a-4a26-11e9-af8f-fa163e429e83",
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
 checksum.genchecksumbystring(finalstring, "V_X@HqAn5Q%f4nVy", function (err, result) 
        {
            request({
            url: 'https://trust-uat.paytm.in/wallet-web/asyncSalesToUserCredit', //URL to hit
          //  qs: finalstring, //Query string data
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    'mid': '6c119d23-9ae0-42ea-bb8c-b180ca4d3efb',
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
  "merchantGuid":"6c119d23-9ae0-42ea-bb8c-b180ca4d3efb"
}, 
"operationType":"CHECK_TXN_STATUS",
"platformName":"PayTM",
"ipAddress":"PayTM" 
}
var checkString = JSON.stringify(check);
return checksum.genchecksumbystring(checkString, "V_X@HqAn5Q%f4nVy", function (err, result) 
        {
         return request({
            url:'https://trust-uat.paytm.in//wallet-web/checkStatus',
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
              'mid': '6c119d23-9ae0-42ea-bb8c-b180ca4d3efb',
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



