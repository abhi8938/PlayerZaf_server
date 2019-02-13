const Express = require('express');
const router = Express.Router();


const matchResult = [{
    id: 1,
    playername: 'goku',
    kills: 10,
    winner: false
},
{
    id:2,
    playername: 'vegeta',
    kills: 20,
    winner: true
},
{
    id:3,
    playername: 'krillin',
    kills: 8,
    winner: false
}
]
router.get('/', (req, res) => {
    res.send(matchResult);
});
router.post('/', (req,res) => {
    const playerResult = {
        id: matchResult.length + 1,
        playerName: req.body.playerName,
        kills:  req.body.kills,
        winner: req.body.winner
    };
    matchResult.push(playerResult);
    res.send(playerResult);
});

module.exports = router;