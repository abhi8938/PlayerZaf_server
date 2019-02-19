// This router handles request for matches

const {Match, validate} = require('../models/match')
const express = require('express');
const router = express.Router();

//create Get request handler
router.get('/', async (req,res) => {
const match = await Match.find({ status:'close'});
    res.send(match);
    console.log(match);
});

// create Post request Handler
router.post('/', async (req, res) =>{
     //Validate request body

     const validation = validate(req);
    //  console.log(validation.error.details[0].message);
     if(validation.error){
         //400 bad request
         res.status(400).send(validation.error.details[0].message);   
     }


    //create object of Class/Model to post data init  
    const match = new Match(addNewMatch(req));
    
    //save new match document in collection  
    try{
    const result = await match.save();
    res.send('posted') 
    }
    catch(ex){
    for( field in ex.error){
        console.log(ex.errors[field]);
    }
}
   
})

//create function to add new document in collection
function addNewMatch(req){
    const addedMatch = {
            matchDetails:req.body.matchDetails,
            status:req.body.status,
            participantList:req.body.participantList      
    }
    return addedMatch;
}

module.exports = router;

