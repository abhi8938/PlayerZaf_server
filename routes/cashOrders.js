//this router handles request for new order
const auth = require('../middleWare/auth');
const { CashOrder, validate } = require('../models/cashOrder');
const express = require('express');
const router = express.Router();
const { generateToken, addMoneyWallet } = require('../methods');

router.get('/', async (req, res) => {
  const cashOrders = await CashOrder.find();
  // console.log(cashOrders);
  res.send(cashOrders);
});

router.post('/', async (req, res) => {
  let count;
  await CashOrder.estimatedDocumentCount({}, (error, size)=>{
    if(error) return res.status(400).send('order id not generated please try again')
     count = size + 1; 
     return count;
   });
   const validation = validate(req);
    if(validation.error){
        //400 bad request
       return res.status(400).send(validation.error.details[0].message);   
    }
    let cashOrders = await CashOrder.find();
    cashOrders = new CashOrder(addOrder(req,count));
    //call generate token api with data to get token
    const token = await generateToken(cashOrders.orderId, cashOrders.amount);
    //send token and order id in response
    cashOrders = await cashOrders.save();
    const response = {
        Token: token.body.cftoken,
        orderId: cashOrders.orderId,
        amount: cashOrders.amount
    }
    res.send(response);
});


router.put('/update', async (req, res) => {
  //find the order with orderId and update with data received in response
   res.status(400).send('Transaction Failed due to network Error');
  })
  
router.put('/', async (req, res) => {
//find the order with orderId and update with data received in response
   console.log(req.body);
   let order = await CashOrder.findOne({ orderId: req.body.orderId })
   if(!order) return res.status(400).send('Order Not Found, Try Again');
   order.status = req.body.status;
   order = await order.save();
   if(order.status == 'FAILED'){
    //  console.log(order);
     res.send(order);
   }else{
    await addMoneyWallet(order.customer_Id,order.amount);
    res.send(order);
   }
})


function addOrder(req, count){
 const addedOrder={
        //TODO: handlepos request
        customer_Id: req.body.customer_Id,
        amount: req.body.amount,
        currency: 'INR',
        orderId: `TXNN-${count}`,
        customerEmailId: req.body.customerEmailId,
        customerMobile: req.body.customerMobile,
        created_at:Date.now()
  }
  return addedOrder;
}



module.exports = router; 
