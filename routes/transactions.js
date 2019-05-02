// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const { Transaction, validate} = require('../models/transaction');
const express = require('express');
const router = express.Router();
const { addMoneyWallet } = require('../methods');

router.get('/',auth, async (req, res) => {
    const transactions = await Transaction.find();
    res.send(transactions);
  });

  router.get('/count', auth, async (req, res) => {
    const transactions = await Transaction.estimatedDocumentCount();
    // console.log(transactions);  
    res.send(transactions.toString());
  });  

  router.post('/',auth, async (req, res) => {
    //Validate request body
 
    const validation = validate(req);
    //  console.log(validation.error.details[0].message);
     if(validation.error){
         //400 bad request
         res.status(400).send(validation.error.details[0].message);   
     }
  //  let transactions = new Transaction(addTransaction(req));
 
   
     transactions = await transactions.save();
   console.log(transactions,req.body);
   if(transactions.TxnStatus == 'SUCCESS'){
    const response = await addMoneyWallet(transactions.customerId, transactions.Amount);
    res.status(200).send(response);
   }else{
    res.status(400).send('Payment Failed, Please Retry');
   }
 });


function addTransaction(req){
    const addedTransaction={
          //TODO: handlepost request
          customerId: req.body.customerId,
          TxnId: req.body.TxnId,
          Amount: req.body.Amount,
          TxnStatus: req.body.TxnStatus,
          TxnDate: Date.now(),
          TxnType: 'ADDED'

    }
    return addedTransaction;
}

module.exports = router;