//This router hanles request for new matchDetails
const auth = require('../middleWare/auth');
const admin = require('../middleWare/admin');
const { Participant} = require('../models/participant');

const { MatchDetail, validate } = require('../models/matchDetail');
const express = require('express');
const router = express.Router();

router.get('/open', auth, async (req, res) => {
  const matchdetails = await MatchDetail.find({ matchStatus: 'OPEN'});
  res.send(matchdetails);
});
router.get('/completed', auth, async (req, res) => {
  const result = new Array();
 const matchdetails = await MatchDetail
                    .find({ matchStatus: 'COMPLETED'})
                    .sort({matchId:-1})
                    .limit(10);
     matchdetails.map( element =>{
       result.push(element);
     })              
             result.map(async element => {
             const participant = await Participant.findOne({matchId:element.matchId, customerId:req.headers.customerid });
              if(participant){
                   element.Join = 'JOINED';
              }
              else{ 
                element.Join = 'NOTJOINED';
              }
               });   
  res.send(result);
});

router.get('/ongoing', auth, async (req, res) => {
  var result2 = new Array();
  const matchdetails = await MatchDetail.find({ matchStatus: 'ONGOING'})
                                      .sort({matchId:-1})
                                      .limit(10);
       matchdetails.map( element =>{
            result2.push(element);
         });     
         result2.map(async element => {  
          const participant = await Participant.findOne({matchId:element.matchId, customerId:req.headers.customerid });
           if(participant){
                element.Joined = true;           
           }
           else{ 
             element.Joined = false;
           }
        
            });  
            console.log(result2);
  res.send(result2);
});
//create route to add image to matches
router.put('/', async (req,res) =>{
  let matchdetail = await MatchDetail.findOne({ matchId: req.body.matchId});
  if(!matchdetail) return res.status(400).send('Invalid MatchId');
   if(req.body.posterLink != null){ 
     matchdetail.posterLink = req.body.posterLink;
     matchdetail = await matchdetail.save();
     res.status(200).send('Added Link');
    }else{
      res.status(400).send('Image Address Empty');
    }
})

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