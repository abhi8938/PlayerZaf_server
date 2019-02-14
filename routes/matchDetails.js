//This router hanles request for new matchDetails
const { Details } = require('../models/matchDetail');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const matchdetails = await Details.find();
  res.send(matchdetails);
});

router.post('/', async (req, res) => {
  let details = new Details({ 

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
  });
  details = await details.save();
   res.send(details);
  console.log('result:'+ details);
});



module.exports = router; 