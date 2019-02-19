const startupDebugger = require('debug')('app:startup');
const mongoose = require('mongoose');
const matchDetails = require('./routes/matchDetails');
const participantlist = require('./routes/participantlist');
const orders = require('./routes/orders');
const matches = require('./routes/matches');
const clients = require('./routes/clients');
const express = require('express')
const app = express();

app.use(express.json());
startupDebugger('first start');

// routes  
app.use('/api/matchDetails', matchDetails);
app.use('/api/matches', matches);
app.use('/api/participantList', participantlist);
app.use('/api/orders', orders);
app.use('/api/clients', clients);
//connect database

mongoose.connect('mongodb://localhost/pubgC-db')
.then(() => console.log('connected to mongodb....'))
.catch(err => console.error('could not connect', err));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}....`)); 