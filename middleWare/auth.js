const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No Token');
    try{
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.client = decoded;  
    next();
}   
   catch(ex){
       console.log(token);
       res.status(400).send('Invalid token');
   }
}

