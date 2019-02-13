const Express = require('express');
const router = Express.Router();

var playerList = [
    { 
        id:1,
        playerName: 'goku',
        ClientSignIn: 'abhishek8938',
        walletId: '12314134',
    
    },
    { 
        id:2,
        playerName: 'vegeta',
        ClientSignIn: 'goku8938',
        walletId: '434345364',
    
    }
]
router.get('/', (req, res) => {
    res.send(playerList);
})

router.post('/', (req, res)=>{
    const player = {
        id: playerList.length + 1,
        playerName: req.body.playerName,
        ClientSignIn:  req.body.ClientSignIn,
        walletId: req.body.walletId
    };
    playerList.push(player);
    res.send(player);
});

module.exports = router;
