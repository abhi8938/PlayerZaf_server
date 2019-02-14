const startupDebugger = require('debug')('app:startup');
const mongoose = require('mongoose');
const playerList = require('./routes/playerList');
// const matchResult = require('./routes/matchResult');
// const matches = require('./routes/matches');
const matchDetails = require('./routes/matchDetails');
const express = require('express');
const app = express();

app.use(express.json());
startupDebugger('first start');

// routes  
app.use('/api/playerList', playerList);
// app.use('/api/matchResult', matchResult);
// app.use('/api/matches', matches);
app.use('/api/matchDetails', matchDetails);

//connect database

mongoose.connect('mongodb://localhost/pubgC-db')
.then(() => console.log('connected to mongodb....'))
.catch(err => console.error('could not connect', err));





const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}....`)); 