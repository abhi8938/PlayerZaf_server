//This router hanles request for new Clients
const bcrypt = require('bcrypt');
const _= require('lodash');
const asyncMiddleware = require('../middleWare/async');
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const { Client, validate } = require('../models/client');
const express = require('express');
const router = express.Router();


router.get('/me', auth,  async (req, res, next) => {
   const client = await Client.findById(req.client._id).select('-password');
   res.send(client);
  
  });
router.post('/', async (req, res) => {
   
  let count;
  await Client.collection.count({}, (error, size)=>{
    count = size + 1; 
    //  console.log('size:' + count);
     return count;
   });
   const { error } = validate(req);
   if (error) return res.status(400).send(error.details[0].message);
  
   let client = await Client.findOne({ emailAddress: req.body.emailAddress });
   if(client) return res.status(400).send('user already registered');
 
   client = new Client(addClient(req, count)); 

   const salt = await bcrypt.genSalt(10);
   client.password = await bcrypt.hash(client.password, salt);
   
   client = await client.save();

   const token = client.generateAuthToken();
   res.header('x-auth-token', token).send(_.pick(client, ['firstName', 'emailAddress']));
  
});

router.delete('/:id', [auth, admin], async (req,res)=>{
  const client = await Client.findByIdAndDelete(req.params.id);
   if(!client) return res.status(404).send('the client with given id is not available');
   res.send(client);
});

router.put('/', auth,async (req, res) =>{
    const client = await Client.findOne({ customerId: req.body.customerId});
    if(!client) return;
    const updatedBalance = req.body.walletBalance;

    client.walletBalance = updatedBalance;
    const result= await client.save();
    console.log(result);
    res.send(result);
  })

function addClient(req, count){
  
  const addedClient={
    //TODO: handlepost request
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    emailAddress: req.body.emailAddress,
    mobileNumber: req.body.mobileNumber, 
    password: req.body.password,
    customerId:'CUST#00'+ count
  };
  return addedClient;
}


module.exports = router; 