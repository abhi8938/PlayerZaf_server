// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const crypto = require('crypto');
const { Client }  = require('../models/client');
const { sendResetMessage } = require('../methods');
const express = require('express');
const router = express.Router();

  router.post('/', async (req, res) => {
     console.log(req.body);
     //check if client with the given email Id
     var client = await Client.findOne({ emailAddress: req.body.email});
     //if not return res user with emailId not Found
     if(!client) return res.send('Email Id not in Database');
     //if client
     if(client){
     //generate token
     const mobileNumber = client.mobileNumber;
     const token = crypto.randomBytes(20).toString('hex');
      //update token in client document
       // and token expiry time in client document
      client.update({
        resetPasswordToken: token,
        resetTokenExpires: Date.now() + 360000
      });
      console.log(client);
       //send message to the number associated eith the client
       const messageStatus = await sendResetMessage(token, mobileNumber);
       if(messageStatus.body.return == true){
          return res.send('Reset link sent Successfully to your registerd Mobile Number')
       }else{
         return res.send('Oops! Something went wrong, Please Try Again');
       }
     }
      
 });

module.exports = router;