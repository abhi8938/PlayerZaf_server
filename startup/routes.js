// const error = require('../middleWare/error');
const express = require('express');
const clients = require('../routes/clients');
const matchDetails = require('../routes/matchDetails');
const participants = require('../routes/participants');
const orders = require('../routes/orders');
const matches = require('../routes/matches');
const auth = require('../routes/auth');
const result = require('../routes/results');
const paytm = require('../routes/paytm/paytm.routes')

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/matchDetails', matchDetails);
app.use('/api/matches', matches);
app.use('/api/participants', participants);
app.use('/api/orders', orders);
app.use('/api/clients', clients);
app.use('/api/auth', auth);
app.use('/api/results', result);
app.use('/paytm', paytm);
}