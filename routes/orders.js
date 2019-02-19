//this router handles request for new order
const { Order, validate } = require('../models/order');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const orders = await Order.find();
    res.send(orders);
  });

  router.post('/', async (req, res) => {
    //Validate request body
 
    const validation = validate(req);
    //  console.log(validation.error.details[0].message);
     if(validation.error){
         //400 bad request
         res.status(400).send(validation.error.details[0].message);   
     }
   let orders = new Order(addOrder(req));
 
   try{
     orders = await orders.save();
     res.send(orders);
   }
   catch(ex){
     for(field in ex.error){
       console.log(ex.errors[field]);
     }
   }
 });
 

  function addOrder(req){
    const addedOrder={
          //TODO: handlepost request
        orderId:req.body.orderId,
        customerId:req.body.customerId,
        txnAmount:req.body.txnAmount,
        customerEmailId:req.body.customerEmailId,
        customerMobile:req.body.customerMobile

    }
    return addedOrder;
  }

  module.exports = router;