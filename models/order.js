// this modal contains schema for single order document
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const orderSchema = new mongoose.Schema({

       
    RAZORPAY_ID:{
        type:String  
    },
    customer_Id:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        required:true
    },
    receipt:{
        type:String,
        required:true
    },
    payment_capture:{
        type:Boolean,
        required:true
    },
    status:{
        type:String
    },
    attempt:{
        type:Number
    },
    notes:{
     type:String
    },
    customerEmailId:{
        type:String,
        required:true
    },
    customerMobile:{
          type:Number,
          required:true
    },
    razorpay_payment_id:{
        type: String,
    },
    created_at:{
        type:Number
    }

});


//create modl/class which takes argument participantSchema and collection in which it should be updated

const Order = mongoose.model('Orders', orderSchema );

function validateOrder(req){
    const schema = {
        RAZORPAY_ID: Joi.string(),
        customer_Id: Joi.string().required(),
        amount: Joi.number().max(300000).required(),
        currency: Joi.string(),
        receipt: Joi.string(),
        payment_capture: Joi.string(),
        status: Joi.string(),
        attempt: Joi.string(),
        notes: Joi.string(),
        customerEmailId: Joi.string().required(),
        customerMobile: Joi.number().min(10).required(),
        created_at: Joi.number(),
        razorpay_payment_id: Joi.string()
    };

    return Joi.validate(req.body, schema);
     
}

exports.validate = validateOrder;
exports.Order = Order;