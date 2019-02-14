//this router handle request for playerList for single match

const { Player } = require('../models/player');
const Express = require('express');
const router = Express.Router();

router.get('/', async (req, res) => {
    const player = await Player.find();
    res.send(player);
});

router.post('/', async (req, res)=>{
    let player = new Player ({
        playerId: Player.length,
        playerName: req.body.playerName,
        ClientSignIn:  req.body.ClientSignIn,
        walletId: req.body.walletId
    });
    
   player = await player.save();
    res.send(player);
});

module.exports = router;
