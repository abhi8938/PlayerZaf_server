// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const { Participant, validate} = require('../models/participant');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { updateParticipants } = require('../methods');

router.get('/', async (req, res) => {
    const participants = await Participant.find({matchId:req.headers.matchid});
    res.send(participants);
  });

  router.post('/', async (req, res) => {
    //Validate request body
 
    const validation = validate(req);
    //  console.log(validation.error.details[0].message);
     if(validation.error){
         //400 bad request
         res.status(400).send(validation.error.details[0].message);   
     }
   let participants = new Participant(addParticipantDetail(req));
 
   try{
     participants = await participants.save();
   const result =  await updateParticipants(participants.matchId);
  //  console.log(result);
     res.send(participants);
   }
   catch(ex){
     for(field in ex.error){
       console.log(ex.errors[field]);
     }
   }
 });


function addParticipantDetail(req){
    const addedParticipantDetail={
          //TODO: handlepost request
          matchId: req.body.matchId,
          playerName: req.body.playerName,
          userName: req.body.userName,
          mobileNumber: req.body.mobileNumber,
          customerId: req.body.customerId

    }
    return addedParticipantDetail;
}

module.exports = router;