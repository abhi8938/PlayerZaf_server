// const error = require('../middleWare/error');
const express = require('express');
const users = require('../routes/users');
const matchDetails = require('../routes/matchDetails');
const participants = require('../routes/participants');
const orders = require('../routes/orders');
const cashOrders = require('../routes/cashOrders');
const matches = require('../routes/matches');
const auth = require('../routes/auth');
const result = require('../routes/results');
const sendmessage = require('../routes/sendMessage');
const paytm = require('../app/routes/paytm.routes');
const transaction = require('../routes/transactions');
const resetPassword = require('../routes/resetPassword');
const resetToken = require('../routes/resetToken');


module.exports = function(app) {
    app.use(express.json());
    app.use('/api/matchDetails', matchDetails);
app.use('/api/matches', matches);
app.use('/api/participants', participants);
app.use('/api/orders', orders);
app.use('/api/cashOrders', cashOrders);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/results', result);
app.use('/api/sendMessage', sendmessage);
app.use('/api/paytm', paytm);
app.use('/api/transaction', transaction);
app.use('/api/resetPassword', resetPassword);
app.use('/api/reset', resetToken);
}