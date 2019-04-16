//this router handles request for new order
const auth = require('../middleWare/auth');
const Razorpay = require('razorpay');
const { Order, validate } = require('../models/order');
const express = require('express');
const router = express.Router();
const { authorizePayment } = require('../methods');

let rzp = new Razorpay({
  key_id: 'rzp_live_Osjem2QarhHF8m', // your `KEY_ID`
  key_secret:'naAmOknspcgDOpUV9EpejXDh' // your `KEY_SECRET`
});

router.get('/',auth, async (req, res) => {
  const orders = await Order.find();
  console.log(orders);
  res.send(orders);
});

router.post('/',auth, async (req, res) => {
  let count;
  await Order.collection.countDocuments({}, (error, size)=>{
    if(error) return res.status(404).send('Something went wrong!');
    count = size + 1; 
     return count;
   });
   //Validate request body
   const validation = validate(req);
   //  console.log(validation.error.details[0].message);
    if(validation.error){
        //400 bad request
        res.status(400).send(validation.error.details[0].message);   
    }
    console.log(req.body);
    let orders = await Order.find();
    const order = await createOrder(req,count);
   orders = new Order(addOrder(req, order));
  try{
    orders = await orders.save();
    console.log('orders:' + orders);
    res.send(orders);
  }

  catch(ex){
    for(field in ex.error){
      console.log(ex.errors[field]);
    }
  }
});

//create route to handle put request for   razorpay_payment_id

router.put('/', auth, async (req, res) => {
  //add   razorpay_payment_id in database
const order = await Order.findOne({ RAZORPAY_ID: req.body.razorpay_order_id})
if(!order) return res.status(400).send('Oops Something went wrong!..Try Again ');

order.razorpay_payment_id = req.body.razorpay_payment_id
await order.save();

//Call function AuthorizePayment to capture payment
const paymentresult = await authorizePayment(req);
res.send(paymentresult);

})


function addOrder(req, order){
  const amount = order.amount/100
 const addedOrder={
        //TODO: handlepos request
        RAZORPAY_ID: order.id,
        customer_Id: req.body.customer_Id,
        amount: amount,
        currency: 'INR',
        receipt: order.receipt,   //CREATE RANDOM RECEIPT STRING
        payment_capture: true,
        status: order.status,
        attempt: order.attempt,
        notes: 'Payment Test 1', 
        customerEmailId: req.body.customerEmailId,
        customerMobile: req.body.customerMobile,
        created_at:order.created_at
  }
  return addedOrder;
}

async function createOrder(req, count){

  const amount= req.body.amount;
  const currency= 'INR';
  const receipt= 'RECEIPT#' + count;
  const payment_capture = true;
  const notes='Payment Test 3'; 

  return rzp.orders.create({
   amount,
   currency,
   receipt,
   payment_capture,
   notes

  }).then((data) => {
    return data;
  }).catch((err) => {
    return err;
  }); 
}

module.exports = router; 
