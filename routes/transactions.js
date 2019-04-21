// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const { Transaction, validate} = require('../models/transaction');
const express = require('express');
const router = express.Router();
const { addMoneyWallet } = require('../methods');

router.get('/', async (req, res) => {
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
   let transactions = new Transaction(addTransaction(req));
 
   try{
     transactions = await transactions.save();
  //  console.log(result);
     res.send(transactions);
   }
   catch(ex){
     for(field in ex.error){
       console.log(ex.errors[field]);
     }
   }
 });


function addTransaction(req){
    const addedTransaction={
          //TODO: handlepost request
          customerId: req.body.customerId,
          TxnId: req.body.TxnId,
          Amount: req.body.Amount,
          TxnStatus: req.body.TxnStatus,
          TxnDate: req.body.TxnDate,
          TxnType: req.body.TxnType

    }
    return addedTransaction;
}

module.exports = router;