// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const { Participant, validate} = require('../models/participant');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { updateParticipants, updateWallet } = require('../methods');

router.get('/', auth, async (req, res) => {
    const participants = await Participant.find({matchId:req.headers.matchid});
    if(participants == [] ) return res.status(400).send('Invalid MatchID');
    // console.log(req.headers);
    res.send(participants);
  });

  router.post('/',auth, async (req, res) => {
    //Validate request body
 
    const validation = validate(req);
    //  console.log(validation.error.details[0].message);
     if(validation.error){
         //400 bad request
         res.status(400).send(validation.error.details[0].message);   
     }

     let participants = await Participant.findOne({ matchId:req.body.matchId, playerName:req.body.playerName});
      if(participants) return res.status(400).send('player already registered');
     participants = new Participant(addParticipantDetail(req));
 
   try{
     participants = await participants.save();
   const result =  await updateWallet(participants.matchId, participants.customerId);
   console.log(result);
   if(result == 'JOINED SUCCESSFULLY'){
     console.log(result);
     res.status(200).send(result);
   }else{
     res.status(400).send('Something went wrong try again');
   }
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