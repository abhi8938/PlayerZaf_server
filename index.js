const startupDebugger = require('debug')('app:startup');
const playerList = require('./routes/playerList');
const matchResult = require('./routes/matchResult');
const express = require('express');
const app = express();

app.use(express.json());
startupDebugger('first start');

// routes  
app.use('/api/playerList', playerList);
app.use('/api/matchResult', matchResult);



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}....`)); 