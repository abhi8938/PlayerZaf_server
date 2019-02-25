//this router handles request for new order
const { Order, validate } = require('../models/order');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { generateCheckSumHash }= require('../methods');

router.get('/', async (req, res) => {
    const orders = await Order.find();
    res.send(orders);
  });

  router.post('/', async (req, res) => {
    console.log("request recieved: " + req.body);
   try{
     res.redirect('/testtxn');
   }
   catch(ex){
     for(field in ex.error){
       console.log(ex.errors[field]);
     }
   }
 });
 

  // function addOrder(req, count){
  //   const addedOrder={
  //         //TODO: handlepost request
        
  //       CUSTOMER_Id:req.body.customerId,
  //       txnAmount:req.body.txnAmount,
  //       customerEmailId:req.body.customerEmailId,
  //       customerMobile:req.body.customerMobile,
  //       // ORDER_ID: req.body.ORDER_ID

  //   }
  //   return addedOrder;
  // }

  module.exports = router;