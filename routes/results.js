//This router hanles request for new Results
const bcrypt = require('bcrypt');
const _ = require('lodash');
const asyncMiddleware = require('../middleWare/async');
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const { Result, validate } = require('../models/result');
const { updateWinnings, updateMatchStatus } = require('../methods');
const express = require('express');
const router = express.Router();


router.get('/', auth, async (req, res, next) => {
  const results = await Result.findOne({ matchId:req.headers.matchid});
  console.log(results);
  res.send(results);

});
router.post('/', async (req, res) => {

  const { error } = validate(req);
  if (error) return res.status(400).send(error.details[0].message);

  let result = new Result(addResult(req));
  result = await result.save();
 await updateWinnings(result);
 await updateMatchStatus(req.body.matchId);
  res.send(result);
});


function addResult(req) {

  const addedResult = {
    matchId: req.body.matchId,
    playerResults: req.body.playerResults
  };
  return addedResult;
}


module.exports = router; 