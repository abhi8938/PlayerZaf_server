// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const { Participant, validate} = require('../models/participant');
const { MatchDetail } = require('../models/matchDetail');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { updateWallet, promoCode } = require('../methods');

router.get('/', auth, async (req, res) => {
    const participants = await Participant.find({matchId:req.headers.matchid});
    if(participants == []) return res.status(400).send('Invalid MatchID');
    res.send(participants);
  });

  
router.get('/Joined', auth, async (req, res) => {
    const participant = await Participant.findOne({matchId:req.headers.matchid, customerId:req.headers.customerid });
    if(!participant) return res.status(400).send('Not Joined');

    res.status(200).send('Joined');
  });

  router.post('/', auth, async (req, res) => {
    const validation = validate(req);
     if(validation.error){
         //400 bad request
         res.status(400).send(validation.error.details[0].message);   
     }
     const matchDetails = await MatchDetail.findOne({ matchId:req.body.matchId});
     if(matchDetails.matchParticipants >= 100) return res.status(400).send('Match Full');

     let participants = await Participant.findOne({ matchId:req.body.matchId, customerId:req.body.customerId });
     if(participants) return res.status(400).send('customer already registered');
     participants = await Participant.findOne({ matchId:req.body.matchId, playerName:req.body.playerName }); 
     if(participants) return res.status(400).send('player already registered');
     //fadfsfrff
     participants = new Participant(addParticipantDetail(req));
     await updateWallet(participants.matchId, participants.customerId);
     participants = await participants.save();
     await promoCode(participants.customerId);
     res.status(200).send('JOINED SUCCESSFULLY');
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