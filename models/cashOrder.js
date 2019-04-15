// this modal contains schema for single order document
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const orderSchema = new mongoose.Schema({

    customer_Id:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        required:true
    },
    referenceId:{
        type:Number
    },
    orderId:{
        type:String,
        required:true
    },
    status:{
        type:String
    },
    customerEmailId:{
        type:String,
        required:true
    },
    customerMobile:{
          type:String,
          required:true
    },
    created_at:{
        type:Number,
        default:Date.now()
    }

});

//create modl/class which takes argument participantSchema and collection in which it should be updated

const CashOrder = mongoose.model('cashOrders', orderSchema );

function validateOrder(req){
    const schema = {
        customer_Id: Joi.string().required(),
        amount: Joi.number().max(300000).required(),
        currency: Joi.string(),
        referenceId: Joi.number(),
        orderId: Joi.string(),
        status: Joi.string(),
        customerEmailId: Joi.string().required(),
        customerMobile: Joi.string().min(10).required(),
        created_at: Joi.number()
    };

    return Joi.validate(req.body, schema);
     
}

exports.validate = validateOrder;
exports.CashOrder = CashOrder;