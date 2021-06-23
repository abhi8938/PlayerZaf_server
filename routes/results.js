//This router hanles request for new Results
const bcrypt = require('bcrypt');
const _ = require('lodash');
const asyncMiddleware = require('../middleWare/async');
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const { Result, validate, validatePlayer } = require('../models/result');
const { updateWinnings, updateMatchStatus } = require('../methods');
const express = require('express');
const router = express.Router();


router.get('/', auth, async (req, res, next) => {
  const results = await Result.findOne({ matchId:req.headers.matchid});

  res.send(results);

});
router.post('/', async (req, res) => {

  const { error } = validate(req);
  if (error) return res.status(400).send(error.details[0].message);

  let result = await Result.findOne({ matchId:req.body.matchId});
  if(result) return res.status(400).send('Result Already Declared');

  const playerResults = req.body.playerResults;
  const playerErrors = new Array;
  playerResults.forEach(playerResult => {
    const { error } = validatePlayer(playerResult);
    if (error) {
    playerErrors.push(`${error.details[0].message} for playerName ${playerResult.playerName}`);
    }
  });

  if(playerErrors == null){
    return res.status(400).send(playerErrors.toString());
  }else if(playerErrors != null){

    result = new Result(addResult(req));
  result = await result.save();
  await updateWinnings(result);
  await updateMatchStatus(req.body.matchId);
  return res.status(200).send(`RESULT DECLARED: ${result.matchId}`);
  }
  
  
});


function addResult(req) {

  const addedResult = {
    matchId: req.body.matchId,
    playerResults: req.body.playerResults
  };
  return addedResult;
}


module.exports = router; 