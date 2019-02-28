//This router hanles request for new matchDetails
const auth = require('../middleWare/auth');
const { MatchDetail, validate } = require('../models/matchDetail');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const matchdetails = await MatchDetail.find({matchStatus: req.params.matchStatus});
  console.log(matchdetails);
  res.send(matchdetails);
});

router.post('/', async (req, res) => {
   //Validate request body
   const validation = validate(req);
   //  console.log(validation.error.details[0].message);
    if(validation.error){
        //400 bad request
        res.status(400).send(validation.error.details[0].message);   
    }
  let matchdetails = new MatchDetail(addMatchDetail(req));

  try{
    matchdetails = await matchdetails.save();
    res.send(matchdetails);
  }
  catch(ex){
    for(field in ex.error){
      console.log(ex.errors[field]);
    }
  }
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