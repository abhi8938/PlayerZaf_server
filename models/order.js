// this modal contains schema for single order document
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const orderSchema = new mongoose.Schema({
       
    orderId:{
        type:String,
        required:true
    },
    customerId:{
        type:String,
        required:true
    },
    txnAmount:{
        type:String,
        required:true
    },
    customerEmailId:{
        type:String,
        required:true
    },
    customerMobile:{
          type:String,
          required:true
    }

});


//create model/class which takes argument participantSchema and collection in which it should be updated

const Order = mongoose.model('Orders', orderSchema );

function validateOrder(req){
    const schema = {
        orderId: Joi.string().required(),
        customerId: Joi.string().required(),
        txnAmount: Joi.string().required(),
        customerEmailId: Joi.string().required(),
        customerMobile: Joi.string().required()
    };

    return Joi.validate(req.body, schema);
     
}

exports.validate = validateOrder;
exports.Order = Order;