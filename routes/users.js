//This router hanles request for new Clients
const bcrypt = require('bcrypt');
const _= require('lodash');
const asyncMiddleware = require('../middleWare/async');
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const { Client, validate, validateMobile, validatePassword } = require('../models/client');
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

router.put('/balance', async (req, res) =>{
    const client = await Client.findOne({ customerId: req.body.customerId});
    if(!client) return;
    const updatedBalance = req.body.walletBalance;

    client.walletBalance = updatedBalance;
    const result= await client.save();
    res.send(result);
  })

// create put route handler to update firstName, lastName, mobileNumber
router.put('/details', async (req, res) => {
  const client = await Client.findOne({ customerId: req.body.customerId});
  if(!client) return;
  // const { error } = validateMobile(req);
  // if (error) return res.status(400).send(error.details[0].message);

   if(req.body.firstName !=''){
     const updatedFirstName = req.body.firstName;
     client.firstName = updatedFirstName;
   }
   if(req.body.lastName !=''){
    const updatedLastName = req.body.lastName;
    client.lastName = updatedLastName;
  }
  
  if(req.body.mobileNumber !=''){

    const updatedMobileNumber = req.body.mobileNumber;
    client.mobileNumber = updatedMobileNumber;
  }
   await client.save();
  res.send('Update Successfull');

});
// create put route handler to update password
router.put('/password', async (req, res) => {
  const client = await Client.findOne({ customerId: req.body.customerId});
  if(!client) return;
  
  const { error } = validatePassword(req);
  if (error) return res.status(400).send(error.details[0].message);

  const validPassword = await bcrypt.compare(req.body.oldPassword, client.password);
  if(!validPassword) return res.status(400).send('Invalid Password');
  
  const salt = await bcrypt.genSalt(10);
  client.password = await bcrypt.hash(req.body.newPassword, salt);
   await client.save();
  res.send('Password Updated');
});

function addClient(req, count){
  
  const addedClient={
    //TODO: handlepost request
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    emailAddress: req.body.emailAddress,
    mobileNumber: req.body.mobileNumber, 
    password: req.body.password,
    customerId:'CUST@00'+ count
  };
  return addedClient;
}


module.exports = router; 