// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { sendBulkMessage } = require('../methods');

  router.post('/', async (req, res) => {
    //Validate request body
    const validation = validate(req);
    //  console.log(validation.error.details[0].message);
     if(validation.error){
         //400 bad request
         res.status(400).send(validation.error.details[0].message);   
     }

    //  console.log(req.body);
     sendBulkMessage(req.body);
 });


 function validate(req){
    const schema = {
       matchId:Joi.string().min(3).required(),
       roomId: Joi.number().min(2).required(),
       password: Joi.string().min(3).required()
    };

    return Joi.validate(req.body, schema);
     
}

module.exports = router;