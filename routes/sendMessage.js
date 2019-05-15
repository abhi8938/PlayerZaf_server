// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { sendBulkMessage } = require('../methods');

  router.post('/', async (req, res) => {
    //Validate request body
    const validation = validate(req);
     if(validation.error){
        //400 bad request
         res.status(400).send(validation.error.details[0].message);   
     }
    const messageStatus = await sendBulkMessage(req.body);
    if(messageStatus.code == 200){
     return res.status(200).send('Messages Sent Successfully');
    }else{
      return res.status(400).send('Something Went Wrong! Retry');
    }
 });

 function validate(req){
    const schema = {
       matchId:Joi.string().min(3).required(),
       roomId: Joi.number().min(2).required(),
       password: Joi.string().min(3).required()
    };

    return Joi.validate(req.body, schema);
     
}

function validateOTP(req){
   const schema = {
      mobileNumber:Joi.string().min(10).required(),
   };

   return Joi.validate(req.body, schema);
    
}

module.exports = router;