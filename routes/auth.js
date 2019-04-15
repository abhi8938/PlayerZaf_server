//This router hanles request for new Clients
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Client } = require('../models/client');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
   //Validate request body

   const { error } = validate(req);
   if (error) return res.status(400).send(error.details[0].message);
  
   const client = await Client.findOne({ emailAddress: req.body.emailAddress });
   if(!client) return res.status(400).send('Invalid Email or password');
  
   const validPassword = await bcrypt.compare(req.body.password, client.password);
   if(!validPassword) return res.status(400).send('Invalid Password');
 
   const token= client.generateAuthToken();
   res.send(token);

});


function validate(req){
    const schema = {
        emailAddress: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req.body, schema);
     
}


module.exports = router; 