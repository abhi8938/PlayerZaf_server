//This router hanles request for new Clients
const _= require('lodash');
const { Client, validate } = require('../models/client');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const clients = await Client.find();
  res.send(clients);
});

router.post('/', async (req, res) => {
   //Validate request body

   const { error } = validate(req);
   //  console.log(validation.error.details[0].message);
   if (error) return res.status(400).send(error.details[0].message);
    
   let clients = await Client.findOne({ email: req.body.emailAddress });
   if(clients) return res.status(400).send('user already registered');

   clients = new Client(addClient(req));
  try{
    clients = await clients.save();
    res.send(_.pick(clients, ['firstName', 'emailAddress']) );
  }
  catch(ex){
    for(field in ex.error){
      console.log(ex.errors[field]);
    }
  }
});

function addClient(req){
   const addedClient= _.pick(req.body, ['firstName', 
  'lastName', 
  'userName', 
  'emailAddress',
  'mobileNumber',
  'password' 
])
  //       //TODO: handlepost request
  //       firstName: req.body.firstName,
  //       lastName: req.body.lastName,
  //       userName: req.body.userName,
  //       emailAddress: req.body.emailAddress,
  //       mobileNumber: req.body.mobileNumber,
  //       password: req.body.password,
  // }
  return addedClient;
}


module.exports = router; 