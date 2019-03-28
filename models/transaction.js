// this model contains schema and for single match document
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const transactionSchema = new mongoose.Schema({
       TxnId:{
           type:String,
           required:true,
       },
       customerId:{
        type:String
       },
       TxnDate:{
           type:String,
       },
       Amount:{
           type:Number
       },
       TxnStatus:{
           type:String
       },
       TxnType:{
           type:String,
           enum: [ 'ADDED', 'WITHDRAWN']
       }


});

//create model/class which takes argument matchSchema and collection in which it should be updated

const Transaction = mongoose.model('Transactions', transactionSchema);

function validateTransaction(req){
    const schema = {
        customerId: Joi.string().required(),
        TxnId: Joi.string().required(),
        Amount: Joi.number().min(5).required(),
        TxnStatus: Joi.string().required(),
        TxnDate: Joi.string().required(),
        TxnType: Joi.string().required()
    };

    return Joi.validate(req.body, schema);
     
}

exports.Transaction= Transaction;
exports.validate = validateTransaction;