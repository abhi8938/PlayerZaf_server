//This router hanles request for new matchDetails
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const { MatchDetail, validate } = require('../models/matchDetail');
const express = require('express');
const router = express.Router();

router.get('/open', auth, async (req, res) => {
  const matchdetails = await MatchDetail.find({ matchStatus: 'OPEN'});
  console.log(matchdetails);
  res.send(matchdetails);
});
router.get('/completed', auth, async (req, res) => {
  const matchdetails = await MatchDetail.find({ matchStatus: 'COMPLETED'});
  console.log(matchdetails);
  res.send(matchdetails);
});

router.get('/ongoing', auth, async (req, res) => {
  const matchdetails = await MatchDetail.find({ matchStatus: 'ONGOING'});
  console.log(matchdetails);
  res.send(matchdetails);
});

router.post('/',  async (req, res) => {
   //Validate request body
   const validation = validate(req);
   //  console.log(validation.error.details[0].message);
    if(validation.error){
        //400 bad request
        res.status(400).send(validation.error.details[0].message);   
    }
   
   let matchdetails = await MatchDetail.findOne({ matchId: req.body.matchId})
   if(matchdetails) return res.status(400).send('Duplicate MatchId')
   matchdetails = new MatchDetail(addMatchDetail(req));
    console.log(`response:${matchdetails}`);
    matchdetails = await matchdetails.save();    
    res.status(200).send(`MATCH ADDED: ${matchdetails.matchId}`);
  
});

function addMatchDetail(req){
  const addedMatchDetail={
        //TODO: handlepost request
        matchId: req.body.matchId,
        matchTitle: req.body.matchTitle,
        matchTime: req.body.matchTime,
        matchDate: req.body.matchDate,
        matchWinPrize: req.body.matchWinPrize,
        matchPerkill: req.body.matchPerkill,
        matchEntryFee: req.body.matchEntryFee,
        matchType: req.body.matchType,
        matchVersion: req.body.matchVersion,
        matchMap: req.body.matchMap
  }
  return addedMatchDetail;
}


module.exports = router; 