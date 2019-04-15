//this router handles request for new order
const auth = require('../middleWare/auth');
const { CashOrder, validate } = require('../models/cashOrder');
const express = require('express');
const router = express.Router();
const { generateToken } = require('../methods');

router.get('/', async (req, res) => {
  const cashOrders = await CashOrder.find();
  console.log(cashOrders);
  res.send(cashOrders);
});

router.post('/',auth, async (req, res) => {
  let count;
  await CashOrder.collection.countDocuments({}, (error, size)=>{
    if(error) throw error;
    count = size + 1; 
     return count;
   });
   const validation = validate(req);
    if(validation.error){
        //400 bad request
        res.status(400).send(validation.error.details[0].message);   
    }
    let cashOrders = await CashOrder.find();
   cashOrders = new CashOrder(addOrder(req,count));
  try{
    cashOrders = await cashOrders.save();
    //call generate token api with data to get token
    const token = await generateToken(cashOrders.orderId, cashOrders.amount);
    //send token and order id in response
    const response = {
        Token: token.body.cftoken,
        orderId: cashOrders.orderId
    }
    res.send(response);
  }

  catch(ex){
    for(field in ex.error){
      console.log(ex.errors[field]);
    }
  }
});


router.put('/',auth, async (req, res) => {
//find the order with orderId and update with data received in response

})


function addOrder(req, count){
 const addedOrder={
        //TODO: handlepos request
        customer_Id: req.body.customer_Id,
        amount: req.body.amount,
        currency: 'INR',
        orderId: `ORDERS-${count}`,
        customerEmailId: req.body.customerEmailId,
        customerMobile: req.body.customerMobile,
  }
  return addedOrder;
}



module.exports = router; 
