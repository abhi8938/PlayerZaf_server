var checksum = require('../models/utility/checksum');
var http = require('http');
var request = require('request');

module.exports = function (app) {

 app.get('/withdraw', function(req,res){
console.log("--------vidi----");
var samarray = new Array();

samarray = 
{"request":
{
  "requestType":null, 
  "merchantGuid":"6c119d23-9ae0-42ea-bb8c-b180ca4d3efb",
  "salesWalletName":'Nisar',
  "salesWalletGuid":"3856aa1a-4a26-11e9-af8f-fa163e429e83",
  "payeePhoneNumber":"7777777777",
  "merchantOrderId":"ORDER#50",
  "appliedToNewUsers":"N",
  "amount":"1",
  "currencyCode":"INR",
  "callbackURL": "https://paytm.com/market/salesToUserCredit" 
},

"metadata":"Testing",
"ipAddress":"192.168.43.151",
"platformName":"PayTM",
"operationType":"SALES_TO_USER_CREDIT"};


var finalstring = JSON.stringify(samarray);
 checksum.genchecksumbystring(finalstring, "V_X@HqAn5Q%f4nVy", function (err, result) 
        {
            request({
            url: 'https://trust-uat.paytm.in/wallet-web/asyncSalesToUserCredit', //URL to hit
          //  qs: finalstring, //Query string data
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    'mid': 'lHaxeA37804396370427',
                    'checksumhash': result
                     },
            body: finalstring//Set the body as a string
            }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                console.log(response.body);
                   res.send(body);
            }
                });
        });
  });
// vidisha code finish
};
