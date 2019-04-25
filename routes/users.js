//This router hanles request for new Clients
const bcrypt = require('bcrypt');
const _= require('lodash');
const asyncMiddleware = require('../middleWare/async');
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const { Client, validate, validateMobile, validatePassword, validateResetPassword } = require('../models/client');
const express = require('express');
const router = express.Router();


router.get('/me', auth,  async (req, res, next) => {
   const client = await Client.findById(req.client._id).select('-password');
  //  console.log(client);
   res.send(client);
  
  });


router.post('/', async (req, res) => {
   
  let count;
  await Client.collection.countDocuments({}, (error, size)=>{
    if(error) throw error;
    count = size + 1; 
     return count;
   });
   const { error } = validate(req);
   console.log(error);
   if (error) return res.status(400).send(error.details[0].message);

   let client = await Client.findOne({ emailAddress: req.body.emailAddress });
   if(client) return res.status(400).send('emailAddress already exist');

   client = await Client.findOne({ mobileNumber: req.body.mobileNumber });
   if(client) return res.status(400).send('mobileNumber already exist');

   if(count == undefined) return res.status(400).send('Server Error, Plese Try Again');
   client = new Client(addClient(req, count)); 

   const salt = await bcrypt.genSalt(10);
   client.password = await bcrypt.hash(client.password, salt);
   
   client = await client.save();
   res.send(_.pick(client, ['firstName', 'emailAddress']));
});

router.delete('/:id', [auth, admin], async (req,res)=>{
  const client = await Client.findByIdAndDelete(req.params.id);
   if(!client) return res.status(404).send('the client with given id is not available');
   res.send(client);
});

router.put('/balance',auth, async (req, res) =>{
    const client = await Client.findOne({ customerId: req.body.customerId});
    if(!client) return;
    const updatedBalance = req.body.walletBalance;

    client.walletBalance = updatedBalance;
     await client.save();
    res.status(200).send('JOINED SUCCESSFULLY');
  })

// create put route handler to update firstName, lastName, mobileNumber
router.put('/details',auth, async (req, res) => {
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
router.put('/password',auth, async (req, res) => {
  const client = await Client.findOne({ customerId: req.body.customerId});
  if(!client) return res.status(404).json('no user exists in db to update');;
  
  const { error } = validatePassword(req);
  if (error) return res.status(400).send(error.details[0].message);

  const validPassword = await bcrypt.compare(req.body.oldPassword, client.password);
  if(!validPassword) return res.status(400).send('Invalid Password');
  
  const salt = await bcrypt.genSalt(10);
  client.password = await bcrypt.hash(req.body.newPassword, salt);
   await client.save();
  res.send('Password Updated');
});

//create forgotPasswordReset handler
router.put('/resetPassword', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const client = await Client.findOne({ userName: req.body.userName});
  const { error } = validateResetPassword(req);
  if (error) return res.status(400).send(error.details[0].message);

  if(!client) {
    return res.status(404).json('no user exists in db to update');
  }else if(client){
    console.log('user exists');
    return bcrypt.hash(req.body.password, salt)
                      .then( newPassword => {
                         console.log(newPassword);
                         client.password = newPassword;
                         client.resetPasswordToken = null;
                         client.resetPasswordExpires = null;
                      })
                      .then(async () =>{
                      await client.save();
                       res.status(200).send({ message:'password updated'})
                      });
  }
});

//create app update notification handler
router.put('/update', async (req, res) => {
  if(req.body.update == true){
const clients = await Client.find();
await clients.forEach(client=> {
   client.update = req.body.update;
   client.version = req.body.version;
   client.save();
 });
 res.send('client Updated');
}else if(req.body.update == false ){
  const client = await Client.findOne({ userName: req.body.userName});
  if(!client) {
    return res.status(404).json('no user exists in db to update');
  }
  client.update = req.body.update;
  await client.save();
  res.send('App Updated');
}
});



function addClient(req, count){
  console.log('size:' + count);
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